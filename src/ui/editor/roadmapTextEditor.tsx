/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { RichTextEditor } from '@mantine/tiptap';
import { Highlight } from '@tiptap/extension-highlight';
import { Link } from '@tiptap/extension-link';
import { Placeholder } from '@tiptap/extension-placeholder';
import { Subscript } from '@tiptap/extension-subscript';
import { Superscript } from '@tiptap/extension-superscript';
import { TextAlign } from '@tiptap/extension-text-align';
import { Underline } from '@tiptap/extension-underline';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { type ReactElement, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ReactFlowProvider } from 'reactflow';
import { styled } from 'styled-components';
import MainLayout from '../header/mainLayout';

import Roadmap from './roadmapEditor';
import useInput from '../../components/hooks/useInput';

const EditorWrap = styled.div`
	display: inline-flex;
	width: 100vw;

	& .roadMapWrap {
		/* height: 100%; */
		width: 100%;
	}
`;

export default function RoadMapEditor(): ReactElement {
	const [label, onChangeLabel, setLabel] = useInput(''); // 노드 상세 내용
	const [blogKeyword, onChangeBlogKeyword, setBlogKeyword] = useInput(''); // 노드 상세 내용
	const [color, onChangeColor, setColor] = useInput('#fff'); // 노드 색
	// const [gptDetails, onChangeGptDetails, setGptDetails] = useInput(''); // 노드 색
	const [id, onChangeId, setId] = useInput('');
	const [toggle, onChangeToggle, setToggle] = useInput('');
	const [state, setState] = useState([
		// tiptap 에디터 내용
		{ id: '1', details: '' },
		{ id: '2', details: '' }
	]);
	const [colorsState, setColorsState] = useState([
		// tiptap 에디터 내용
		{ id: '1', color: '#fff' },
		{ id: '2', color: '#fff' },
		{ id: '3', color: '#fff' }
	]);
	// const [roadmapDescription, setRoadmapDescription] = useState('');
	// const [roadmapImage, setRoadmapImage] = useState('');

	// const [roadmapTag, setRoadmapTag] = useState('');

	const [cursorPosition, setCursorPosition] = useState(0);
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [roadMapTitle, onRoadMapTitleChange, setRoadMapTitle] = useInput('');

	const editor = useEditor({
		extensions: [
			StarterKit,
			Placeholder.configure({
				placeholder: '로드맵 상세 내용을 입력해주세요.'
			}),
			Underline,
			Link,
			Superscript,
			Subscript,
			Highlight,
			TextAlign.configure({ types: ['heading', 'paragraph'] })
		],
		content: state.filter(v => v?.id === id)[0]?.details || '',
		autofocus: false,

		onUpdate(e) {
			setToggle(e.editor?.getHTML());
			// console.log('e.editor', e.editor);
			// console.log('e.editor isFocused', e.editor.getHTML());
			// eslint-disable-next-line array-callback-return
			state.map((item, idx) => {
				if (item?.id !== id) return;
				const copyState = [...state];
				copyState.splice(idx, 1, {
					id: item?.id,
					details: e.editor?.getHTML()
				});
				setState(copyState);
			});
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-expect-error
			setCursorPosition(e?.transaction?.curSelection?.$anchor?.pos);
			// console.log(
			//   'ontransaction',
			//   // @ts-ignore
			//   e?.transaction?.curSelection?.$anchor?.pos,
			// );
			// e.editor?.chain().focus().setTextSelection(10).run();
		}
		// onTransaction: ({ transaction }) => {
		//   // @ts-ignore
		//   console.log('ontransaction', transaction?.curSelection?.$anchor?.pos);
		//   e.editor?.chain().focus().setTextSelection(10).run();
		// },
	});

	useMemo(() => {
		const filt = state.filter(v => v?.id === id);
		// console.log('filt', filt);
		setToggle(filt);
		if (editor) {
			editor.commands.setContent(filt[0]?.details, false, {
				preserveWhitespace: 'full'
			});
			if (editor.isFocused) {
				editor.chain().focus().setTextSelection(cursorPosition).run();
			}
		}
		if (label !== '' && filt.length === 0) {
			setState([...state, { id, details: '' }]);
		}
	}, [state, setToggle, editor, label, id]);

	const toggleEditor = useMemo(() => {
		return (
			id === toggle[0]?.id && (
				<RichTextEditor editor={editor}>
					<RichTextEditor.Toolbar sticky stickyOffset={5}>
						<RichTextEditor.ControlsGroup>
							<RichTextEditor.Bold />
							<RichTextEditor.Italic />
							<RichTextEditor.Underline />
							<RichTextEditor.Strikethrough />
							<RichTextEditor.ClearFormatting />
							<RichTextEditor.Highlight />
							<RichTextEditor.Code />
						</RichTextEditor.ControlsGroup>

						<RichTextEditor.ControlsGroup>
							<RichTextEditor.H1 />
							<RichTextEditor.H2 />
							<RichTextEditor.H3 />
							<RichTextEditor.H4 />
						</RichTextEditor.ControlsGroup>

						<RichTextEditor.ControlsGroup>
							<RichTextEditor.Blockquote />
							<RichTextEditor.Hr />
							<RichTextEditor.BulletList />
							<RichTextEditor.OrderedList />
							<RichTextEditor.Subscript />
							<RichTextEditor.Superscript />
						</RichTextEditor.ControlsGroup>

						<RichTextEditor.ControlsGroup>
							<RichTextEditor.Link />
							<RichTextEditor.Unlink />
						</RichTextEditor.ControlsGroup>

						<RichTextEditor.ControlsGroup>
							<RichTextEditor.AlignLeft />
							<RichTextEditor.AlignCenter />
							<RichTextEditor.AlignJustify />
							<RichTextEditor.AlignRight />
						</RichTextEditor.ControlsGroup>
					</RichTextEditor.Toolbar>
					<RichTextEditor.Content style={{ minHeight: '20em' }} />
				</RichTextEditor>
			)
		);
	}, [id, toggle]);

	return (
		<MainLayout>
			<EditorWrap>
				<div className="roadMapWrap">
					<ReactFlowProvider>
						<Roadmap
							// colorsState={colorsState}
							setColorsState={setColorsState}
							state={state}
							editor={editor}
							id={id}
							// blogKeyword={blogKeyword}
							// onChangeBlogKeyword={onChangeBlogKeyword}
							// setBlogKeyword={setBlogKeyword}
							toggleEditor={toggleEditor}
							// roadMapTitle={roadMapTitle}
							// onChangeId={onChangeId}
							// onRoadMapTitleChange={onRoadMapTitleChange}
							// setRoadMapTitle={setRoadMapTitle}
							setId={setId}
							label={label}
							setLabel={setLabel}
							color={color}
							// onChangeColor={onChangeColor}
							setColor={setColor}
							onChangeLabel={onChangeLabel}
							setState={setState}
							// roadmapImage={roadmapImage}
							// roadmapDescription={roadmapDescription}
							// roadmapTag={roadmapTag}
						/>
					</ReactFlowProvider>
				</div>
			</EditorWrap>
		</MainLayout>
	);
}
