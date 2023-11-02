/* eslint-disable @typescript-eslint/no-unused-vars */

import { IconAlertCircle } from '@tabler/icons-react';
import { drag } from 'd3-drag';
import { select } from 'd3-selection';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
	Handle,
	NodeResizer,
	Position,
	useUpdateNodeInternals
} from 'reactflow';
import { styled } from 'styled-components';
import { NodeTyper } from '../../components/hooks/typingAnimation/typer';

const Wrap = styled.div`
	.node {
		/* width: 100%; */
		max-width: 240px;
		font-size: 24px;
		/* width: 7rem; */
		height: 100%;
		border-radius: 15px;
		border: 1px solid #000;
		background-color: #fff;
		padding: 20px;
		box-sizing: border-box;
	}

	.node :global .react-flow__resize-control.handle {
		width: 10px;
		height: 10px;
		border-radius: 100%;
	}

	.react-flow__node .react-flow__node-custom .nopan .selectable {
		max-width: 240px;
	}
	.react-flow__node .react-flow__node-custom .nopan .selectable {
		max-width: 240px;
	}
`;

export default function ResizableNodeSelected({
	data,
	selected,
	id,
	sourcePosition = Position.Left,
	targetPosition = Position.Right
}) {
	const [isLoading, setIsLoading] = useState(true);
	const rotateControlRef = useRef(null);
	const updateNodeInternals = useUpdateNodeInternals();
	// eslint-disable-next-line no-unused-vars
	const [resizable, setResizable] = useState(true);
	// eslint-disable-next-line no-unused-vars
	const [rotatable, setRotatable] = useState(true);

	useEffect(() => {
		if (data !== '내용을 입력해주세요.') {
			setIsLoading(false);
		}
	}, [isLoading]);

	useEffect(() => {
		window.addEventListener('error', e => {
			if (
				e.message === 'ResizeObserver loop limit exceeded' ||
				e.message ===
					'ResizeObserver loop completed with undelivered notifications.'
			) {
				const resizeObserverErrDiv = document.getElementById(
					'webpack-dev-server-client-overlay-div'
				);
				const resizeObserverErr = document.getElementById(
					'webpack-dev-server-client-overlay'
				);
				if (resizeObserverErr) {
					resizeObserverErr.setAttribute('style', 'display: none');
				}
				if (resizeObserverErrDiv) {
					resizeObserverErrDiv.setAttribute('style', 'display: none');
				}
			}
		});
	}, []);

	useMemo(() => {
		const selection = select(rotateControlRef.current);
		const dragHandler = drag().on('drag', () => {
			updateNodeInternals(id);
		});
		if (selected) {
			selection.call(dragHandler);
		}
	}, [id, updateNodeInternals, selected]);

	return (
		<Wrap className="node">
			<NodeResizer
				isVisible={resizable}
				minWidth={180}
				minHeight={100}
				maxWidth={240}
			/>
			<div
				ref={rotateControlRef}
				style={{
					display: rotatable ? 'block' : 'none'
				}}
				className="nodrag rotateHandle"
			/>
			<div>
				{data.label === `` && (
					<IconAlertCircle color="red" style={{ marginLeft: 10 }} />
				)}
				{data.length > 2 ? (
					<div
						style={{ padding: 10, display: 'inline-block', maxWidth: '240px' }}
					>
						{data.label === `` ? '내용을 추가해주세요.' : data.label}
					</div>
				) : (
					<NodeTyper
						data={data.label === `` ? '내용을 추가해주세요.' : data.label}
					/>
				)}
			</div>
			<Handle position={sourcePosition} type="source" />
			<Handle position={targetPosition} type="target" />
		</Wrap>
	);
}
