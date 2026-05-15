import { useTheme } from "@theme/ThemeProvider";
import React, { useCallback, useEffect, useState } from "react";
import {
	View,
	StyleSheet,
	RefreshControl,
	FlatList,
	ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useUserViewModel } from "@features/member/viewModel/useUserViewModel";
import { Separator } from "@component/Separator";
import { AppStackParamList, DgroupStackParamList } from "src/types/navigation";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import CCFHeader from "@components/CCFHeader";
import MemberItem, {
	MemberCardProps,
} from "@features/member/components/MemberItem";
import { useDGroupViewModel } from "../viewModel/useDGroupViewModel";
import DGroupListCard from "src/feature/dgroup/view/components/DGroupListCard";
import { toast } from "@component/toast/toast";
import DGroupListItem from "../components/DGroupListItem";

type UserRouteProp = RouteProp<AppStackParamList, "DgroupNavigator">;
type NavProp = NativeStackNavigationProp<AppStackParamList>;
const getRandomStatus = (): MemberCardProps["status"] => {
	const statuses: MemberCardProps["status"][] = [
		"Active",
		"Inactive",
		"Pending",
	];
	const randomIndex = Math.floor(Math.random() * statuses.length);

	return statuses[randomIndex];
};

const DGroupScreen = () => {
	const navigation = useNavigation<NavProp>();
	const route = useRoute<UserRouteProp>();
	const insets = useSafeAreaInsets();
	const { theme } = useTheme();
	const {
		dgroups,
		refresh,
		loading,
		fetching,
		searchDGroups,
		loadMoreDGroups,
	} = useDGroupViewModel();
	const [searchText, setSearchText] = useState("");
	const [
		onEndReachedCalledDuringMomentum,
		setOnEndReachedCalledDuringMomentum,
	] = useState(false);
	const [refreshing, setRefreshing] = useState(false);
	const Refresh = () => (
		<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
	);

	const onRefresh = useCallback(async () => {
		setRefreshing(true);
		await refresh();
		setRefreshing(false);
	}, [refresh]);

	useEffect(() => {
		const delay = setTimeout(() => {
			searchDGroups(searchText);
		}, 300);

		return () => clearTimeout(delay);
	}, [searchText]);

	return (
		<View
			style={[
				styles.container,
				{
					backgroundColor: theme.background,
				},
			]}
		>
			<CCFHeader
				enableSearch
				showAdd
				searchText={searchText}
				onChangeSearch={setSearchText}
				onAddPress={() =>
					navigation.navigate("DGroupNavigator", {
						screen: "DGroupFormScreen",
					})
				}
				placeholder="Search DGroup.."
			/>
			<FlatList
				data={dgroups}
				keyExtractor={(item) => item.id.toString()}
				ItemSeparatorComponent={Separator}
				ListHeaderComponent={<View style={{ height: 16 }} />}
				style={{ paddingHorizontal: 16 }}
				renderItem={({ item }) => (
					<DGroupListItem
						id={item.id}
						name={item.groupName}
						leaders={item.leadersName}
						members={item.memberCount}
						category={item.memberTypes}
						avatar={null}
						onPress={() =>
							navigation.navigate("DGroupNavigator", {
								screen: "DGroupFormScreen",
								params: { id: item.id },
							})
						}
					/>
				)}
				refreshControl={Refresh()}
				onEndReached={() => {
					if (!onEndReachedCalledDuringMomentum && !fetching && !loading) {
						loadMoreDGroups();
						setOnEndReachedCalledDuringMomentum(true);
					}
				}}
				onEndReachedThreshold={0.1}
				ListFooterComponent={() =>
					fetching ? (
						<View style={{ padding: 12 }}>
							<ActivityIndicator size="small" color="#2563EB" />
						</View>
					) : (
						<View style={{ height: 16 }} />
					)
				}
				onMomentumScrollBegin={() => {
					setOnEndReachedCalledDuringMomentum(false);
				}}
			/>
		</View>
	);
};

export default DGroupScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	headerContainer: {
		flexDirection: "row",
		alignItems: "center",
	},
});
