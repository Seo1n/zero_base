/* eslint-disable no-console */
import { type AxiosResponse } from 'axios';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../../axiosInstance/axios';
import useUser from '../hooks/useUser';

import { type Prompt } from '../types/types';

interface UsePrompt {
	getprompt: (keyword: string) => Promise<void>;
}

interface PromptResponse {
	prompt: Prompt[];
}

function usePrompt(): UsePrompt {
	const SERVER_ERROR = 'error contacting server';
	const navigate = useNavigate();
	const { user } = useUser();

	async function promptServerCall(
		urlEndpoint: string,
		keyword: string
	): Promise<void> {
		try {
			const { data, status }: AxiosResponse<PromptResponse> =
				await axiosInstance({
					url: urlEndpoint,
					method: 'POST',
					data: { keyword },
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${user?.accessToken}`
					}
				});
			if (status === 200) {
				localStorage.setItem(
					'recent_gpt_search',
					JSON.stringify({ keyword, data }) // 검색어에 대한 data 저장하도록
				);
				navigate(`/roadmap/editor`);
			}
		} catch (errorResponse) {
			console.log(`${SERVER_ERROR}!: ${JSON.stringify(errorResponse)}`);
		}
	}

	async function getprompt(keyword: string): Promise<void> {
		void promptServerCall(`/chat?prompt=${keyword}`, keyword);
	}

	return { getprompt };
}

export default usePrompt;
