import { router } from 'expo-router';
import { useEffect, useState } from 'react';

import useHabitDelete from '@/hooks/useHabitDelete';
import useHabitDetails from '@/hooks/useHabitDetails';
import HabitDetailsModal from './HabitDetailsModal';

interface Props {
	habitUuid: string | null;
	visible: boolean;
	onClose: () => void;
	onDelete?: (habitUuid: string) => void;
}

export default function HabitDetailsContainer({ habitUuid, visible, onClose, onDelete }: Props) {
	const { habit, loading, error, loadHabitDetails } = useHabitDetails();
	const { deleting, error: deleteError, deleteHabit } = useHabitDelete();
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

	const handleDelete = async (habitUuid: string) => {
		const success = await deleteHabit(habitUuid);
		if (success) {
			onDelete?.(habitUuid);
			onClose();
		}
	};

	if (loading || deleting || error || deleteError || !habit) {
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
