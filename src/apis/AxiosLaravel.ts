import type { MediaPages } from '@src/utils/interfaces';
import axios, { AxiosInstance, AxiosResponse } from 'axios';

/**
 * Creates a new axios instance for the backend
 * @returns {AxiosInstance}
 */
const axiosLaravelAPI = (): AxiosInstance => {
  let hostname = window.location.hostname;

  hostname = 'http://localhost:8080';
  // hostname = 'http://192.168.178.21/mdb-backend'

  return axios.create({
    baseURL: hostname + '/api/v1',
    withCredentials: true,
    headers: {
      'Accept': 'application/json',
    },
  });
};

/**
 * Cross site reference request to the backend
 * @returns {Promise<AxiosResponse<any>>}
 */
const csrf = (): Promise<AxiosResponse<any>> => axiosLaravelAPI().get('/csrf-cookie');

/**
 * Request for the statistics data
 * @param page
 * @returns {Promise<AxiosResponse<any>>}
 */
const getStatistics = (page): Promise<AxiosResponse<any>> => axiosLaravelAPI().get('/statistic?page=' + page)
  .then(res => {
    if (res.status === 200) {
      return res.data;
    }
    return null;
  })
  .catch(error => {
    throw error;
  });

/**
 * Request for the user information
 * @param {string} page
 * @returns {Promise<AxiosResponse<any>>}
 */
const getUsersTable = (page: string): Promise<AxiosResponse<any>> => axiosLaravelAPI().get('/user?page=' + page)
  .then(res => {
    if (res.status === 200) {
      return res.data;
    }
    return null;
  })
  .catch(error => {
    throw error;
  });


/**
 * Request for information about a single user
 * @param {string} username
 * @returns {Promise<Boolean>}
 */
const singleUser = (username: string): Promise<Boolean> => axiosLaravelAPI().get('/user/' + username)
  .then(res => {
    if (res.status === 200) {
      return true;
    }
    return null;
  })
  .catch(error => {
    throw error;
  });

/**
 * Request to patch a user based on its username with provided data
 * @param username
 * @param data
 * @returns {Promise<AxiosResponse<any>>}
 */
const patchUser = (username, data): Promise<AxiosResponse<any>> => axiosLaravelAPI().patch('/user/' + username, data)
  .then(res => {
    return res;
  })
  .catch(error => {
    throw error;
  });

/**
 * Request to change the password for user with the provided username
 * @param username
 * @param data
 * @returns {Promise<AxiosResponse<any>>}
 */
const changeUserPassword = (username, data): Promise<AxiosResponse<any>> => axiosLaravelAPI().post('/user/change_password/' + username, data)
  .then(res => {
    return res;
  })
  .catch(error => {
    throw error;
  })

/**
 * Request to get the media data
 * @param page
 * @returns {Promise<any>}
 */
const getMediasTable = (page): Promise<any> => axiosLaravelAPI().get('/media/table?page=' + page)
  .then(res => {
    if (res.status === 200) {
      return res.data;
    }
    return null;
  })
  .catch(error => {
    throw error;
  });

/**
 * Request to get a media news
 * 
 * @returns {Promise<>}
 */
const getNews = (): Promise<any> => axiosLaravelAPI().get('/media/news')
  .then(res => {
    if (res.status === 200) {
      return res.data;
    }
    return null;
  })
  .catch(error => {
    throw error;
  });

/**
 * Request to get a single media with specific id
 * @param id
 * @returns {Promise<AxiosResponse<any>>}
 */
const getMedia = (id): Promise<AxiosResponse<any>> => axiosLaravelAPI().get('/media/' + id)
  .then(res => {
    if (res.status === 200) {
      return res;
    }
    return null;
  })
  .catch(error => {
    throw error;
  });

/**
 * Adds media to the database
 * 
 * @param data 
 * @returns 
 */
const addMedia = (data: object) : Promise<any> => axiosLaravelAPI().post('/media', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }).then(res => {
    if (res.status === 201) {
      location.replace("/media/" + res.data.id);
    }
  }).catch(error => {
    throw error;
  });

/**
 * Request to mark media as seen
 * @param id
 * @returns {Promise<boolean>}
 */
const markMediaSeen = (id): Promise<boolean> => axiosLaravelAPI().post('/media/mark_seen/' + id)
  .then(res => {
    return res.status === 200;

  })
  .catch(error => {
    throw error;
  });

/**
 * Request to mark media as unseen
 * @param id
 * @returns {Promise<boolean>}
 */
const markMediaUnseen = (id): Promise<boolean> => axiosLaravelAPI().post('/media/mark_unseen/' + id)
  .then(res => {
    return res.status === 200;

  })
  .catch(error => {
    throw error;
  });

/**
 * Search only for titles of media
 * @param data JSON containing a title
 * @returns {Promise<AxiosResponse<any>>}
 */
const getTitles = (data): Promise<AxiosResponse<any>> => axiosLaravelAPI().post('/media/titles', data)
  .then(res => {
    if (res.status === 200) {
      return res.data;
    }
    return [];
  })
  .catch(error => {
    throw error;
  });

/**
 * Search for media
 * @param data JSON that can contain a title. Mediums, genres and age_ratings as array
 * @returns {Promise<AxiosResponse<any>>}
 */
const searchMedia = (data): Promise<AxiosResponse<any>> => axiosLaravelAPI().post('/media/search', data)
  .then(res => {
    if (res.status === 200) {
      return res;
    }
    return null;
  })
  .catch(error => {
    throw error;
  });

/**
 * Request to get all mediums
 * @returns {Promise<Array<string>>}
 */
const getMediums = (): Promise<Array<string>> => axiosLaravelAPI().get('/medium')
  .then(res => {
    if (res.status === 200) {
      return res.data.map(medium => medium.medium);
    }
    return [];
  })
  .catch(error => {
    throw error;
  });

/**
 * Request to get all Genres
 * @returns {Promise<Array<string>>}
 */
const getGenre = (): Promise<Array<string>> => axiosLaravelAPI().get('/genre')
  .then(res => {
    if (res.status === 200) {
      return res.data.map(genre => genre.name);
    }
    return [];
  })
  .catch(error => {
    throw error;
  });

/**
 * Request to get all age ratings
 * @returns {Promise<Array<string>>}
 */
const getFSK = (): Promise<Array<string>> => axiosLaravelAPI().get('/fsk')
  .then(res => {
    if (res.status === 200) {
      return res.data.map(fsk => fsk.fsk);
    }
    return [];
  })
  .catch(error => {
    throw error;
  });

/**
 * Request to get all roles
 * @returns {Promise<Array<string>>}
 */
const getRoles = (): Promise<Array<string>> => axiosLaravelAPI().get('/role')
  .then(res => {
    if (res.status === 200) {
      return res.data.map(role => role.role);
    }
    return [];
  })
  .catch(error => {
    throw error;
  });

/**
 * Request to get all locations
 * @returns {Promise<any>}
 */
const getLocations = (): Promise<any> => axiosLaravelAPI().get('/location')
  .then(res => {
    return res;
  })
  .catch(error => {
    throw error;
  });

/**
 * Request to add new location
 * @returns {Promise<AxiosResponse<any>>}
 */
const addLocation = (data): Promise<AxiosResponse<any>> => axiosLaravelAPI().put('/location', data)
  .then(res => {
    return res;
  })
  .catch(error => {
    throw error;
  });

/**
 * Request to edit a location
 * @returns {Promise<AxiosResponse<any>>}
 */
const patchLocation = (id, data): Promise<AxiosResponse<any>> => axiosLaravelAPI().patch('/location/' + id, data )
  .then(res => {
    return res;
  })
  .catch(error => {
    throw error;
  });

/**
 * Delete request, for a type
 * @param type user, media, medium or location
 * @param id Id of the type that should be deleted
 * @returns {Promise<AxiosResponse<any>>}
 */
const deleteType = (type, id): Promise<AxiosResponse<any>> => axiosLaravelAPI().delete(`/${type}/` + id)
  .then(res => {
    return res;
  })
  .catch(error => {
    throw error;
  });

export {
  axiosLaravelAPI,
  csrf,
  getMediasTable,
  markMediaSeen,
  markMediaUnseen,
  getNews,
  getMedia,
  addMedia,
  getTitles,
  searchMedia,
  getUsersTable,
  getStatistics,
  patchUser,
  changeUserPassword,
  getMediums,
  getGenre,
  getFSK,
  getRoles,
  getLocations,
  addLocation,
  patchLocation,
  deleteType
};