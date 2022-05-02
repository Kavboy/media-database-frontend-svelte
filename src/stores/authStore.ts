import { writable } from 'svelte/store';
import { axiosLaravelAPI, csrf } from '../apis/AxiosLaravel.js';
import type { User } from '../utils/interfaces.js';

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

	const logout = () => {
	csrf()
		.then(() => {
		axiosLaravelAPI().post('/logout').then(res => {
			if (res.status === 200) {
			set(null);
			} else {
			set(null);
			}
		});
		})
		.catch(error => {
		set(null);
		throw error;
		});
	};

	const whoami = () => {
	axiosLaravelAPI().get('/user/whoami')
		.then(res => {
		if (res.status === 200) {
			set(res.data);
		}
		})
		.catch(error => {
		throw error;
		});
	};

	const check = () => {
		axiosLaravelAPI().get('/check')
		.then((res) => {
			if (res.status === 204) {
				whoami();
			} else {
				set(null);
			}
		})
		.catch(error => {
			set(null);
		});
	}

	const changeOwnPassword = (data: any) => axiosLaravelAPI().post('/user/change_password', data)
      .then(res => {
        return true;
      })
    .catch(error => {throw error});

	return {
		subscribe,
		login,
		logout,
		whoami,
		check,
		changeOwnPassword
	};
}

export const authStore = createAuth();