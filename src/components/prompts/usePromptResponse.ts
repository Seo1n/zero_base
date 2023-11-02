import { useQuery, useQueryClient } from 'react-query';

import queryKeys from '../react-query/constants';
import {
	clearStoredGpt,
	getStoredGpt,
	setStoredGpt
} from '../../storage/gptStorage';
import { type Prompt } from '../types/types';

interface UsePromptAnswer {
	prompt: Prompt | null;
	updateGptAnswer: (prompt: Prompt) => void;
	clearGptAnswer: () => void;
}
function usePromptAnswer(): UsePromptAnswer {
	const queryClient = useQueryClient();
	const { data: prompt } = useQuery(queryKeys.prompt, () => getStoredGpt(), {
		initialData: getStoredGpt,
		onSuccess: (received: Prompt | null) => {
			if (!received) {
				clearStoredGpt();
			} else {
				setStoredGpt(received);
			}
		}
	});
	function updateGptAnswer(newPrompt: Prompt): void {
		queryClient.setQueriesData(queryKeys.prompt, newPrompt);
	}
	function clearGptAnswer() {
		queryClient.setQueriesData(queryKeys.user, null);
	}

	return { prompt, updateGptAnswer, clearGptAnswer };
}

export default usePromptAnswer;
