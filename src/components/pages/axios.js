import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:4000',    // ✅ Your backend URL
  withCredentials: true                // ✅ Critical for sending cookies
});

export default instance;
