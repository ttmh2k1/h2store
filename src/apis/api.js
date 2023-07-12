import axios from 'axios';

export const SERVICE = process.env.REACT_APP_BACKEND_URL;

/**
 *
 * @param {('GET'|'PUT'|'POST'|'DELETE')} method
 * @param {string} path
 * @param {Object} body
 * @param {Object} headers
 * @returns {Promise<import("axios").AxiosResponse<any>>}
 */
async function api(method, path, body, headers) {
    const token = localStorage.getItem('token') || null;
    const defaultHeaderOptions = {
        Authorization: token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json'
    };

    const headerAuth = {
    };
    const options = {
    };
    options.headers = { ...defaultHeaderOptions, ...headerAuth };

    const res = await axios({
        method,
        url: `${path}`,
        headers: { ...options.headers, ...headers },
        data: body
    });

    return res;
}

export default {
    GET: (path, headers) => api('GET', path, null, headers),
    POST: (path, body, headers) => api('POST', path, body, headers),
    PUT: (path, body, headers) => api('PUT', path, body, headers),
    DELETE: (path, body, headers) => api('DELETE', path, body, headers),
};
