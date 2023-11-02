import './App.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { Notifications } from '@mantine/notifications';
import RoadMapEditor from './ui/editor/roadmapTextEditor';
import { queryClient } from './components/react-query/queryClient';
import SignUpForm from './ui/forms/SignupForm';
import LoginForm from './ui/forms/LoginForm';
import MainPage from './pages/main/mainPage';
import UserProfile from './ui/profile/userProfile';
import EditUserProfile from './ui/profile/editUserProfile';

function App() {
	const router = createBrowserRouter([
		{
			path: '/',
			// errorElement: <ErrorPage />,
			children: [
				{ index: true, element: <MainPage /> },
				{
					path: 'users/signin',
					element: <LoginForm />
				},
				{ path: 'users/signup', element: <SignUpForm /> },
				{
					path: 'roadmap/editor',
					element: <RoadMapEditor />
				},
				// { path: '/roadmap/post/:Id', element: <RoadMapPostPage /> },
				// {
				//   path: '/roadmap/post/search/:keyword',
				//   element: <KeywordSearchRoadmaps />,
				// },
				{
					path: 'users/mypage',
					element: <UserProfile />
				},
				{ path: 'users/mypage/edit', element: <EditUserProfile /> }
			]
		}
	]);
	return (
		<QueryClientProvider client={queryClient}>
			<Notifications />
			<div className="App">
				<RouterProvider router={router} />
			</div>
			<ReactQueryDevtools />
		</QueryClientProvider>
	);
}

export default App;
