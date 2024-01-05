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
import type { ImageCropModel } from './ImageCropModel';
import {
    ImageCropModelFromJSON,
    ImageCropModelFromJSONTyped,
    ImageCropModelToJSON,
} from './ImageCropModel';
import type { ImageFocalPointModel } from './ImageFocalPointModel';
import {
    ImageFocalPointModelFromJSON,
    ImageFocalPointModelFromJSONTyped,
    ImageFocalPointModelToJSON,
} from './ImageFocalPointModel';

/**
 * 
 * @export
 * @interface IApiMediaWithCropsModel
 */
export interface IApiMediaWithCropsModel {
    /**
     * 
     * @type {ImageFocalPointModel}
     * @memberof IApiMediaWithCropsModel
     */
    focalPoint?: ImageFocalPointModel;
    /**
     * 
     * @type {Array<ImageCropModel>}
     * @memberof IApiMediaWithCropsModel
     */
    readonly crops?: Array<ImageCropModel> | null;
    /**
     * 
     * @type {string}
     * @memberof IApiMediaWithCropsModel
     */
    readonly id?: string;
    /**
     * 
     * @type {string}
     * @memberof IApiMediaWithCropsModel
     */
    readonly name?: string;
    /**
     * 
     * @type {string}
     * @memberof IApiMediaWithCropsModel
     */
    readonly mediaType?: string;
    /**
     * 
     * @type {string}
     * @memberof IApiMediaWithCropsModel
     */
    readonly url?: string;
    /**
     * 
     * @type {string}
     * @memberof IApiMediaWithCropsModel
     */
    readonly extension?: string | null;
    /**
     * 
     * @type {number}
     * @memberof IApiMediaWithCropsModel
     */
    readonly width?: number | null;
    /**
     * 
     * @type {number}
     * @memberof IApiMediaWithCropsModel
     */
    readonly height?: number | null;
    /**
     * 
     * @type {number}
     * @memberof IApiMediaWithCropsModel
     */
    readonly bytes?: number | null;
    /**
     * 
     * @type {{ [key: string]: any; }}
     * @memberof IApiMediaWithCropsModel
     */
    readonly properties?: { [key: string]: any; };
}

/**
 * Check if a given object implements the IApiMediaWithCropsModel interface.
 */
export function instanceOfIApiMediaWithCropsModel(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function IApiMediaWithCropsModelFromJSON(json: any): IApiMediaWithCropsModel {
    return IApiMediaWithCropsModelFromJSONTyped(json, false);
}

export function IApiMediaWithCropsModelFromJSONTyped(json: any, ignoreDiscriminator: boolean): IApiMediaWithCropsModel {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'focalPoint': !exists(json, 'focalPoint') ? undefined : ImageFocalPointModelFromJSON(json['focalPoint']),
        'crops': !exists(json, 'crops') ? undefined : (json['crops'] === null ? null : (json['crops'] as Array<any>).map(ImageCropModelFromJSON)),
        'id': !exists(json, 'id') ? undefined : json['id'],
        'name': !exists(json, 'name') ? undefined : json['name'],
        'mediaType': !exists(json, 'mediaType') ? undefined : json['mediaType'],
        'url': !exists(json, 'url') ? undefined : json['url'],
        'extension': !exists(json, 'extension') ? undefined : json['extension'],
        'width': !exists(json, 'width') ? undefined : json['width'],
        'height': !exists(json, 'height') ? undefined : json['height'],
        'bytes': !exists(json, 'bytes') ? undefined : json['bytes'],
        'properties': !exists(json, 'properties') ? undefined : json['properties'],
    };
}

export function IApiMediaWithCropsModelToJSON(value?: IApiMediaWithCropsModel | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'focalPoint': ImageFocalPointModelToJSON(value.focalPoint),
    };
}
