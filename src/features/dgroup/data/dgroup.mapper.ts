import {
	DGroupCoupleLeaderListItemDTO,
	DGroupListItemDTO,
	DMemberDTO,
} from "../../../features/dgroup/model/DGroup";
import {
	DGroupItemUI,
	DGroupLeaderItemUI,
} from "../../../features/dgroup/model/DGroupItemUI";

export const mapDGroupToUI = (dgroup: DGroupListItemDTO): DGroupItemUI => {
	const leadersName = dgroup.leaders
		.map((leader) => `${leader.firstName} ${leader.lastName}`)
		.join(", ");

	const gender =
		dgroup.leaders.length === 2 ? "Couples" : dgroup.leaders[0]?.gender;

	return {
		id: dgroup.id,
		groupName: dgroup.name,
		leadersName,
		memberCount: dgroup.members,
		leaderImageUrl: "", // TODO
		leaderProfileUrl: "", // TODO
		memberTypes: dgroup.lifestage,
		gender,
	};
};

// export const mapDGroupLeaderToUI = (
// 	dgroup: DGroupLeaderListItemDTO,
// ): DGroupLeaderItemUI => {
// 	const leadersName = dgroup.leaders
// 		.map((leader) => `${leader.firstName} ${leader.lastName}`)
// 		.join(", ");

// 	const gender =
// 		dgroup.leaders.length === 2 ? "Couples" : dgroup.leaders[0]?.gender;

// 	return {
// 		id: dgroup.id,
// 		groupName: dgroup.name,
// 		leadersName,
// 		gender,
// 	};
// };

const mapSingleLeader = (item: DMemberDTO): DGroupLeaderItemUI => ({
	id: item.id,
	groupName: `${item.firstName} ${item.lastName}`,
	gender: item.gender,
});

const mapCoupleLeader = (
	item: DGroupCoupleLeaderListItemDTO,
): DGroupLeaderItemUI => ({
	id: [item.husbandId, item.wifeId],
	groupName: `${item.husbandFirstName} & ${item.wifeFirstName} ${item.husbandLastName}`,
	gender: "Couples",
});

export const mapDGroupLeaderToUI = (
	item: DGroupCoupleLeaderListItemDTO | DMemberDTO,
): DGroupLeaderItemUI => {
	if ("husbandId" in item && "wifeId" in item) {
		return mapCoupleLeader(item);
	}

	return mapSingleLeader(item);
};
