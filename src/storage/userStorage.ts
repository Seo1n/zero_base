import { type User } from "../components/types/types";

const USER_LOCALSTORAGE_KEY = 'user';

export function getStoredUser(): User | null {
  const storedUser = localStorage.getItem(USER_LOCALSTORAGE_KEY);
  return (storedUser != null) ? JSON.parse(storedUser) : null;
}

export function setStoredUser(user: User): void {
  localStorage.setItem(USER_LOCALSTORAGE_KEY, JSON.stringify(user));
}

export function clearStoredUser(): void {
  localStorage.removeItem(USER_LOCALSTORAGE_KEY);
}
