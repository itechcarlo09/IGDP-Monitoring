import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DGroupListScreen from "src/feature/dgroup/view/DGroupListScreen";
import DGroupFormScreen from "@features/dgroup/screens/DGroupFormScreen";
import DGroupLeaderSelectionScreen from "@features/dgroup/screens/DGroupLeaderSelectionScreen";

const Stack = createNativeStackNavigator();

export default function DGroupNavigator() {
	return (
		<Stack.Navigator screenOptions={{ headerShown: false }}>
			<Stack.Screen name="DGroupListScreen" component={DGroupListScreen} />
			<Stack.Screen name="DGroupFormScreen" component={DGroupFormScreen} />
			<Stack.Screen
				name="DGroupLeaderScreen"
				component={DGroupLeaderSelectionScreen}
			/>
		</Stack.Navigator>
	);
}
