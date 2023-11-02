import { type AxiosResponse } from 'axios';
import { useQuery, useQueryClient } from 'react-query';

import { axiosInstance, getJWTHeader } from '../../axiosInstance/axios';
import queryKeys from '../react-query/constants';
import { type User } from '../types/types';
import {
	getStoredUser,
	setStoredUser,
	clearStoredUser
} from '../../storage/userStorage';

async function getUser(
	user: User | null,
	signal: AbortSignal
): Promise<User | null> {
	if (!user?.nickname) return null;
	const { data }: AxiosResponse<{ user: User }> = await axiosInstance.get(
		`/user/${user.nickname}`,
		{
			signal, // abortSignal from React Query
			headers: getJWTHeader(user?.accessToken)
		}
	);

	return data.user;
}

interface UseUser {
	user: User | null;
	updateUser: (user: User) => void;
	clearUser: () => void;
}

export function useUser(): UseUser {
	const queryClient = useQueryClient();

	// call useQuery to update user data from server
	const { data: user } = useQuery<User>(
		queryKeys.user,
		({ signal }) => getUser(user, signal),
		{
			// populate initially with user in localStorage
			initialData: getStoredUser,

			onSuccess: (received: null | User) => {
				if (!received) {
					clearStoredUser();
				} else {
					setStoredUser(received);
				}
			}
		}
	);

	function updateUser(newUser: User): void {
		// update the user
		queryClient.setQueryData(queryKeys.user, newUser);
	}

	function clearUser() {
		queryClient.setQueryData(queryKeys.user, null);

		queryClient.removeQueries([queryKeys.user]);
	}

	return { user, updateUser, clearUser };
}

export default useUser;
