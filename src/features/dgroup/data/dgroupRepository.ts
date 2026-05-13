import { dgroupDataSource } from "./dgroupDataResource";

export const dgroupRepository = {
	getDGroupById: dgroupDataSource.getDGroupById,
	getDGroups: dgroupDataSource.getDGroups,
	getDGroupLeaders: dgroupDataSource.getDGroupLeaders,
	// searchEvents: eventDataSource.searchEvents,
	addDGroup: dgroupDataSource.addDGroup,
	// updateEvent: eventDataSource.update,
	// deleteEvent: eventDataSource.delete,
};
