import { useNavigation } from "@react-navigation/native";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { dgroupRepository } from "../data/dgroupRepository";
import { toast } from "@component/toast/toast";
import { useDGroupViewModel } from "../viewModel/useDGroupViewModel";
import { DGroupListItemDTO } from "../model/DGroup";
import { DGroupType } from "src/types/enums/LifeStage";

interface UseDGroupFormProps {
	dGroupId?: number;
	churchId?: number; // needed for create
	onSuccess?: () => void;
}

const staticInitialValues = {
	name: "",
	type: "Singles" as DGroupType,
	leader: [],
	dleaders: [] as number[],
	dmembers: [] as number[],
	churchId: 0,
};

const staticSchema = Yup.object().shape({});

export const useDGroupForm = ({
	dGroupId,
	churchId,
	onSuccess,
}: UseDGroupFormProps) => {
	const navigation = useNavigation();
	const queryClient = useQueryClient();

	const { addDGroup, updateDGroup } = useDGroupViewModel();

	// ✅ Fetch DGroup (EDIT mode)
	const { data: dGroup, isLoading: isFetching } =
		useQuery<DGroupListItemDTO | null>({
			queryKey: ["dGroup", dGroupId],
			queryFn: () => dgroupRepository.getDGroupById?.(dGroupId!),
			enabled: !!dGroupId,
			staleTime: 1000 * 60 * 5,
		});

	// ✅ Mutation (CREATE / UPDATE)
	const mutation = useMutation({
		mutationFn: async (values: typeof staticInitialValues) => {
			// if (dGroupId && dGroupId > 0) {
			// 	return updateDGroup(dGroupId, {
			// 		name: values.name.trim(),
			// 		churchId: values.churchId,
			// 	});
			// }
			return addDGroup({
				name: values.name,
				dleaders: values.dleaders,
				type: values.type,
				churchId: values.churchId,
			});
		},

		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["dGroups"] });
			queryClient.invalidateQueries({ queryKey: ["dGroup", dGroupId] });

			onSuccess?.();
		},

		onError: (error) => {
			toast.error(error.message);
		},
	});

	// ✅ Derive initial values
	const initialValues = staticInitialValues;

	// ✅ Formik
	const formik = useFormik({
		initialValues,
		validationSchema: staticSchema,
		enableReinitialize: true,

		onSubmit: async (values) => {
			await mutation.mutateAsync(values);
		},
	});

	return {
		loading: isFetching || mutation.isPending,
		dGroup,
		formik,
	};
};
