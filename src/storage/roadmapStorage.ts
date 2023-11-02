import { type NewRoadmap } from '../components/types/roadmapTypes';

const ROADMAP_LOCALSTORAGE_KEY = 'roadmaps';
const ROADMAP_BY_ID_LOCALSTORAGE_KEY = 'roadmapById';

export function getStoredRoadmap(): NewRoadmap | null {
	const storedRoadmap = localStorage.getItem(ROADMAP_LOCALSTORAGE_KEY);
	return storedRoadmap ? JSON.parse(storedRoadmap) : null;
}

export function setStoredRoadmap(roadmap: NewRoadmap): void {
	localStorage.setItem(ROADMAP_LOCALSTORAGE_KEY, JSON.stringify(roadmap));
}

export function clearStoredRoadmap(): void {
	localStorage.removeItem(ROADMAP_LOCALSTORAGE_KEY);
}

export function getStoredRoadmapById(): NewRoadmap | null {
	const storedRoadmap = localStorage.getItem(ROADMAP_BY_ID_LOCALSTORAGE_KEY);
	return storedRoadmap ? JSON.parse(storedRoadmap) : null;
}
export function setStoredRoadmapById(roadmap: NewRoadmap): void {
	localStorage.setItem(ROADMAP_BY_ID_LOCALSTORAGE_KEY, JSON.stringify(roadmap));
}

export function clearStoredRoadmapById(): void {
	localStorage.removeItem(ROADMAP_BY_ID_LOCALSTORAGE_KEY);
}
