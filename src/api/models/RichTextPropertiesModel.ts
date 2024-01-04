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
/**
 * 
 * @export
 * @interface RichTextPropertiesModel
 */
export interface RichTextPropertiesModel {
    /**
     * 
     * @type {string}
     * @memberof RichTextPropertiesModel
     */
    content?: string | null;
}

/**
 * Check if a given object implements the RichTextPropertiesModel interface.
 */
export function instanceOfRichTextPropertiesModel(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function RichTextPropertiesModelFromJSON(json: any): RichTextPropertiesModel {
    return RichTextPropertiesModelFromJSONTyped(json, false);
}

export function RichTextPropertiesModelFromJSONTyped(json: any, ignoreDiscriminator: boolean): RichTextPropertiesModel {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'content': !exists(json, 'content') ? undefined : json['content'],
    };
}

export function RichTextPropertiesModelToJSON(value?: RichTextPropertiesModel | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'content': value.content,
    };
}

