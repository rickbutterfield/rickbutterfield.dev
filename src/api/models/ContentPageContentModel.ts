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
import type { ContentPagePropertiesModel } from './ContentPagePropertiesModel';
import {
    ContentPagePropertiesModelFromJSON,
    ContentPagePropertiesModelFromJSONTyped,
    ContentPagePropertiesModelToJSON,
} from './ContentPagePropertiesModel';
import type { IApiContentModelBase } from './IApiContentModelBase';
import {
    IApiContentModelBaseFromJSON,
    IApiContentModelBaseFromJSONTyped,
    IApiContentModelBaseToJSON,
} from './IApiContentModelBase';

/**
 * 
 * @export
 * @interface ContentPageContentModel
 */
export interface ContentPageContentModel extends IApiContentModelBase {
    /**
     * 
     * @type {ContentPagePropertiesModel}
     * @memberof ContentPageContentModel
     */
    properties?: ContentPagePropertiesModel;
}

/**
 * Check if a given object implements the ContentPageContentModel interface.
 */
export function instanceOfContentPageContentModel(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function ContentPageContentModelFromJSON(json: any): ContentPageContentModel {
    return ContentPageContentModelFromJSONTyped(json, false);
}

export function ContentPageContentModelFromJSONTyped(json: any, ignoreDiscriminator: boolean): ContentPageContentModel {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        ...IApiContentModelBaseFromJSONTyped(json, ignoreDiscriminator),
        'properties': !exists(json, 'properties') ? undefined : ContentPagePropertiesModelFromJSON(json['properties']),
    };
}

export function ContentPageContentModelToJSON(value?: ContentPageContentModel | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        ...IApiContentModelBaseToJSON(value),
        'properties': ContentPagePropertiesModelToJSON(value.properties),
    };
}

