import { type Prompt } from '../components/types/types';

const GPT_LOCALSTORAGE_KEY = 'recent_gpt_search';

export function getStoredGpt(): Prompt | null {
	const storedPrompt = localStorage.getItem(GPT_LOCALSTORAGE_KEY);
	return storedPrompt ? JSON.parse(storedPrompt) : null;
}

export function setStoredGpt(prompt: Prompt): void {
	localStorage.setItem(GPT_LOCALSTORAGE_KEY, JSON.stringify(prompt));
}

export function clearStoredGpt(): void {
	localStorage.removeItem(GPT_LOCALSTORAGE_KEY);
}
