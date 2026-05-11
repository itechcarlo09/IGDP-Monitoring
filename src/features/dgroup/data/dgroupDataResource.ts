import apiClient from "../../../services/apiClient";
import {
	DGroupDTO,
	GetDGroupResponse,
} from "../../../features/dgroup/model/DGroup";
import {
	GetDGroupLeadersParams,
	GetDGroupParams,
} from "../../../features/dgroup/model/RequestParams";
import { PAGE_SIZE } from "src/types/globalTypes";
import { toast } from "@component/toast/toast";

export const dgroupDataSource = {
	// async getMinistriesById(id: string): Promise<MinistryDTO | null> {
	// 	try {
	// 		const res = await apiClient.get<MinistryDTO>(`/event/${id}`);
	// 		return res.data ? res.data : null;
	// 	} catch (error: any) {
	// 		throw new Error(error.message);
	// 	}
	// },
	async getDGroups(params?: GetDGroupParams): Promise<GetDGroupResponse> {
		try {
			const res = await apiClient.get<GetDGroupResponse>("/dgroup", {
				params,
			});
			return {
				data: res.data?.data ?? [], // always array
				meta: res.data?.meta ?? {
					page: 0,
					limit: PAGE_SIZE,
					hasMore: false,
				},
			};
		} catch (error: any) {
			toast.error(error);

			return {
				data: [], // fallback safe value
				meta: {
					page: 0,
					limit: PAGE_SIZE,
					hasMore: false,
				},
			};
		}
	},

	async getDGroupLeaders(
		params?: GetDGroupParams,
		body?: GetDGroupLeadersParams,
	): Promise<GetDGroupResponse> {
		try {
			const res = await apiClient.post<GetDGroupResponse>(
				"/account/dgroup-leaders",
				body,
				{
					params,
				},
			);

			return {
				data: res.data?.data ?? [],
				meta: res.data?.meta ?? {
					page: 0,
					limit: PAGE_SIZE,
					hasMore: false,
				},
			};
		} catch (error: any) {
			toast.error(error);

			return {
				data: [],
				meta: {
					page: 0,
					limit: PAGE_SIZE,
					hasMore: false,
				},
			};
		}
	},

	async getDGroupById(id: number): Promise<DGroupDTO | null> {
		try {
			const res = await apiClient.get<DGroupDTO>(`/dgroup/${id}`);
			return res.data ? res.data : null;
		} catch (error: any) {
			toast.error(error);
			return null;
		}
	},

	// async searchEvents(
	// 	params?: GetMinistryParams,
	// ): Promise<GetMinistryResponse | undefined> {
	// 	try {
	// 		const res = await apiClient.get<GetMinistryResponse>(`/event/search`, {
	// 			params,
	// 		});
	// 		return res.data ?? undefined;
	// 	} catch (error: any) {
	// 		console.error("searchtMinistries error:", error.message ?? error);
	// 		// Optional: You can throw a custom error or handle it gracefully
	// 		return undefined;
	// 	}
	// },
	// async add(user: Omit<Event, "id">): Promise<void> {
	// 	try {
	// 		await eventCollection.doc().set(eventConverter.toFirestore(user));
	// 	} catch (error) {
	// 		console.error("eventDataSource.add error:", error);
	// 	}
	// },
	// async update(id: string, data: Partial<Event>): Promise<void> {
	// 	try {
	// 		await eventCollection.doc(id).update({
	// 			...data,
	// 			updatedAt: firestore.Timestamp.now(),
	// 		});
	// 	} catch (error) {
	// 		console.error("eventDataSource.update error:", error);
	// 	}
	// },
	// async delete(id: string): Promise<void> {
	// 	try {
	// 		await eventCollection.doc(id).delete();
	// 	} catch (error) {
	// 		console.error("eventDataSource.delete error:", error);
	// 	}
	// },
};
