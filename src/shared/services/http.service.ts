import axios, { AxiosRequestConfig, AxiosResponse, CancelToken } from 'axios';
import { API_BASE_URL } from 'shared/constants';
import { getUrl } from 'shared/constants/api';
import { IResponseObject } from 'shared/interface';
import AuthService from './auth.service';

const axiosInstance = axios.create();

interface IMiscellaneousRequestParams {
	contentType?: string;
	isPublic?: boolean;
	cancelToken?: CancelToken;
}

/**
 * get method
 * @param request object containing axios params
 */
const get = (url: string, params: any = {}, otherData: IMiscellaneousRequestParams = {}) =>
	commonAxios({ method: 'GET', url: getUrl(url, params), ...otherData });

/**
 * post method
 * @param request object containing axios params
 */
const post = (url: string, params: any = {}, otherData: IMiscellaneousRequestParams = {}) =>
	commonAxios({ method: 'POST', url: getUrl(url), data: params, ...otherData });

/**
 * put method
 * @param request object containing axios params
 */
const put = (url: string, params: any = {}, otherData: IMiscellaneousRequestParams = {}) =>
	commonAxios({ method: 'PUT', url: getUrl(url), data: params, ...otherData });

/**
 * deleteRequest method
 * @param request object containing axios params
 */
const deleteRequest = (url: string, params: any = {}, otherData: IMiscellaneousRequestParams = {}) =>
	commonAxios({ method: 'DELETE', url: getUrl(url), data: params, ...otherData });

/**
 * patch method
 * @param request object containing axios params
 */
const patch = (url: string, params: any = {}, otherData: IMiscellaneousRequestParams = {}) =>
	commonAxios({ method: 'PATCH', url: getUrl(url), data: params, ...otherData });

interface IAxiosParams extends IMiscellaneousRequestParams {
	method: string;
	url: string;
	data?: any;
	isAccessTokenRequire?: boolean;
}

/**
 * commonAxios
 * @param object containing method, url, data, access token, content-type, isLogin
 */
const commonAxios = (config: IAxiosParams): Promise<any> => {
	const {
		method,
		url,
		data,
		contentType = 'application/json',
		isPublic = false,
		isAccessTokenRequire = true
	} = config;
	const headers: any = {
		'Content-Type': contentType
	};

	// if end point is public than no need to provide access token
	if (!isPublic) {
		// const token = getAccessToken();
		// if (token) {
		// 	headers['x-access-token'] = `${token}`;
		// }
	}
	const token = isAccessTokenRequire && AuthService.getAccessToken();

	if (token) {
		headers['Authorization'] = `Bearer ${token}`;
	} else {
		headers['x-request-language'] = localStorage.getItem('lang') || 'en';
	}

	let body: any = null;
	if (contentType === 'application/json') {
		body = JSON.stringify(data);
	} else {
		body = data;
	}

	const axiosInstanceParams: AxiosRequestConfig = {
		method: method,
		baseURL: API_BASE_URL,
		url: url,
		cancelToken: config.cancelToken,
		headers: headers,
		data: body
	};

	return new Promise((resolve, reject) => {
		axiosInstance(axiosInstanceParams)
			.then((response: AxiosResponse<IResponseObject<any>>) => {
				resolve(response.data);
			})
			.catch((error) => {
				reject(error);
			});
	});
};

export { axiosInstance };

const HttpService = {
	get: get,
	post: post,
	put: put,
	deleteRequest: deleteRequest,
	patch: patch
};

export default HttpService;
