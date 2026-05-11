import React, { useCallback, useEffect, useState } from "react";
import {
	View,
	StyleSheet,
	FlatList,
	RefreshControl,
	ActivityIndicator,
} from "react-native";
import { useTheme } from "../../../theme/ThemeProvider";
import Loading from "../../../component/Loading";
import Header from "@component/Header";
import DGroupListCard from "./components/DGroupListCard";
import { useDGroupViewModel } from "../../../features/dgroup/viewModel/useDGroupViewModel";
import { Separator } from "@component/Separator";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useDebounce from "@features/member/hooks/useDebounce";

const DGroupListScreen = ({ navigation }: any) => {
	const {
		dgroups,
		refresh,
		loading,
		fetching,
		searchDGroups,
		loadMoreDGroups,
	} = useDGroupViewModel();

	const { theme } = useTheme();
	const insets = useSafeAreaInsets();
	const [refreshing, setRefreshing] = useState(false);
	const [search, setSearch] = useState("");
	const debouncedSearchTerm = useDebounce(search, 500);
	const [
		onEndReachedCalledDuringMomentum,
		setOnEndReachedCalledDuringMomentum,
	] = useState(false);

	useEffect(() => {
		searchDGroups(debouncedSearchTerm);
	}, [debouncedSearchTerm]);

	const onRefresh = useCallback(async () => {
		setRefreshing(true);
		await refresh();
		setRefreshing(false);
	}, [refresh]);

	const handleEdit = (item: any) => {
		navigation.navigate("EventNavigator", {
			screen: "EventForm",
			params: { eventId: item.id, onSuccess: onRefresh },
		});
	};

	const handleSeries = (item: any) => {
		navigation.navigate("EventNavigator", {
			screen: "SeriesEvents",
			params: { seriesId: item.seriesId },
		});
	};

	return (
		<View
			style={[
				styles.container,
				{ backgroundColor: theme.gray[50], paddingTop: insets.top },
			]}
		>
			<Header
				placeholder="Search DGroup..."
				onAdd={() =>
					navigation.navigate("DGroupNavigator", {
						screen: "DGroupFormScreen",
					})
				}
				onSearch={setSearch}
			/>

			{/* Event List */}
			{loading ? (
				<Loading />
			) : (
				<FlatList
					data={dgroups}
					keyExtractor={(item) => String(item.id)}
					ItemSeparatorComponent={Separator}
					refreshControl={
						<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
					}
					renderItem={({ item }) => <DGroupListCard item={item} />}
					ListHeaderComponent={<View style={{ height: 6 }} />}
					ListFooterComponent={
						fetching ? (
							<ActivityIndicator style={{ marginVertical: 16 }} size="large" />
						) : (
							<View style={{ height: 16 }} />
						)
					}
					onEndReached={() => {
						if (!onEndReachedCalledDuringMomentum && !fetching && !loading) {
							loadMoreDGroups();
							setOnEndReachedCalledDuringMomentum(true);
						}
					}}
					onEndReachedThreshold={0.1}
					onMomentumScrollBegin={() => {
						setOnEndReachedCalledDuringMomentum(false);
					}}
				/>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: { flex: 1 },
	separator: { height: 12 },
	topControls: {
		flexDirection: "row",
		alignItems: "center",
		marginHorizontal: 16,
		marginTop: 12,
		marginBottom: 10,
	},
	addButton: {
		height: 42,
		width: 42,
		justifyContent: "center",
		alignItems: "center",
		marginLeft: 10,
	},
});

export default DGroupListScreen;
