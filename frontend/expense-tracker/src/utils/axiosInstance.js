import axois from "axios";
import { BASE_URL } from "./apiPath";

const axiosInstance = axois.create({
    baseURL: BASE_URL,
    timeout: 10000, //10 seconds timeout
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("token");
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

//response interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        //Handle error globally
        if (error.response) {
            if (error.response.status === 401) {
                //redirect to login page
                window.location.href = "/login";
            } else if (error.response.status === 500) {
                console.error("Server Error, Please try again later.");
            }
        } else if (error.code === "ECONNABORTED") {
            console.error("Request timed out. Please try again.");
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;