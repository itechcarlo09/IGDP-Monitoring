import { Gender } from "src/types/enums/Gender";
import { PaginatedResponse } from "../../../types/paginationTypes";
import { DGroupType, LifeStage } from "src/types/enums/LifeStage";

// export interface Speaker {
// 	id: number;
// 	name: string;
// 	accountId: number;
// 	updatedBy: Date;
// 	createdAt: Date;
// 	updatedAt: Date;
// }

// export interface EventSpeaker {
// 	speakerId: number;
// 	eventId: number;
// 	createdAt: Date;
// 	speaker: Speaker;
// }

export interface CoupleDTO {
	id: number;
	husband: Omit<DMemberDTO, "middleName" | "gender">;
	wife: Omit<DMemberDTO, "middleName" | "gender">;
}

export interface DGroupDTO {
	id: number;
	name: string;
	leader: Omit<DMemberDTO, "middleName" | "gender"> | CoupleDTO;
	dmembers: DMemberDTO[];
	type: DGroupType;
}

export interface DMemberDTO {
	id: number;
	firstName: string;
	middleName?: string;
	lastName: string;
	gender: Gender;
}

export interface DGroupListItemDTO {
	id: number;
	name: string;
	members: number;
	leaders: DMemberDTO[];
	lifestage: LifeStage[];
}

export interface DGroupCoupleLeaderListItemDTO {
	id: number;
	husbandId: number;
	husbandFirstName: string;
	husbandMiddleName: string;
	husbandLastName: string;
	wifeId: number;
	wifeFirstName: string;
	wifeMiddleName: string;
	wifeLastName: string;
}

export type GetDGroupResponse =
	PaginatedResponse<DGroupCoupleLeaderListItemDTO>;
