import {
	Avatar,
	Card,
	createStyles,
	Group,
	Image,
	rem,
	SimpleGrid,
	Tabs,
	Text
} from '@mantine/core';
import { IconPencil, IconPhoto } from '@tabler/icons-react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { baseUrl } from '../../axiosInstance/constants';
import useUser from '../../components/hooks/useUser';


const useStyles = createStyles(theme => ({
	card: {
		backgroundColor:
			theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
		transition: 'transform 150ms ease, box-shadow 150ms ease',

		'&:hover': {
			transform: 'scale(1.01)',
			boxShadow: theme.shadows.md
		},
		borderRadius: theme.radius.md,
		boxShadow: theme.shadows.lg,
		width: '98%',
		margin: '2rem auto 1rem'
	},

	title: {
		fontFamily: `Greycliff CF, ${theme.fontFamily}`,
		whiteSpace: 'nowrap',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		marginTop: '1.5rem',
		borderTop: '1px',
		fontSize: '1rem'
	},

	desc: {
		display: '-webkit-box',
		overflow: 'hidden',
		WebkitLineClamp: 3,
		WebkitBoxOrient: 'vertical',
		fontFamily: `Greycliff CF, ${theme.fontFamily}`,
		maxHeight: '4.5em',
		lineHeight: '1.3em',
		marginTop: '0.5rem'
	},

	like: {
		color: theme.colors.red[6]
	},

	item: {
		width: '100%'
	},

	section: {
		height: '18rem',
		cursor: 'pointer'
	},

	footer: {
		padding: `${theme.spacing.xs} ${theme.spacing.lg}`,
		marginTop: theme.spacing.md,
		borderTop: `${rem(1)} solid ${
			theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2]
		}`
	}
}));

export default function UserRoadmap() {
	const [joinedRoadmap, setJoinedRoadmap] = useState([]);
	const [savedRoadmap, setSavedRoadmap] = useState([]);
	const { user } = useUser();
	const { classes } = useStyles();
	const navigate = useNavigate();
	const [currentPage, setCurrentPage] = useState('');

	useEffect(() => {
		void axios
			.get(`${baseUrl}/members/${user.nickname}/in-progress-roadmaps`, {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${user?.accessToken}`
				}
			})

			.then(v => {
				setJoinedRoadmap(v?.data);
			})
			.catch();
	}, [user?.accessToken, user.nickname]);

	useEffect(() => {
		void axios
			.get(`${baseUrl}/members/${user.nickname}/roadmaps`, {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${user?.accessToken}`
				}
			})

			.then(v => {
				setSavedRoadmap(v?.data);
			})
			.catch();
	}, [user?.accessToken, user.nickname]);

	return (
		<Tabs color="violet" defaultValue="gallery" mt={40}>
			<Tabs.List position="center">
				<Tabs.Tab value="gallery" icon={<IconPhoto size="0.8rem" />}>
					진행 중인 로드맵
				</Tabs.Tab>
				<Tabs.Tab value="messages" icon={<IconPencil size="0.8rem" />}>
					내가 만든 로드맵
				</Tabs.Tab>
			</Tabs.List>

			<Tabs.Panel value="gallery" pt="xs">
				<SimpleGrid
					cols={4}
					breakpoints={[
						{ maxWidth: 'sm', cols: 1 },
						{ maxWidth: 'md', cols: 2 },
						{ maxWidth: 'lg', cols: 3 }
					]}
				>
					{joinedRoadmap.length === 0 ? (
						<Text my={100} ta="center">
							진행 중인 로드맵이 없습니다. 로드맵 참여를 눌러 다른 로드맵에
							참여해주세요!
						</Text>
					) : (
						joinedRoadmap.map(article => (
							<Card key={article.id} className={classes.card}>
								<Card.Section
									className={classes.section}
									onMouseOver={() => {
										setCurrentPage(article.id);
									}}
									onClick={() => {
                                        if (currentPage) {
                                            navigate(`/roadmap/post/${currentPage}`)
                                        }
									}}
								>
									<Image
										src={article.thumbnailUrl}
										alt={`${article.title}.img`}
										height={160}
										width={260}
										style={{ cursor: 'pointer' }}
										onMouseOver={() => {
											setCurrentPage(article.id);
										}}
										onClick={e => {
											e.stopPropagation();
											if (currentPage) {
                                                navigate(`/roadmap/post/${currentPage}`)
                                            }
										}}
									/>
									<Text fw={700} className={classes.title} mx={20}>
										{article?.title}
									</Text>
									<Text fz="sm" className={classes.desc} mx={20}>
										{article.description}
									</Text>
								</Card.Section>
								<Text fz="xs" c="dimmed" mx={8}>
									{article.createdAt}
								</Text>
								<Card.Section className={classes.footer}>
									<Group>
										<Avatar radius="xl" color="blue">
											{article?.member?.nickname.substring(0, 1)}
										</Avatar>

										<Text fz="sm" fw={600}>
											{article?.member?.nickname}
										</Text>
									</Group>
								</Card.Section>
							</Card>
						))
					)}
				</SimpleGrid>
			</Tabs.Panel>

			<Tabs.Panel value="messages" pt="xs">
				<SimpleGrid
					cols={4}
					breakpoints={[
						{ maxWidth: 'sm', cols: 1 },
						{ maxWidth: 'md', cols: 2 },
						{ maxWidth: 'lg', cols: 3 }
					]}
				>
					{savedRoadmap.length === 0 ? (
						<Text ta="center" my={100}>
							만든 로드맵이 없습니다. 로드맵 생성 버튼을 누르고 로드맵을
							생성해보세요!
						</Text>
					) : (
						savedRoadmap.map(article => (
							<Card key={article.id} className={classes.card}>
								<Card.Section
									className={classes.section}
									onMouseOver={() => {
										setCurrentPage(article.id);
									}}
									onClick={() => {
										if (currentPage) {
                                            navigate(`/roadmap/post/${currentPage}`)
                                        }
									}}
								>
									<Image
										src={article.thumbnailUrl}
										alt={`${article.title}.img`}
										height={160}
										width={260}
										style={{ cursor: 'pointer' }}
										onMouseOver={() => {
											setCurrentPage(article.id);
										}}
										onClick={e => {
											e.stopPropagation();
											if (currentPage) {
                                                navigate(`/roadmap/post/${currentPage}`)
                                            }
										}}
									/>
									<Text fw={700} className={classes.title} mx={20}>
										{article?.title}
									</Text>
									<Text fz="sm" className={classes.desc} mx={20}>
										{article.description}
									</Text>
								</Card.Section>
								<Text fz="xs" c="dimmed" mx={8}>
									{article.createdAt}
								</Text>
								<Card.Section className={classes.footer}>
									<Group>
										<Avatar radius="xl" color="blue">
											{article?.member?.nickname.substring(0, 1)}
										</Avatar>

										<Text fz="sm" fw={600}>
											{article?.member?.nickname}
										</Text>
									</Group>
								</Card.Section>
							</Card>
						))
					)}
				</SimpleGrid>
			</Tabs.Panel>
		</Tabs>
	);
}
