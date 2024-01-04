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
import type { ApiBlockGridModel } from './ApiBlockGridModel';
import {
    ApiBlockGridModelFromJSON,
    ApiBlockGridModelFromJSONTyped,
    ApiBlockGridModelToJSON,
} from './ApiBlockGridModel';
import type { IApiMediaWithCropsModel } from './IApiMediaWithCropsModel';
import {
    IApiMediaWithCropsModelFromJSON,
    IApiMediaWithCropsModelFromJSONTyped,
    IApiMediaWithCropsModelToJSON,
} from './IApiMediaWithCropsModel';

/**
 * 
 * @export
 * @interface ContentPagePropertiesModel
 */
export interface ContentPagePropertiesModel {
    /**
     * 
     * @type {Array<IApiMediaWithCropsModel>}
     * @memberof ContentPagePropertiesModel
     */
    featuredImage?: Array<IApiMediaWithCropsModel> | null;
    /**
     * 
     * @type {string}
     * @memberof ContentPagePropertiesModel
     */
    title?: string | null;
    /**
     * 
     * @type {string}
     * @memberof ContentPagePropertiesModel
     */
    content?: string | null;
    /**
     * 
     * @type {ApiBlockGridModel}
     * @memberof ContentPagePropertiesModel
     */
    grid?: ApiBlockGridModel;
    /**
     * 
     * @type {string}
     * @memberof ContentPagePropertiesModel
     */
    umbracoUrlName?: string | null;
    /**
     * 
     * @type {string}
     * @memberof ContentPagePropertiesModel
     */
    umbracoUrlAlias?: string | null;
}

/**
 * Check if a given object implements the ContentPagePropertiesModel interface.
 */
export function instanceOfContentPagePropertiesModel(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function ContentPagePropertiesModelFromJSON(json: any): ContentPagePropertiesModel {
    return ContentPagePropertiesModelFromJSONTyped(json, false);
}

export function ContentPagePropertiesModelFromJSONTyped(json: any, ignoreDiscriminator: boolean): ContentPagePropertiesModel {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'featuredImage': !exists(json, 'featuredImage') ? undefined : (json['featuredImage'] === null ? null : (json['featuredImage'] as Array<any>).map(IApiMediaWithCropsModelFromJSON)),
        'title': !exists(json, 'title') ? undefined : json['title'],
        'content': !exists(json, 'content') ? undefined : json['content'],
        'grid': !exists(json, 'grid') ? undefined : ApiBlockGridModelFromJSON(json['grid']),
        'umbracoUrlName': !exists(json, 'umbracoUrlName') ? undefined : json['umbracoUrlName'],
        'umbracoUrlAlias': !exists(json, 'umbracoUrlAlias') ? undefined : json['umbracoUrlAlias'],
    };
}

export function ContentPagePropertiesModelToJSON(value?: ContentPagePropertiesModel | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'featuredImage': value.featuredImage === undefined ? undefined : (value.featuredImage === null ? null : (value.featuredImage as Array<any>).map(IApiMediaWithCropsModelToJSON)),
        'title': value.title,
        'content': value.content,
        'grid': ApiBlockGridModelToJSON(value.grid),
        'umbracoUrlName': value.umbracoUrlName,
        'umbracoUrlAlias': value.umbracoUrlAlias,
    };
}

