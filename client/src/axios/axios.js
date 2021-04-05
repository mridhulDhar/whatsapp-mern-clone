import axios from 'axios';

const instance = axios.create({
    
    baseURL: 'http://' + process.env.APP_DOMAIN + ':' + process.env.APP_PORT
});

export default instance;