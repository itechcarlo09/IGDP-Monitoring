import UserType from "src/types/enums/UserType";
import { PaginatedResponse } from "../../../types/paginationTypes";
import { Gender } from "src/types/enums/Gender";
import { DGroupStatus } from "src/types/enums/DGroupStatus";

export interface SchoolDTO {
	id: number;
	address: string;
	name: string;
}

export interface EducationDTO {
	id: number;
	educationLevel: string;
	course?: string;
	startDate: Date;
	endDate?: Date;
	school: SchoolDTO;
}

export interface CompanyDTO {
	id: number;
	name: string;
	address: string;
}

export interface EmploymentDTO {
	id: number;
	position: string;
	startDate: Date;
	endDate?: Date;
	company: CompanyDTO;
}

export interface DGroupBasicInfoDTO {
	id: number;
	firstName: string;
	middleName?: string;
	lastName: string;
}

export interface UserDTO {
	id: number;
	firstName: string;
	middleName?: string;
	lastName: string;
	nickname?: string;
	birthDate: Date;
	spouse?: DGroupBasicInfoDTO;
	dGroupLeader?: DGroupBasicInfoDTO;
	dGroupMembers?: DGroupBasicInfoDTO[];
	profilePicture?: string;
	facebookLink?: string;
	contactNumber: string;
	email: string;
	gender: string;
	userType: string;
	isActive: boolean;
	dGroupStatus: DGroupStatus;
	emergencyContactName?: string;
	emergencyContactNumber?: string;
	education: EducationDTO[];
	employment: EmploymentDTO[];
	churchId: number;
}

export interface AddEducationDTO {
	accountId: number;
}

export interface CreateAccountDTO {
	basicInfo: CreateAccountBasicInfoDTO;
}

export interface CreateAccountBasicInfoDTO {
	firstName: string;
	middleName?: string;
	lastName: string;
	nickName?: string;
	profilePicture?: string;
	facebookLink?: string;
	contactNumber?: string;
	email: string;
	gender: Gender;
	birthDate: Date;
	userType: UserType;
	emergencyContactName?: string;
	emergencyContactNumber?: string;
	churchId: number;
}

export type GetUserResponse = PaginatedResponse<UserDTO>;
export { Gender };
