import Axios from 'axios';

const axiosInstance = Axios.create({
    validateStatus: status => status >= 200
});

export default axiosInstance;
