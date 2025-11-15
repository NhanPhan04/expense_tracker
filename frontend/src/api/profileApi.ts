import axios from './auth'; // axios đã config baseURL + token

export const getProfile = () => axios.get('/profile');
export const updateProfile = (data: any) => axios.patch('/profile', data);
export const deleteProfile = () => axios.delete('/profile');
