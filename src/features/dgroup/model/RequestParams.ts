import { Gender } from "src/types/enums/Gender";
import { DGroupType } from "src/types/enums/LifeStage";

export type GetDGroupParams = {
	skip?: number;
	take?: number;
	sortOrder?: string;
	sortBy?: string;
	search?: string;
};

export type GetDGroupLeadersParams = {
	exemptedAccountId: number;
	gender: Gender;
	type: DGroupType;
};
