import axios from "axios";
import {Toast, useToastController} from "@tamagui/toast";

const axiosInstance = axios.create({
    baseURL: "http://localhost/api",
    headers: {
        "Content-Type": "application/json",
    },
});

// Add a request interceptor

axiosInstance.interceptors.request.use(
    (config) => {
        // Do something before request is sent
        console.log("Request Interceptor", config);
        return config;
    },
    (error) => {
        // Do something with request error
        console.error("Request Interceptor Error", error);
        return Promise.reject(error);
    }
);

export default axiosInstance;