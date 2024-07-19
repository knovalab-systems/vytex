import { createQuery } from '@tanstack/solid-query';
import { type Accessor, type JSXElement, createContext, createEffect, createSignal, useContext } from 'solid-js';
import { client } from '~/lib/client';

const AuthContext = createContext<AuthContext>({
	authStatus: () => 'unresolved' as AuthStatus,
	login(_email: string, _password: string) {
		return Promise.resolve();
	},
	logout() {
		return Promise.resolve();
	},
});

type AuthStatus = 'authenticated' | 'unresolved' | 'unauthenticated';

type AuthContext = {
	authStatus: Accessor<AuthStatus>;
	login: (email: string, password: string) => Promise<void>;
	logout: () => Promise<void>;
};

export function AuthProvider(props: { children: JSXElement }) {
	const [status, setStatus] = createSignal<AuthStatus>('unresolved');
	const refresh = createQuery(() => ({
		queryFn: async () => client.refresh(),
		queryKey: ['refresh'],
		retry: false,
	}));

	createEffect(() => {
		if (refresh.isSuccess && status() === 'unresolved') {
			setStatus('authenticated');
		} else if (refresh.isError && status() === 'unresolved') {
			setStatus('unauthenticated');
		}
	});

	const login = async (email: string, password: string) => {
		return await client.login(email, password).then(() => {
			setStatus('authenticated');
			return;
		});
	};

	const logout = async () => {
		return await client.logout().then(() => {
			setStatus('unauthenticated');
			return;
		});
	};

	return <AuthContext.Provider value={{ authStatus: status, login, logout }}>{props.children}</AuthContext.Provider>;
}

export function useAuth() {
	return useContext(AuthContext);
}
