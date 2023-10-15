import { useLocation } from 'react-router-dom';
import { styled } from 'styled-components';

import { HeaderMegaMenu } from './headerItem';

const Wrap = styled.section`
	width: 80vw;
	height: fit-content;
	margin: 0 auto;
`;

function MainLayout({ children }) {
	const { pathname } = useLocation();
	return (
		<>
			<HeaderMegaMenu />
			{pathname !== '/roadmap/editor' ? <Wrap>{children}</Wrap> : children}
		</>
	);
}
export default MainLayout;
