import { useState, useMemo } from "react";
import {
	useInfiniteQuery,
	useMutation,
	useQueryClient,
} from "@tanstack/react-query";

import { DGroupDTO } from "../model/DGroup";
import { DGroupItemUI } from "../model/DGroupItemUI";
import { PAGE_SIZE } from "src/types/globalTypes";
import { mapDGroupToUI } from "../data/dgroup.mapper";
import { dgroupRepository } from "../data/dgroupRepository";

// =========================
// 🔑 QUERY KEYS
// =========================
const dgroupKeys = {
	all: ["dgroups"] as const,
	lists: (search: string) => ["dgroups", search] as const,
};

export const useDGroupViewModel = () => {
	const queryClient = useQueryClient();
	const [search, setSearch] = useState("");

	// =========================
	// 📄 DGROUP LIST (INFINITE - SKIP/TAKE)
	// =========================
	const dgroupsQuery = useInfiniteQuery({
		queryKey: dgroupKeys.lists(search),

		queryFn: async ({ pageParam = 1 }) => {
			const skip = (pageParam - 1) * PAGE_SIZE;

			const result = await dgroupRepository.getDGroups({
				...(search.trim() && { search }),
				skip,
				take: PAGE_SIZE,
			});

			return {
				data: result?.data.map(mapDGroupToUI) ?? [],
				hasMore: result?.meta?.hasMore ?? false,
			};
		},

		getNextPageParam: (lastPage, pages) =>
			lastPage.hasMore ? pages.length + 1 : undefined,

		initialPageParam: 1,
		staleTime: 1000 * 60 * 5,
	});

	// =========================
	// 🧠 FLATTEN
	// =========================
	const dgroups = useMemo<DGroupItemUI[]>(
		() => dgroupsQuery.data?.pages.flatMap((p) => p.data) ?? [],
		[dgroupsQuery.data],
	);

	// =========================
	// ➕ ADD
	// =========================
	const addDGroupMutation = useMutation({
		mutationFn: (data: Omit<DGroupDTO, "id">) =>
			dgroupRepository.addDGroup?.(data),

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: dgroupKeys.all });
		},
	});

	// =========================
	// ✏️ UPDATE (OPTIMISTIC)
	// =========================
	const updateDGroupMutation = useMutation({
		mutationFn: ({ id, data }: { id: string; data: Partial<DGroupDTO> }) =>
			dgroupRepository.updateDGroup?.(id, data),

		onMutate: async ({ id, data }) => {
			await queryClient.cancelQueries({
				queryKey: dgroupKeys.lists(search),
			});

			const previous = queryClient.getQueriesData({
				queryKey: dgroupKeys.lists(search),
			});

			queryClient.setQueriesData(
				{ queryKey: dgroupKeys.lists(search) },
				(old: any) => {
					if (!old?.pages) return old;

					return {
						...old,
						pages: old.pages.map((page: any) => ({
							...page,
							data: page.data.map((d: any) =>
								d.id.toString() === id ? { ...d, ...data } : d,
							),
						})),
					};
				},
			);

			return { previous };
		},

		onError: (_err, _vars, context) => {
			context?.previous?.forEach(([key, data]) => {
				queryClient.setQueryData(key, data);
			});
		},

		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: dgroupKeys.all });
		},
	});

	// =========================
	// 🎯 ACTIONS
	// =========================
	return {
		// data
		dgroups,

		// loading
		loading: dgroupsQuery.isLoading,
		fetching: dgroupsQuery.isFetching,

		// actions
		addDGroup: addDGroupMutation.mutateAsync,
		updateDGroup: (id: string, data: Partial<DGroupDTO>) =>
			updateDGroupMutation.mutateAsync({ id, data }),

		searchDGroups: setSearch,

		loadMoreDGroups: () =>
			dgroupsQuery.hasNextPage && dgroupsQuery.fetchNextPage(),

		refresh: dgroupsQuery.refetch,

		hasMore: dgroupsQuery.hasNextPage,
	};
};
