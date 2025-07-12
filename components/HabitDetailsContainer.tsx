import { router } from 'expo-router';
import { useEffect, useState } from 'react';

import useHabitDetails from '@/hooks/useHabitDetails';
import HabitDetailsModal from './HabitDetailsModal';

interface Props {
	habitUuid: string | null;
	visible: boolean;
	onClose: () => void;
	onEdit?: (habitUuid: string) => void;
	onDelete?: (habitUuid: string) => void;
}

export default function HabitDetailsContainer({
	habitUuid,
	visible,
	onClose,
	onEdit,
	onDelete
}: Props) {
	const { habit, loading, error, loadHabitDetails } = useHabitDetails();
	const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

	useEffect(() => {
		if (visible && habitUuid && !hasLoadedOnce) {
			loadHabitDetails(habitUuid).then(() => {
				setHasLoadedOnce(true);
			});
		}
	}, [visible, habitUuid, hasLoadedOnce, loadHabitDetails]);

	useEffect(() => {
		if (!visible) {
			setHasLoadedOnce(false);
		}
	}, [visible]);

	const handleEdit = (habitUuid: string) => {
		router.push(`/edit-habit?habitUuid=${habitUuid}` as any);
		onClose();
	};

	const handleDelete = (habitUuid: string) => {
		onDelete?.(habitUuid);
		onClose();
	};

	if (loading || error || !habit) {
		return null;
	}

	return (
		<HabitDetailsModal
			habit={habit}
			visible={visible}
			onClose={onClose}
			onEdit={handleEdit}
			onDelete={handleDelete}
		/>
	);
}
