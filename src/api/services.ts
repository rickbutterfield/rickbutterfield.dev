import type { CancelablePromise } from './core/CancelablePromise';
import { OpenAPI } from './core/OpenAPI';
import { request as __request } from './core/request';
import type { ContentData, MediaData } from './models';

export class ContentResource {

	/**
	 * @deprecated
	 * @returns PagedIApiContentResponseModel Success
	 * @throws ApiError
	 */
	public static getContent(data: ContentData['payloads']['GetContent'] = {}): CancelablePromise<ContentData['responses']['GetContent']> {
		const {
                    
                    fetch,
filter,
sort,
skip,
take,
expand,
acceptLanguage,
apiKey,
preview,
startItem
                } = data;
		return __request(OpenAPI, {
			method: 'GET',
			url: '/umbraco/delivery/api/v1/content',
			headers: {
				'Accept-Language': acceptLanguage, 'Api-Key': apiKey, Preview: preview, 'Start-Item': startItem
			},
			query: {
				fetch, filter, sort, skip, take, expand
			},
			errors: {
				400: `Bad Request`,
				404: `Not Found`,
			},
		});
	}

	/**
	 * @returns PagedIApiContentResponseModel Success
	 * @throws ApiError
	 */
	public static getContent20(data: ContentData['payloads']['GetContent20'] = {}): CancelablePromise<ContentData['responses']['GetContent20']> {
		const {
                    
                    fetch,
filter,
sort,
skip,
take,
expand,
fields,
acceptLanguage,
apiKey,
preview,
startItem
                } = data;
		return __request(OpenAPI, {
			method: 'GET',
			url: '/umbraco/delivery/api/v2/content',
			headers: {
				'Accept-Language': acceptLanguage, 'Api-Key': apiKey, Preview: preview, 'Start-Item': startItem
			},
			query: {
				fetch, filter, sort, skip, take, expand, fields
			},
			errors: {
				400: `Bad Request`,
				404: `Not Found`,
			},
		});
	}

	/**
	 * @deprecated
	 * @returns IApiContentResponseModel Success
	 * @throws ApiError
	 */
	public static getContentItem(data: ContentData['payloads']['GetContentItem'] = {}): CancelablePromise<ContentData['responses']['GetContentItem']> {
		const {
                    
                    id,
expand,
acceptLanguage,
apiKey,
preview,
startItem
                } = data;
		return __request(OpenAPI, {
			method: 'GET',
			url: '/umbraco/delivery/api/v1/content/item',
			headers: {
				'Accept-Language': acceptLanguage, 'Api-Key': apiKey, Preview: preview, 'Start-Item': startItem
			},
			query: {
				id, expand
			},
			errors: {
				401: `Unauthorized`,
				403: `Forbidden`,
			},
		});
	}

	/**
	 * @deprecated
	 * @returns IApiContentResponseModel Success
	 * @throws ApiError
	 */
	public static getContentItemByPath(data: ContentData['payloads']['GetContentItemByPath']): CancelablePromise<ContentData['responses']['GetContentItemByPath']> {
		const {
                    
                    path,
expand,
acceptLanguage,
apiKey,
preview,
startItem
                } = data;
		return __request(OpenAPI, {
			method: 'GET',
			url: '/umbraco/delivery/api/v1/content/item/{path}',
			path: {
				path
			},
			headers: {
				'Accept-Language': acceptLanguage, 'Api-Key': apiKey, Preview: preview, 'Start-Item': startItem
			},
			query: {
				expand
			},
			errors: {
				401: `Unauthorized`,
				403: `Forbidden`,
				404: `Not Found`,
			},
		});
	}

	/**
	 * @returns IApiContentResponseModel Success
	 * @throws ApiError
	 */
	public static getContentItemByPath20(data: ContentData['payloads']['GetContentItemByPath20']): CancelablePromise<ContentData['responses']['GetContentItemByPath20']> {
		const {
                    
                    path,
expand,
fields,
acceptLanguage,
apiKey,
preview,
startItem
                } = data;
		return __request(OpenAPI, {
			method: 'GET',
			url: '/umbraco/delivery/api/v2/content/item/{path}',
			path: {
				path
			},
			headers: {
				'Accept-Language': acceptLanguage, 'Api-Key': apiKey, Preview: preview, 'Start-Item': startItem
			},
			query: {
				expand, fields
			},
			errors: {
				401: `Unauthorized`,
				403: `Forbidden`,
				404: `Not Found`,
			},
		});
	}

	/**
	 * @deprecated
	 * @returns IApiContentResponseModel Success
	 * @throws ApiError
	 */
	public static getContentItemById(data: ContentData['payloads']['GetContentItemById']): CancelablePromise<ContentData['responses']['GetContentItemById']> {
		const {
                    
                    id,
expand,
acceptLanguage,
apiKey,
preview,
startItem
                } = data;
		return __request(OpenAPI, {
			method: 'GET',
			url: '/umbraco/delivery/api/v1/content/item/{id}',
			path: {
				id
			},
			headers: {
				'Accept-Language': acceptLanguage, 'Api-Key': apiKey, Preview: preview, 'Start-Item': startItem
			},
			query: {
				expand
			},
			errors: {
				401: `Unauthorized`,
				403: `Forbidden`,
				404: `Not Found`,
			},
		});
	}

	/**
	 * @returns IApiContentResponseModel Success
	 * @throws ApiError
	 */
	public static getContentItemById20(data: ContentData['payloads']['GetContentItemById20']): CancelablePromise<ContentData['responses']['GetContentItemById20']> {
		const {
                    
                    id,
expand,
fields,
acceptLanguage,
apiKey,
preview,
startItem
                } = data;
		return __request(OpenAPI, {
			method: 'GET',
			url: '/umbraco/delivery/api/v2/content/item/{id}',
			path: {
				id
			},
			headers: {
				'Accept-Language': acceptLanguage, 'Api-Key': apiKey, Preview: preview, 'Start-Item': startItem
			},
			query: {
				expand, fields
			},
			errors: {
				401: `Unauthorized`,
				403: `Forbidden`,
				404: `Not Found`,
			},
		});
	}

	/**
	 * @returns IApiContentResponseModel Success
	 * @throws ApiError
	 */
	public static getContentItems20(data: ContentData['payloads']['GetContentItems20'] = {}): CancelablePromise<ContentData['responses']['GetContentItems20']> {
		const {
                    
                    id,
expand,
fields,
acceptLanguage,
apiKey,
preview,
startItem
                } = data;
		return __request(OpenAPI, {
			method: 'GET',
			url: '/umbraco/delivery/api/v2/content/items',
			headers: {
				'Accept-Language': acceptLanguage, 'Api-Key': apiKey, Preview: preview, 'Start-Item': startItem
			},
			query: {
				id, expand, fields
			},
			errors: {
				401: `Unauthorized`,
				403: `Forbidden`,
			},
		});
	}

}

export class MediaResource {

	/**
	 * @deprecated
	 * @returns PagedIApiMediaWithCropsResponseModel Success
	 * @throws ApiError
	 */
	public static getMedia(data: MediaData['payloads']['GetMedia'] = {}): CancelablePromise<MediaData['responses']['GetMedia']> {
		const {
                    
                    fetch,
filter,
sort,
skip,
take,
expand,
apiKey
                } = data;
		return __request(OpenAPI, {
			method: 'GET',
			url: '/umbraco/delivery/api/v1/media',
			headers: {
				'Api-Key': apiKey
			},
			query: {
				fetch, filter, sort, skip, take, expand
			},
			errors: {
				400: `Bad Request`,
			},
		});
	}

	/**
	 * @returns PagedIApiMediaWithCropsResponseModel Success
	 * @throws ApiError
	 */
	public static getMedia20(data: MediaData['payloads']['GetMedia20'] = {}): CancelablePromise<MediaData['responses']['GetMedia20']> {
		const {
                    
                    fetch,
filter,
sort,
skip,
take,
expand,
fields,
apiKey
                } = data;
		return __request(OpenAPI, {
			method: 'GET',
			url: '/umbraco/delivery/api/v2/media',
			headers: {
				'Api-Key': apiKey
			},
			query: {
				fetch, filter, sort, skip, take, expand, fields
			},
			errors: {
				400: `Bad Request`,
			},
		});
	}

	/**
	 * @deprecated
	 * @returns IApiMediaWithCropsResponseModel Success
	 * @throws ApiError
	 */
	public static getMediaItem(data: MediaData['payloads']['GetMediaItem'] = {}): CancelablePromise<MediaData['responses']['GetMediaItem']> {
		const {
                    
                    id,
expand,
apiKey
                } = data;
		return __request(OpenAPI, {
			method: 'GET',
			url: '/umbraco/delivery/api/v1/media/item',
			headers: {
				'Api-Key': apiKey
			},
			query: {
				id, expand
			},
		});
	}

	/**
	 * @deprecated
	 * @returns IApiMediaWithCropsResponseModel Success
	 * @throws ApiError
	 */
	public static getMediaItemByPath(data: MediaData['payloads']['GetMediaItemByPath']): CancelablePromise<MediaData['responses']['GetMediaItemByPath']> {
		const {
                    
                    path,
expand,
apiKey
                } = data;
		return __request(OpenAPI, {
			method: 'GET',
			url: '/umbraco/delivery/api/v1/media/item/{path}',
			path: {
				path
			},
			headers: {
				'Api-Key': apiKey
			},
			query: {
				expand
			},
			errors: {
				404: `Not Found`,
			},
		});
	}

	/**
	 * @returns IApiMediaWithCropsResponseModel Success
	 * @throws ApiError
	 */
	public static getMediaItemByPath20(data: MediaData['payloads']['GetMediaItemByPath20']): CancelablePromise<MediaData['responses']['GetMediaItemByPath20']> {
		const {
                    
                    path,
expand,
fields,
apiKey
                } = data;
		return __request(OpenAPI, {
			method: 'GET',
			url: '/umbraco/delivery/api/v2/media/item/{path}',
			path: {
				path
			},
			headers: {
				'Api-Key': apiKey
			},
			query: {
				expand, fields
			},
			errors: {
				404: `Not Found`,
			},
		});
	}

	/**
	 * @deprecated
	 * @returns IApiMediaWithCropsResponseModel Success
	 * @throws ApiError
	 */
	public static getMediaItemById(data: MediaData['payloads']['GetMediaItemById']): CancelablePromise<MediaData['responses']['GetMediaItemById']> {
		const {
                    
                    id,
expand,
apiKey
                } = data;
		return __request(OpenAPI, {
			method: 'GET',
			url: '/umbraco/delivery/api/v1/media/item/{id}',
			path: {
				id
			},
			headers: {
				'Api-Key': apiKey
			},
			query: {
				expand
			},
			errors: {
				404: `Not Found`,
			},
		});
	}

	/**
	 * @returns IApiMediaWithCropsResponseModel Success
	 * @throws ApiError
	 */
	public static getMediaItemById20(data: MediaData['payloads']['GetMediaItemById20']): CancelablePromise<MediaData['responses']['GetMediaItemById20']> {
		const {
                    
                    id,
expand,
fields,
apiKey
                } = data;
		return __request(OpenAPI, {
			method: 'GET',
			url: '/umbraco/delivery/api/v2/media/item/{id}',
			path: {
				id
			},
			headers: {
				'Api-Key': apiKey
			},
			query: {
				expand, fields
			},
			errors: {
				404: `Not Found`,
			},
		});
	}

	/**
	 * @returns IApiMediaWithCropsResponseModel Success
	 * @throws ApiError
	 */
	public static getMediaItems20(data: MediaData['payloads']['GetMediaItems20'] = {}): CancelablePromise<MediaData['responses']['GetMediaItems20']> {
		const {
                    
                    id,
expand,
fields,
apiKey
                } = data;
		return __request(OpenAPI, {
			method: 'GET',
			url: '/umbraco/delivery/api/v2/media/items',
			headers: {
				'Api-Key': apiKey
			},
			query: {
				id, expand, fields
			},
		});
	}

}