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
import { Separator } from "@component/Separator";
import { DgroupStackParamList } from "src/types/navigation";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import CCFHeader from "@components/CCFHeader";
import { MemberCardProps } from "@features/member/components/MemberItem";
import DGroupListItem from "../components/DGroupListItem";
import { useDGroupLeadersViewModel } from "../viewModel/useDGroupLeadersViewModel";

type UserRouteProp = RouteProp<DgroupStackParamList, "DGroupLeaderScreen">;
type NavProp = NativeStackNavigationProp<DgroupStackParamList>;
const getRandomStatus = (): MemberCardProps["status"] => {
	const statuses: MemberCardProps["status"][] = [
		"Active",
		"Inactive",
		"Pending",
	];
	const randomIndex = Math.floor(Math.random() * statuses.length);

	return statuses[randomIndex];
};

const DGroupLeaderSelectionScreen = () => {
	const navigation = useNavigation<NavProp>();
	const route = useRoute<UserRouteProp>();
	const insets = useSafeAreaInsets();
	const { onSuccess, gender, type, exemptedAccountId } = route.params || {};
	const { theme } = useTheme();
	const {
		leaders,
		loading,
		fetching,
		searchLeaders,
		loadMoreLeaders,
		refresh,
		hasMore,
	} = useDGroupLeadersViewModel(gender, type, exemptedAccountId);
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
			searchLeaders(searchText);
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
				placeholder="Search leaders.."
				enableSearch
				onChangeSearch={setSearchText}
				searchText={searchText}
			/>
			<FlatList
				data={leaders}
				keyExtractor={(item) => item.id.toString()}
				ItemSeparatorComponent={Separator}
				ListHeaderComponent={<View style={{ height: 16 }} />}
				style={{ paddingHorizontal: 16 }}
				renderItem={({ item }) => (
					<DGroupListItem
						id={item.id}
						name={item.groupName}
						leaders={item.leadersName}
						avatar={null}
						onPress={() => {
							onSuccess && onSuccess(item.groupName ?? "", item.id);
							navigation.goBack();
						}}
					/>
				)}
				refreshControl={Refresh()}
				onEndReached={() => {
					if (!onEndReachedCalledDuringMomentum && !fetching && !loading) {
						loadMoreLeaders();
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

export default DGroupLeaderSelectionScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	headerContainer: {
		flexDirection: "row",
		alignItems: "center",
	},
});
