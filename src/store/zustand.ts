import { create } from "zustand";

type User = {
	id: string;
	email: string;
	tokens: number;
	auth: string;
};

type AuthState = {
	user: User | null;
	updateUser: (user: User) => void;
	removeUser: () => void;
};

const useAuthStore = create<AuthState>((set) => ({
	user: null,
	updateUser: (user) => set({ user }),
	removeUser: () => set({ user: null }),
}));

export default useAuthStore;
