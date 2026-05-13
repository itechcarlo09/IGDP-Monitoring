import { Gender } from "src/types/enums/Gender";
import { PaginatedResponse } from "../../../types/paginationTypes";
import { LifeStage } from "src/types/enums/LifeStage";

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

export interface DGroupDTO {
	id: number;
	name: string;
	dleaders: DMemberDTO[];
	dmembers: DMemberDTO[];
	churchId: number;
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
