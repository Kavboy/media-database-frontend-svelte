import { writable } from 'svelte/store';
import type { AlertError } from '../utils/interfaces.js';

function createError() {
	const { subscribe, set, update } = writable<AlertError>({ variant: 'danger', show: false, content: 'network-error' });
     
       const hideError = () => {
         update( value => { 
             return {
           ...value,
           content: 'network-error',
           show: false
         }
        })
       }
     
       const setNetworkError = () => {
         update( value => { 
             return {
           ...value,
           show: true
         }
        })
       }
     
       const setUnexpectedError = () => {
         update( value => { 
             return {
           ...value,
           content: 'unexpected-error',
           show: true
         }
        })
       }
     
       const set401Error = () => {
        update( value => { 
            return {
           ...value,
           content: '401-error',
           show: true
        }
    })
       }
     
       const setTMDB401Error = () => {
        update( value => { 
            return {
           ...value,
           content: 'tmdb-401-error',
           show: true
         }
        })
       }
     
       const setTMDB404Error = () => {
        update( value => { 
            return {
           ...value,
           content: 'tmdb-404-error',
           show: true
         }
        })
       }
	

	return {
		subscribe,
        hideError,
        set401Error,
        setNetworkError,
        setTMDB401Error,
        setTMDB404Error,
        setUnexpectedError
	};
}

export const errorStore = createError();