import axios from "axios";
import {BASE_URL} from "../constants.js";
import toast from "react-hot-toast";

const axiosInstance = axios.create()
axiosInstance.defaults.baseURL = BASE_URL;
axiosInstance.defaults.withCredentials = true;

let isFirstRequest = true;
let toastShown = false;

// Request interceptor to track request timing
axiosInstance.interceptors.request.use(
    (config) => {
        config.metadata = { startTime: new Date() };
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to detect slow requests
axiosInstance.interceptors.response.use(
    (response) => {
        const endTime = new Date();
        const duration = endTime - response.config.metadata.startTime;
        
        // If first request takes more than 5 seconds and toast hasn't been shown yet
        if (isFirstRequest && duration > 5000 && !toastShown) {
            toastShown = true;
            toast.loading(
                "Server is waking up... First request may take 50-60 seconds. Please wait!",
                {
                    duration: 10000,
                    id: 'server-wakeup'
                }
            );
        }
        
        if (isFirstRequest) {
            isFirstRequest = false;
            toast.dismiss('server-wakeup');
        }
        
        return response;
    },
    (error) => {
        if (isFirstRequest) {
            isFirstRequest = false;
            toast.dismiss('server-wakeup');
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
