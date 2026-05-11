import { LifeStage } from "src/types/enums/LifeStage";

export interface DGroupItemProps {
	id: number | string;
	name: string;
	leaders?: string | string[];
	members?: number;
	category?: LifeStage[];
	avatar: string | null;
	onPress: () => void;
}
