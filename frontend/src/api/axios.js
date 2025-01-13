import axios from 'axios';

export default axios.create({
    baseURL: 'https://kusatypes.com/api',
    headers: {
        'Content-Type': 'application/json'
    }

});


