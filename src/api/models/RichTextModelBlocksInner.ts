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

import type { ApiBlockGridItemModel } from './ApiBlockGridItemModel';
import {
    instanceOfApiBlockGridItemModel,
    ApiBlockGridItemModelFromJSON,
    ApiBlockGridItemModelFromJSONTyped,
    ApiBlockGridItemModelToJSON,
} from './ApiBlockGridItemModel';
import type { ApiBlockItemModel } from './ApiBlockItemModel';
import {
    instanceOfApiBlockItemModel,
    ApiBlockItemModelFromJSON,
    ApiBlockItemModelFromJSONTyped,
    ApiBlockItemModelToJSON,
} from './ApiBlockItemModel';

/**
 * @type RichTextModelBlocksInner
 * 
 * @export
 */
export type RichTextModelBlocksInner = ApiBlockGridItemModel | ApiBlockItemModel;

export function RichTextModelBlocksInnerFromJSON(json: any): RichTextModelBlocksInner {
    return RichTextModelBlocksInnerFromJSONTyped(json, false);
}

export function RichTextModelBlocksInnerFromJSONTyped(json: any, ignoreDiscriminator: boolean): RichTextModelBlocksInner {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return { ...ApiBlockGridItemModelFromJSONTyped(json, true), ...ApiBlockItemModelFromJSONTyped(json, true) };
}

export function RichTextModelBlocksInnerToJSON(value?: RichTextModelBlocksInner | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }

    if (instanceOfApiBlockGridItemModel(value)) {
        return ApiBlockGridItemModelToJSON(value as ApiBlockGridItemModel);
    }
    if (instanceOfApiBlockItemModel(value)) {
        return ApiBlockItemModelToJSON(value as ApiBlockItemModel);
    }

    return {};
}

