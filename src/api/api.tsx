import axios from "axios";
import { deleteValueFor, getValueFor } from "../utils/session";

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
});

const getToken = async () => {
    try {
        const storedUser = await getValueFor("user");
        if (storedUser) {
            const { token } = JSON.parse(storedUser);
            return token;
        }
    } catch (error) {
        console.error("Error fetching user token:", error);
    }
    return null;
};

const deleteToken = async () => {
    try {
        await deleteValueFor("user");
    } catch (error) {
        console.error("Error deleting user token:", error);
    }
    return null;
};

api.interceptors.request.use(
    async (config) => {
        const token = await getToken();
        if (token) {
            config.headers.Authorization = token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response && error.response.status === 401) {
            originalRequest._retry = true;
            const token = await getToken();
            if (token) {
                api.defaults.headers.common["Authorization"] = token;
                originalRequest.headers.Authorization = token;
                return api(originalRequest);
            }
        }

        if (error.response && error.response.status === 403) {
            await deleteToken();
        }

        return Promise.reject(error);
    }
);

export default api;
