import React from "react";
import { StyleSheet, View } from "react-native";
import Loading from "../../../component/Loading";
import { useTheme } from "../../../theme/ThemeProvider";
import { design } from "@theme/index";
import CCFTextInput from "src/components/CCFTextInput";
import CCFButton from "@components/CCFButton";
import CCFChoiceChip from "@components/CCFChoiceChip";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CCFHeader from "@components/CCFHeader";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { UserStackParamList } from "src/types/navigation";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import CCFSelectInput from "@components/CCFSelectInput";
import { useAccountStore } from "@features/account/account.store";
import { useUserForm } from "../hooks/useUserForm";
import { Gender } from "../model/user";

type UserRouteProp = RouteProp<UserStackParamList, "UserForm">;
type NavProp = NativeStackNavigationProp<UserStackParamList>;

const MemberFormScreen = () => {
	const { theme } = useTheme();
	const insets = useSafeAreaInsets();
	const { account } = useAccountStore();
	const navigation = useNavigation<NavProp>();
	const route = useRoute<UserRouteProp>();
	const { id } = route.params || {};
	const { formik, isLoading } = useUserForm({
		userId: 0,
		onSuccess: navigation.goBack,
	});

	const genderItems = Object.values(Gender).map((item) => ({
		label: item,
		value: item,
	}));

	if (isLoading) return <Loading />;

	return (
		<View style={[styles.mainContainer, { backgroundColor: theme.background }]}>
			<CCFHeader showBack title="DGroup Form" onBackPress={navigation.goBack} />
			<View
				style={{
					rowGap: design.spacing["2xl"],
					paddingHorizontal: 16,
					marginTop: 24,
					flex: 1,
				}}
			>
				<View style={{ rowGap: design.spacing.lg, flex: 1 }}>
					<CCFTextInput
						label="Dgroup Name"
						placeholder="Input Name"
						value={formik.values.name}
						onChangeText={formik.handleChange("name")}
						error={formik.errors.name}
					/>
					<CCFChoiceChip
						name="type"
						items={genderItems}
						value={formik.values.type}
						onChange={(value) => {
							if (value === formik.values.type) return;
							formik.setFieldValue("lifeStage", "");
							formik.setFieldValue("type", value);
							formik.setFieldValue("dleaders", []);
						}}
						error={formik.errors.type}
					/>
					<CCFSelectInput
						label="DGroup Leader"
						required
						placeholder="Select Leader"
						value={formik.values.lifeStage}
						onPress={() =>
							navigation.navigate("DGroupLeaderScreen", {
								type: formik.values.type,
								onSuccess: (name, id) => {
									formik.setFieldValue("lifeStage", name);
									formik.setFieldValue("dleaders", id);
								},
							})
						}
						error={formik.errors.lifeStage}
						touched={formik.touched.lifeStage}
					/>
				</View>
				<CCFButton
					title={"Create Member"}
					onPress={formik.handleSubmit as any}
					disabled={isLoading}
					style={{ marginBottom: insets.bottom }}
				/>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	mainContainer: {
		flex: 1,
	},
});

export default MemberFormScreen;
