import { useState, useMemo } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";

import { PAGE_SIZE } from "src/types/globalTypes";
import { dgroupRepository } from "../data/dgroupRepository";
import { mapDGroupLeaderToUI } from "../data/dgroup.mapper";
import { DGroupLeaderItemUI } from "../model/DGroupItemUI";
import { Gender } from "src/types/enums/Gender";
import { DGroupType } from "src/types/enums/LifeStage";

// =========================
// 🔑 QUERY KEYS
// =========================
const dgroupLeaderKeys = {
	all: ["dgroup-leaders"] as const,
	lists: (search: string) => ["dgroup-leaders", search] as const,
};

export const useDGroupLeadersViewModel = () => {
	const [search, setSearch] = useState("");

	// =========================
	// 📄 DGROUP LEADERS LIST (INFINITE)
	// =========================
	const leadersQuery = useInfiniteQuery({
		queryKey: dgroupLeaderKeys.lists(search),

		queryFn: async ({ pageParam = 1 }) => {
			const skip = (pageParam - 1) * PAGE_SIZE;

			const result = await dgroupRepository.getDGroupLeaders(
				{
					...(search.trim() && { search }),
					skip,
					take: PAGE_SIZE,
				},
				{ gender: Gender.Male, type: DGroupType.Singles, exemptedAccountId: 0 },
			);

			return {
				data: result?.data?.map(mapDGroupLeaderToUI) ?? [],
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
	const leaders = useMemo<DGroupLeaderItemUI[]>(
		() => leadersQuery.data?.pages.flatMap((p) => p.data) ?? [],
		[leadersQuery.data],
	);

	// =========================
	// 🎯 ACTIONS
	// =========================
	return {
		// data
		leaders,

		// loading states
		loading: leadersQuery.isLoading,
		fetching: leadersQuery.isFetching,

		// actions
		searchLeaders: setSearch,

		loadMoreLeaders: () =>
			leadersQuery.hasNextPage && leadersQuery.fetchNextPage(),

		refresh: leadersQuery.refetch,

		hasMore: leadersQuery.hasNextPage,
	};
};
