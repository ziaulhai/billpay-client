import axios from 'axios';
import { useMemo } from 'react';

const baseURL = 'https://billpay-server.vercel.app/api/v1'; 


const useAxios = () => {
    const instance = useMemo(() => {
        return axios.create({
            baseURL: baseURL,
            withCredentials: true,
        });
    }, [baseURL]);

    return instance;
};

export default useAxios;