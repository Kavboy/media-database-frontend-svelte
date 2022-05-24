import { writable } from 'svelte/store';
import { axiosLaravelAPI, csrf } from '../apis/AxiosLaravel.js';
import type { User } from '../utils/interfaces.js';
import { navigate } from 'svelte-routing';

function createAuth() {
	const { subscribe, set, update } = writable<User>(null);

	const login = async (username: string, password: string) => {
		try {
		  await csrf();
		  const res = await axiosLaravelAPI().post('/login', { username, password });
	
		  if (res.status === 200) {
			set(res.data);
			return true;
		  }
	
		} catch (error) {
		  throw error;
		}
	  };

	const logout = async () => {
		try {
			await csrf();
			const res = await axiosLaravelAPI().post('/logout');
	  
			if (res.status === 200) {
				set(null);
			} else {
				set(null);
				location.replace('/');
			}
	  
		} catch (error) {
			set(null);
			location.replace('/');
			throw error;
		}
	};

	const whoami = async () => {
		try {
			let user: User | null;
			subscribe((value) => (user = value));
			if (!user) {
				const res = await axiosLaravelAPI().get('/user/whoami');
	  
				if (res.status === 200) {
					set(res.data);
				}
			}  
		} catch (error) {
			throw error;
		}
	};

	const check = async () => {
		try {
			let user: User | null;
			subscribe((value) => (user = value));
			if (!user) {
				const res = await axiosLaravelAPI().get('/check');
	  
				if (res.status === 204) {
					await whoami();
				} else {
					set(null);
				}
			}	
		} catch (error) {
			set(null);
		}
	}

	const changeOwnPassword = async (data: any) => { 
		try {
			await csrf();
			const res = await axiosLaravelAPI().post('/user/change_password', data);
	  
			if (res.status === 200) {
				return true;
			} else {
				return false;
			}
	  
		} catch (error) {
			throw error;
		}
	};

	const requireAuth = async (roles = [], redirectUrl = '/') => {
		await check()
		let user: User | null;
		subscribe((value) => (user = value));
		if (user === null) {
			location.replace(redirectUrl);
		  } else if (user !== null && roles.length !== 0 && !roles?.includes(user?.role)) {
			location.replace(redirectUrl);
		  }
	}

	return {
		subscribe,
		login,
		logout,
		whoami,
		check,
		changeOwnPassword,
		requireAuth
	};
}

export const authStore = createAuth();