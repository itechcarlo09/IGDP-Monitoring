import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import MDIIcon from "@components/MDIIcon";
import { mdiChevronRight } from "@mdi/js";
import { useTheme } from "@theme/ThemeProvider";
import ShadowCard from "@components/ShadowCard";
import { DGroupItemProps } from "./DGroupListItem.types";
import { design } from "@theme/index";

export default function DGroupListItem({
	id,
	name,
	leaders,
	members,
	category,
	avatar,
	onPress,
}: DGroupItemProps) {
	const navigation = useNavigation<any>();
	const { theme } = useTheme();

	const getInitials = (name: string) =>
		name
			.split(" ")
			.map((word) => word[0])
			.join("")
			.toUpperCase()
			.slice(0, 2);

	// const getStatusStyle = (status: DGroupItemProps["status"]) => {
	// 	switch (status) {
	// 		case "Active":
	// 			return {
	// 				backgroundColor: theme.statusActive.backgroundColor,
	// 				color: theme.statusActive.textColor,
	// 			};
	// 		case "Inactive":
	// 			return {
	// 				backgroundColor: theme.statusInactive.backgroundColor,
	// 				color: theme.statusInactive.textColor,
	// 			};
	// 		case "Pending":
	// 			return {
	// 				backgroundColor: theme.statusPending.backgroundColor,
	// 				color: theme.statusPending.textColor,
	// 			};
	// 		default:
	// 			return {
	// 				backgroundColor: theme.statusInactive.backgroundColor,
	// 				color: theme.statusInactive.textColor,
	// 			};
	// 	}
	// };

	const formatDate = (dateString: string | null) => {
		if (!dateString) return "No attendance";

		const date = new Date(dateString);
		const now = new Date();

		const diffTime = now.getTime() - date.getTime();
		const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

		if (diffDays === 0) return "Today";
		if (diffDays === 1) return "Yesterday";
		if (diffDays < 7) return `${diffDays} days ago`;

		return date.toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
		});
	};

	return (
		<ShadowCard onPress={onPress} key={id}>
			<View style={styles.row}>
				{/* Avatar */}
				<View style={styles.avatar}>
					{avatar ? (
						<Image source={{ uri: avatar }} style={styles.avatarImage} />
					) : (
						<Text style={styles.avatarText}>{getInitials(name)}</Text>
					)}
				</View>

				{/* Info */}
				<View style={styles.info}>
					<Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>
						{name}
					</Text>

					{leaders && (
						<View style={styles.metaRow}>
							<Text style={[styles.metaText, { color: theme.muted }]}>
								{Array.isArray(leaders) ? "Leaders" : "Leader"}:{" "}
								{Array.isArray(leaders) ? leaders.join(", ") : leaders}
							</Text>
						</View>
					)}

					{category && (
						<View style={styles.bottomRow}>
							{Array.isArray(category) ? (
								category.slice(0, 2).map((item, index) => (
									<View
										key={index}
										style={[styles.badge, { backgroundColor: theme.badge }]}
									>
										<Text
											style={[
												design.typography.caption,
												{ color: theme.badgeText },
											]}
										>
											{item}
										</Text>
									</View>
								))
							) : (
								<View style={[styles.badge, { backgroundColor: theme.badge }]}>
									<Text
										style={[
											design.typography.caption,
											{ color: theme.badgeText },
										]}
									>
										{category}
									</Text>
								</View>
							)}

							{members && (
								<Text style={styles.lastAttendance}>
									{members} {category[0] === "Couples" ? "Couples" : "Members"}
								</Text>
							)}
						</View>
					)}
				</View>

				<MDIIcon path={mdiChevronRight} size={22} color="#9CA3AF" />
			</View>
		</ShadowCard>
	);
}

const styles = StyleSheet.create({
	card: {
		backgroundColor: "#FFFFFF",
		borderRadius: 16,
		padding: 16,
		marginBottom: 12,
		borderWidth: 1,
		borderColor: "#E5E7EB",
	},

	row: {
		flexDirection: "row",
		alignItems: "center",
		gap: 16,
	},

	avatar: {
		width: 48,
		height: 48,
		borderRadius: 999,
		backgroundColor: "#00A6B6",
		justifyContent: "center",
		alignItems: "center",
		overflow: "hidden",
	},

	avatarImage: {
		width: "100%",
		height: "100%",
	},

	avatarText: {
		color: "#FFFFFF",
		fontWeight: "600",
		fontSize: 16,
	},

	info: {
		flex: 1,
	},

	name: {
		fontSize: 16,
		fontWeight: "600",
		color: "#111827",
	},

	metaRow: {
		flexDirection: "row",
		flexWrap: "wrap",
		alignItems: "center",
		marginTop: 4,
		gap: 6,
	},

	metaText: {
		fontSize: 14,
		color: "#6B7280",
	},

	dot: {
		color: "#9CA3AF",
	},

	group: {
		fontSize: 14,
		color: "#00A6B6",
		flexShrink: 1,
	},

	bottomRow: {
		flexDirection: "row",
		alignItems: "center",
		flexWrap: "wrap",
		gap: 8,
		marginTop: 8,
	},

	statusBadge: {
		paddingHorizontal: 8,
		paddingVertical: 2,
		borderRadius: 999,
		fontSize: 12,
		fontWeight: "500",
		color: "#111827",
	},

	active: {
		backgroundColor: "#DCFCE7",
	},

	inactive: {
		backgroundColor: "#F3F4F6",
	},

	pending: {
		backgroundColor: "#FEF3C7",
	},

	lastAttendance: {
		fontSize: 12,
		color: "#9CA3AF",
	},

	actions: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
	},

	iconButton: {
		padding: 8,
	},
	badge: {
		paddingHorizontal: 12,
		paddingVertical: 4,
		borderRadius: 999,
		alignSelf: "flex-start",
	},
});
