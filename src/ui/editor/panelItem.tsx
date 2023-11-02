/* eslint-disable no-nested-ternary */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { ActionIcon, Tooltip } from '@mantine/core';
import {
	IconBinaryTree,
	IconFileCheck,
	IconInfoCircle,
	IconPlus,
	IconSchema,
	IconTrashX
} from '@tabler/icons-react';

export default function PanelItem({
	edgeState,
	nodeState,
	currentFlow,
	onLayout,
	setCurrentFlow,
	setConfirmDelete,
	onAdd
}) {
	return (
		<>
			<Tooltip
				label={`${
					edgeState.length < 1
						? '노드들을 이어주세요.'
						: currentFlow === 'LR'
						? 'horizontal flow로 변경'
						: 'vertical flow로 변경'
				}`}
			>
				{currentFlow !== 'TB' && currentFlow !== 'LR' ? (
					<ActionIcon
						variant="default"
						onClick={() => {
							if (currentFlow !== 'TB') {
								onLayout('LR');
								setCurrentFlow('LR');
							} else if (currentFlow !== 'LR') {
								onLayout('TB');
								setCurrentFlow('TB');
							}
						}}
					>
						<IconSchema data-disabled size="1rem" />
					</ActionIcon>
				) : currentFlow === 'TB' ? (
					<ActionIcon
						variant="default"
						onClick={() => {
							onLayout('LR');
							setCurrentFlow('LR');
						}}
					>
						<IconBinaryTree
							size="1rem"
							style={{ transform: 'rotate(-90deg)' }}
						/>
					</ActionIcon>
				) : (
					<ActionIcon
						variant="default"
						onClick={() => {
							onLayout('TB');
							setCurrentFlow('TB');
						}}
					>
						<IconBinaryTree size="1rem" />
					</ActionIcon>
				)}
			</Tooltip>
			<Tooltip label="모두 삭제">
				{nodeState.length === 0 ? (
					<ActionIcon
						variant="default"
						sx={{
							'&[data-disabled]': { opacity: 0.8, pointerEvents: 'all' }
						}}
					>
						<IconTrashX data-disabled size="1rem" />
					</ActionIcon>
				) : (
					<ActionIcon variant="default" onClick={() => setConfirmDelete(true)}>
						<IconTrashX size="1rem" />
					</ActionIcon>
				)}
			</Tooltip>
			<Tooltip label="노드 추가">
				<ActionIcon variant="default" onClick={onAdd}>
					<IconPlus data-disabled size="1rem" />
				</ActionIcon>
			</Tooltip>
		</>
	);
}
