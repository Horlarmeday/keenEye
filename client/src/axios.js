import axios from "axios";
import store from "./store/modules/auth";
import { notifyError, notifySuccess } from "./notification";

const token = localStorage.getItem("user_token");

axios.defaults.baseURL = "/api";
axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
axios.defaults.timeout = 180000;
axios.interceptors.response.use(
    response => {
        switch (response.status) {
            case 201:
                notifySuccess(response);
                break;
            case 204:
                notifySuccess(response);
                break;
            case 401:
                store.dispatch("logout");
                break;
        }
        return response;
    },
    error => {
        let res = error.response;
        if (error.response && error.response.data) {
            if (res.status === 401) store.dispatch("logout");
            //add your code
            notifyError(error);
            return Promise.reject(error.response.data);
        }
        notifyError(error);
        return Promise.reject(error.message);
    }
);

export default axios;