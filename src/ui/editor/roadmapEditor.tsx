/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import ReactFlow, {
	useNodesState,
	useEdgesState,
	useReactFlow,
	ReactFlowProvider,
	Panel,
	addEdge,
	ConnectionLineType,
	type Connection,
	type Edge
} from 'reactflow';
import 'reactflow/dist/style.css';
import Dagre from '@dagrejs/dagre';
import {
	ActionIcon,
	Modal,
	Button,
	Center,
	Input,
	Popover,
	ColorInput
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconCertificate } from '@tabler/icons-react';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { baseUrl } from '../../axiosInstance/constants';
import PanelItem from './panelItem';
import { setStoredRoadmap } from '../../storage/roadmapStorage';
import ResizableNodeSelected from './resizableNodeSelected';
import useUser from '../../components/hooks/useUser';
import {
	type RoadmapEdge,
	type RoadmapNode
} from '../../components/types/roadmapTypes';

const Wrap = styled.div`
	width: 100%;
	height: 91vh;

	/* .react-flow__node {
    min-width: fit-content;
  } */
	& .updatenode__controls {
		position: absolute;
		right: 10px;
		top: 10px;
		z-index: 4;
		font-size: 12px;
	}

	& .updatenode__controls label {
		display: block;
	}

	/* & .updatenode__bglabel {
    margin-top: 10px;
  } */

	& .react-flow__panel {
		display: inline-flex;
	}

	& .updatenode__checkboxwrapper {
		/* margin-top: 10px; */
		display: flex;
		align-items: center;
	}

	& .confirm_btn_wrap {
		display: inline-flex;
		width: 100%;
	}
`;

const dagreGraph = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));

const nodeWidth = 240;
const nodeHeight = 60;
const nodeTypes = {
	custom: ResizableNodeSelected
};

const defaultViewport = { x: 0, y: 0, zoom: 1.5 };

const getNodeId = () => `randomnode_${+new Date()}`;

const position = { x: 0, y: 0 };
const edgeType = 'smoothstep';

const initialNodes = [
	{
		id: '1',
		type: 'custom',
		data: { label: '제목을 입력해주세요.' },
		position: { x: 100, y: 100, zoom: 0.45 },
		style: {
			background: '#fff',
			border: '1px solid black',
			borderRadius: 15,
			fontSize: 24
		}
	},

	{
		id: '2',
		type: 'custom',
		data: { label: '제목을 입력해주세요.' },
		position: { x: 100, y: 200, zoom: 0.45 },
		style: {
			background: '#fff',
			border: '1px solid black',
			borderRadius: 15,
			fontSize: 24
		}
	}
];

const initialEdges = [
	{ id: 'e1e2', source: '1', target: '2', type: edgeType, animated: true }
];

const getLayoutedElements = (
	nodes: any[],
	edges: any[],
	options: { direction: any }
) => {
	dagreGraph.setGraph({ rankdir: options.direction });

	edges.forEach(edge => dagreGraph.setEdge(edge.source, edge.target));
	nodes.forEach(node =>
		dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight })
	);

	Dagre.layout(dagreGraph);

	return {
		nodes: nodes.map(node => {
			const { x, y } = dagreGraph.node(node.id);

			return { ...node, position: { x, y } };
		}),
		edges
	};
};

function RoadmapCanvas({
	editor,
	label,
	setLabel,
	onChangeLabel,
	color,
	setColor,
	toggleEditor,
	state,
	setId,
	setState,
	setColorsState,
	id
}) {
	const edgeSet = new Set<RoadmapEdge['id']>();
	const nodeSet = new Set<RoadmapNode['id']>();

	const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
	const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
	const [rfInstance, setRfInstance] = useState(null);
	const [currentFlow, setCurrentFlow] = useState('');
	const [confirmDelete, setConfirmDelete] = useState(false);
	const { setViewport } = useReactFlow();
	const [nodeModal, setNodeModal] = useState(false);
	const yPos = useRef(defaultViewport.y);
	const [opened, { open, close }] = useDisclosure(false);

	const navigate = useNavigate();
	const { user } = useUser();
	const [gptRes, setGptRes] = useState(true);
	const [gptDisabled, setGptDisabled] = useState(false);
	const [useGpt, setUseGpt] = useState([]);

	const onLayout = useCallback(
		(direction: any) => {
			const layouted = getLayoutedElements(nodes, edges, { direction });

			setNodes([...layouted.nodes]);
			setEdges([...layouted.edges]);
		},
		[nodes, edges]
	);

	useMemo(() => {
		setNodes(nds =>
			nds.map(node => {
				if (node.id === id) {
					node.data = {
						...node.data,
						label
					};
				}

				return node;
			})
		);
	}, [label, setNodes]);

	useMemo(() => {
		setNodes(nds =>
			nds.map(node => {
				if (node.id === id) {
					node.style = { ...node.style, background: color };
				}

				return node;
			})
		);
	}, [color, setNodes]);

	useMemo(() => {
		setNodes([...nodes]);
	}, [editor]);

	useEffect(() => {
		setNodes(nds =>
			nds.map(node => {
				if (node?.id === label) {
					node.style.backgroundColor = color;
					node.data.label = label;
				}
				return node;
			})
		);
	}, [nodes, edges]);

	const onConnect = useCallback((params: Edge | Connection) => {
		setEdges(eds =>
			addEdge(
				{ ...params, type: ConnectionLineType.SmoothStep, animated: true },
				eds
			)
		);
	}, []);
	useCallback(() => {
		if (rfInstance) {
			const flow = rfInstance.toObject();
			setStoredRoadmap(flow);
		}
	}, [rfInstance]);

	const onAdd = useCallback(() => {
		yPos.current += 50;
		const newNode = [
			...nodes,
			{
				id: getNodeId(),
				data: { label: '' },
				type: 'custom',
				position: {
					x: defaultViewport.x,
					y: yPos.current
				},
				style: {
					background: '#fff',
					border: '1px solid black',
					borderRadius: 15,
					fontSize: 24
				}
			}
		];

		setState([...state, { id: getNodeId(), details: '' }]);
		setColorsState([...state, { id: getNodeId(), color: '#fff' }]);
		setNodes(nds => nds.concat(newNode));
	}, [nodes, setNodes]);

	useEffect(() => {
		setGptRes(true);
		if (!user) {
			navigate('/users/signin');
			return;
		}
		if (!localStorage.getItem('recent_gpt_search')) {
			setGptRes(false);
		}
		if (localStorage.getItem('recent_gpt_search')) {
			void axios
				.post(
					`${baseUrl}/gpt/roadmap?prompt=${JSON.parse(
						localStorage.getItem('recent_gpt_search')
					)?.keyword}`,
					{
						headers: {
							'Content-Type': 'application/json',
							Authorization: `Bearer ${user?.accessToken}`
						}
					}
				)
				.then(res => {
					if (res?.data.length > 0) {
						setGptRes(false);
					} else {
						setGptRes(true);
					}
					setUseGpt(res?.data);
				})
				.then(() => {
					setGptRes(false);
					setGptDisabled(false);
				});
		}
	}, []);

	// useMemo(() => {
	// 	void axios
	// 		.post(`${baseUrl}/gpt/roadmap/detail`, useGpt.slice(0, 4), {
	// 			headers: {
	// 				'Content-Type': 'application/json',
	// 				Authorization: `Bearer ${user?.accessToken}`
	// 			}
	// 		})
	// 		.then(e => {
	// 			state.forEach((n: { id: any; details: any }) => {
	// 				e.data.forEach((v: { id: any; detailedContent: any }) => {
	// 					if (n.id === v.id) {
	// 						n.details += v.detailedContent;
	// 					}
	// 				});
	// 			});
	// 		})
	// 		.catch();
	// }, [useGpt, state.length]);

	useEffect(() => {
		onLayout('LR');
	}, [useGpt.length]);

	useMemo(() => {
		const tmpNode = [];
		const tmpEdge = [];
		let cnt = 0;

		useGpt.forEach(v => {
			if (!nodeSet.has(v?.id) && !nodeSet.has(v?.parentId)) {
				tmpNode.push({
					id: v?.id,
					data: {
						label: v?.content
					},
					parentId: cnt + 0.1,
					type: 'custom',
					position,
					style: {
						background: '#fff',
						border: '1px solid black',
						borderRadius: 15,
						fontSize: 24
					}
				});
				nodeSet.add(`${v?.id}`);
				nodeSet.add(`${v?.parentId}`);
				cnt += 1;
			}

			// source랑 target 구해서 간선id 만들고 이어주기
			if (v?.parentId.split('.').length > 1) {
				// head인 경우
				if (
					!edgeSet.has(
						`e${v.parentId.slice(0, v.parentId.lastIndexOf('.'))}e${v.id}`
					)
				) {
					tmpEdge.push({
						id: `e${v.parentId.slice(0, v.parentId.lastIndexOf('.'))}e${
							v.parentId
						}`,
						source: v.parentId.slice(0, v.parentId.lastIndexOf('.')),
						target: v.parentId,
						type: edgeType,
						animated: true
					});
				}
				edgeSet.add(
					`e${v.parentId.slice(0, v.parentId.lastIndexOf('.'))}e${v.parentId}`
				);
			}
		});
		setNodes(tmpNode);
		setEdges(tmpEdge);
	}, [useGpt]);

	useCallback(() => {
		if (nodes.length > 0 && edges.length > 0) {
			onLayout('TB');
		}
	}, [nodes, edges]);

	return (
		<Wrap>
			<Modal.Root
				opened={confirmDelete}
				size="70%"
				style={{ flexDirection: 'column' }}
				onClose={() => {
					setConfirmDelete(false);
				}}
				centered
			>
				<Modal.Overlay opacity={0.85} />
				<Modal.Content>
					<Modal.Header>
						<Modal.CloseButton />
					</Modal.Header>
					<Modal.Body>
						<h1>정말 모든 노드를 삭제하시겠습니까?</h1>
						<h3>모두 삭제를 누를 시 작업 내용을 복구할 수 없습니다.</h3>
						<div className="confirm_btn_wrap">
							<Center>
								<Button
									mt={30}
									mr="1rem"
									onClick={() => {
										setNodes([]);
										setEdges([]);
										setConfirmDelete(false);
									}}
								>
									모두 지우기
								</Button>
								<Button
									mt={30}
									variant="outline"
									onClick={() => {
										setConfirmDelete(false);
									}}
								>
									취소
								</Button>
							</Center>
						</div>
					</Modal.Body>
				</Modal.Content>
			</Modal.Root>
			<Panel position="top-center">
				<Modal
					opened={nodeModal}
					onClose={() => {
						setNodeModal(false);
					}}
					size="xl"
				>
					<div className="wrap">
						<Center>
							<h1>상세내용</h1>
						</Center>

						{/* <Popover
        width={200}
        position="top"
        withArrow
        shadow="md"
        opened={opened}
    >
        <div>
            <Popover.Target>
                <ActionIcon
                    mt={10}
                    onMouseEnter={open}
                    onMouseLeave={close}
                    mb={10}
                    variant="outline"
                    onClick={() => {
                        setLabel(label);
                        getGptExampleDetail();
                    }}
                    loading={gptDisabled}
                >
                    <IconWand size="1rem" />
                </ActionIcon>
            </Popover.Target>
        </div>
        <Popover.Dropdown
            sx={{
                pointerEvents: 'none',
                backgroundColor: '#ebf6fc'
            }}
            style={{ zIndex: '700' }}
        >
            <Text size="sm">ChatGpt로 자동 생성하기</Text>
        </Popover.Dropdown>
    </Popover> */}

						<Input
							value={label}
							mt={10}
							mb={10}
							onChange={onChangeLabel}
							onBlur={() => setLabel(label)}
							placeholder="내용을 입력해주세요."
						/>
						<ColorInput
							value={color}
							mt={10}
							mb={20}
							onChange={evt => {
								setColor(evt);
							}}
							placeholder="Pick color"
							label="노드의 배경색을 골라주세요."
						/>
						{/* <Input.Wrapper label="블로그 인증 키워드 등록">
        <Input
            icon={<IconCertificate />}
            value={blogKeyword}
            onChange={onChangeBlogKeyword}
            mt={10}
            mb={10}
            disabled={keywordSubmitState}
            rightSection={
                <Tooltip
                    label="진행도를 체크할 블로그 키워드를 등록해주세요. 키워드 수정은 불가능합니다."
                    position="top-end"
                    withArrow
                >
                    <ActionIcon
                        disabled={blogKeyword.length === 0}
                        variant="transparent"
                        onClick={() => {
                            setBlogKeyword(blogKeyword);
                            submitBlogKeyword();
                        }}
                    >
                        <IconCircleArrowRightFilled size="1rem" />
                    </ActionIcon>
                </Tooltip>
            }
            placeholder="css"
        /> */}
						{/* </Input.Wrapper> */}

						<div className="custom">로드맵 상세 내용</div>
						{toggleEditor}
					</div>
				</Modal>
			</Panel>
			<ReactFlow
				nodes={nodes}
				edges={edges}
				onNodesChange={onNodesChange}
				onEdgesChange={onEdgesChange}
				defaultViewport={defaultViewport}
				onInit={setRfInstance}
				minZoom={0.2}
				maxZoom={4}
				attributionPosition="bottom-left"
				onConnect={onConnect}
				fitView
				onNodeClick={(e, n) => {
					setLabel(`${n?.data?.label}`);
					setId(n?.id);
					setColor(n?.style?.background);
					// eslint-disable-next-line no-console
					console.log('e', e);
					setNodeModal(true);
				}}
				nodeTypes={nodeTypes}
			>
				<Panel position="top-right">
					<PanelItem
						onLayout={onLayout}
						nodeState={nodes}
						edgeState={edges}
						currentFlow={currentFlow}
						setCurrentFlow={setCurrentFlow}
						setConfirmDelete={setConfirmDelete}
						onAdd={onAdd}
					/>
				</Panel>
			</ReactFlow>
		</Wrap>
	);
}

export default function Roadmap({
	editor,
	label,
	// roadMapTitle,
	// roadmapImage,
	toggleEditor,
	// roadmapDescription,
	// roadmapTag,
	setLabel,
	// blogKeyword,
	// onChangeBlogKeyword,
	// setBlogKeyword,
	// onRoadMapTitleChange,
	// setRoadMapTitle,
	id,
	onChangeLabel,
	setState,
	state,
	// onChangeId,
	setId,
	color,
	// onChangeColor
	setColor,
	// colorsState,
	setColorsState
	// selectedNode,
	// setSelectedNode,
}) {
	return (
		<ReactFlowProvider>
			<RoadmapCanvas
				editor={editor}
				// colorsState={colorsState}
				setColorsState={setColorsState}
				setState={setState}
				label={label}
				color={color}
				// onChangeColor={onChangeColor}
				setColor={setColor}
				// roadMapTitle={roadMapTitle}
				// roadmapImage={roadmapImage}
				toggleEditor={toggleEditor}
				// roadmapDescription={roadmapDescription}
				// onRoadMapTitleChange={onRoadMapTitleChange}
				// roadmapTag={roadmapTag}
				// setRoadMapTitle={setRoadMapTitle}
				setLabel={setLabel}
				// blogKeyword={blogKeyword}
				// onChangeBlogKeyword={onChangeBlogKeyword}
				// setBlogKeyword={setBlogKeyword}
				state={state}
				// onChangeId={onChangeId}
				onChangeLabel={onChangeLabel}
				id={id}
				setId={setId}
			/>
		</ReactFlowProvider>
	);
}
