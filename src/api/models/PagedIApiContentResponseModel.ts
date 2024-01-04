/* tslint:disable */
/* eslint-disable */
/**
 * Umbraco Delivery API
 * You can find out more about the Umbraco Delivery API in [the documentation](https://docs.umbraco.com/umbraco-cms/reference/content-delivery-api).
 *
 * The version of the OpenAPI document: Latest
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from '../runtime';
import type { IApiContentResponseModel } from './IApiContentResponseModel';
import {
    IApiContentResponseModelFromJSON,
    IApiContentResponseModelFromJSONTyped,
    IApiContentResponseModelToJSON,
} from './IApiContentResponseModel';

/**
 * 
 * @export
 * @interface PagedIApiContentResponseModel
 */
export interface PagedIApiContentResponseModel {
    /**
     * 
     * @type {number}
     * @memberof PagedIApiContentResponseModel
     */
    total: number;
    /**
     * 
     * @type {Array<IApiContentResponseModel>}
     * @memberof PagedIApiContentResponseModel
     */
    items: Array<IApiContentResponseModel>;
}

/**
 * Check if a given object implements the PagedIApiContentResponseModel interface.
 */
export function instanceOfPagedIApiContentResponseModel(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "total" in value;
    isInstance = isInstance && "items" in value;

    return isInstance;
}

export function PagedIApiContentResponseModelFromJSON(json: any): PagedIApiContentResponseModel {
    return PagedIApiContentResponseModelFromJSONTyped(json, false);
}

export function PagedIApiContentResponseModelFromJSONTyped(json: any, ignoreDiscriminator: boolean): PagedIApiContentResponseModel {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'total': json['total'],
        'items': ((json['items'] as Array<any>).map(IApiContentResponseModelFromJSON)),
    };
}

export function PagedIApiContentResponseModelToJSON(value?: PagedIApiContentResponseModel | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'total': value.total,
        'items': ((value.items as Array<any>).map(IApiContentResponseModelToJSON)),
    };
}

