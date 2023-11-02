/* eslint-disable no-console */
import { Avatar, Box, Button, Group, Text } from '@mantine/core';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../header/mainLayout';

import { baseUrl } from '../../axiosInstance/constants';
import useUser from '../../components/hooks/useUser';
import UserRoadmap from './userRoadmap';

function UserProfile() {
	const navigate = useNavigate();
	const { user } = useUser();
	const [nickname, setNickname] = useState('');
	const [bio, setBio] = useState('');
	const [baekjoonId, setBaekjoonId] = useState('');

	useEffect(() => {
		if (!user?.id) {
			console.error('User memberId is not available.');
			return;
		}

		axios
			.get(`${baseUrl}/members/${user.id}`)
			.then(response => {
				setNickname(response.data.nickname);
				setBio(response.data.bio);
				setBaekjoonId(response.data.baekjoonId);
			})
			.catch(e => {
				console.log(e);
			});
	}, [user.id, user.nickname]);

	const myinfo = (
		<Box ta="center">
			<Group position="center" mt={50}>
				<Avatar color="blue" radius="50rem" size="8em">
					{nickname.substring(0, 1)}
				</Avatar>
			</Group>
			<Text fz="xl" fw={900} mt={20}>
				{nickname}
			</Text>
			<Text size="sm" mt={10}>
				{bio}
			</Text>
			<Text fz="sm" color="dimmed" lineClamp={4}>
				{baekjoonId}
			</Text>
			<Button
				onClick={() => {
					navigate('edit');
				}}
				mt={20}
				radius="lg"
				variant="light"
				color="indigo"
			>
				프로필 수정
			</Button>
		</Box>
	);

	return (
		<MainLayout>
			{myinfo}
			<UserRoadmap />
		</MainLayout>
	);
}

export default UserProfile;
