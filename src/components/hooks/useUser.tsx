import { AxiosResponse } from 'axios';
import { useQuery, useQueryClient } from 'react-query';

import { axiosInstance, getJWTHeader } from '../../../axiosInstance';
import { queryKeys } from '../../../react-query/constants';
import {
  clearStoredUser,
  getStoredUser,
  setStoredUser,
} from '../../../storage/user-storage';
import type { User } from '../../../types/types';

async function getUser(
  user: User | null,
  signal: AbortSignal,
): Promise<User | null> {
  if (!user.nickname) return null;
  const { data }: AxiosResponse<{ user: User }> = await axiosInstance.get(
    // `/user/${user.id}`,
    `/user/${user.nickname}`,
    {
      signal, // abortSignal from React Query
      headers: getJWTHeader(user?.accessToken),
    },
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
      },
    },
  );

  function updateUser(newUser: User): void {
    // update the user
    queryClient.setQueryData(queryKeys.user, newUser);
  }

  function clearUser() {
    queryClient.setQueryData(queryKeys.user, null);

    queryClient.removeQueries([queryKeys.nickname, queryKeys.user]);
  }

  return { user, updateUser, clearUser };
}
