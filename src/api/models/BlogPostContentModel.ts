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
import type { BlogPostPropertiesModel } from './BlogPostPropertiesModel';
import {
    BlogPostPropertiesModelFromJSON,
    BlogPostPropertiesModelFromJSONTyped,
    BlogPostPropertiesModelToJSON,
} from './BlogPostPropertiesModel';
import type { IApiContentModelBase } from './IApiContentModelBase';
import {
    IApiContentModelBaseFromJSON,
    IApiContentModelBaseFromJSONTyped,
    IApiContentModelBaseToJSON,
} from './IApiContentModelBase';

/**
 * 
 * @export
 * @interface BlogPostContentModel
 */
export interface BlogPostContentModel extends IApiContentModelBase {
    /**
     * 
     * @type {BlogPostPropertiesModel}
     * @memberof BlogPostContentModel
     */
    properties?: BlogPostPropertiesModel;
}

/**
 * Check if a given object implements the BlogPostContentModel interface.
 */
export function instanceOfBlogPostContentModel(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function BlogPostContentModelFromJSON(json: any): BlogPostContentModel {
    return BlogPostContentModelFromJSONTyped(json, false);
}

export function BlogPostContentModelFromJSONTyped(json: any, ignoreDiscriminator: boolean): BlogPostContentModel {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        ...IApiContentModelBaseFromJSONTyped(json, ignoreDiscriminator),
        'properties': !exists(json, 'properties') ? undefined : BlogPostPropertiesModelFromJSON(json['properties']),
    };
}

export function BlogPostContentModelToJSON(value?: BlogPostContentModel | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        ...IApiContentModelBaseToJSON(value),
        'properties': BlogPostPropertiesModelToJSON(value.properties),
    };
}

