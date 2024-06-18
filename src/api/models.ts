

export type ApiBlockGridAreaModel = {
        alias?: string
rowSpan?: number
columnSpan?: number
items?: Array<ApiBlockGridItemModel>
    };

export type ApiBlockGridItemModel = (ApiBlockItemModel & {
        rowSpan?: number
columnSpan?: number
areaGridColumns?: number
areas?: Array<ApiBlockGridAreaModel>
    });

export type ApiBlockGridModel = {
        gridColumns?: number
items?: Array<ApiBlockGridItemModel>
    };

export type ApiBlockItemModel = {
        content?: IApiElementModel
settings?: IApiElementModel
    };

export type ApiBlockListModel = {
        items?: Array<ApiBlockItemModel | ApiBlockGridItemModel>
    };

export type BlogPostContentModel = (IApiContentModelBase & {
        properties?: BlogPostPropertiesModel
    });

export type BlogPostContentResponseModel = (IApiContentResponseModelBase & BlogPostContentModel);

export type BlogPostPropertiesModel = (PageContentPropertiesModel & PageSettingsPropertiesModel & {
        publishedDate?: string | null
    });

export type BlogsPageContentModel = (IApiContentModelBase & {
        properties?: BlogsPagePropertiesModel
    });

export type BlogsPageContentResponseModel = (IApiContentResponseModelBase & BlogsPageContentModel);

export type BlogsPagePropertiesModel = (PageContentPropertiesModel & PageSettingsPropertiesModel);

export type CVentryElementModel = (IApiElementModelBase & {
        properties?: CVentryPropertiesModel
    });

export type CVentryPropertiesModel = {
        employerName?: string | null
startDate?: string | null
endDate?: string | null
jobDescription?: string | null
    };

export type ContentPageContentModel = (IApiContentModelBase & {
        properties?: ContentPagePropertiesModel
    });

export type ContentPageContentResponseModel = (IApiContentResponseModelBase & ContentPageContentModel);

export type ContentPagePropertiesModel = (PageSettingsPropertiesModel & PageContentPropertiesModel);

export type EmploymentHistoryElementModel = (IApiElementModelBase & {
        properties?: EmploymentHistoryPropertiesModel
    });

export type EmploymentHistoryPropertiesModel = {
        history?: ApiBlockListModel
    };

export type EventInfoElementModel = (IApiElementModelBase & {
        properties?: EventInfoPropertiesModel
    });

export type EventInfoPropertiesModel = {
        eventName?: string | null
eventDate?: string | null
eventUrl?: string | null
    };

export type HomePageContentModel = (IApiContentModelBase & {
        properties?: HomePagePropertiesModel
    });

export type HomePageContentResponseModel = (IApiContentResponseModelBase & HomePageContentModel);

export type HomePagePropertiesModel = (PageContentPropertiesModel & PageSettingsPropertiesModel);

export type HttpValidationProblemDetails = (ProblemDetails & {
        errors?: Record<string, Array<string>>
    });

export type IApiContentModel = ContentPageContentModel | HomePageContentModel | SpeakingPageContentModel | BlogPostContentModel | SpeakingPostContentModel | BlogsPageContentModel;

export type IApiContentModelBase = (IApiElementModelBase & {
        readonly name?: string | null
readonly createDate?: string
readonly updateDate?: string
route?: IApiContentRouteModel
readonly id?: string
readonly contentType?: string
readonly properties?: Record<string, unknown>
    });

export type IApiContentResponseModel = ContentPageContentResponseModel | HomePageContentResponseModel | SpeakingPageContentResponseModel | BlogPostContentResponseModel | SpeakingPostContentResponseModel | BlogsPageContentResponseModel;

export type IApiContentResponseModelBase = (IApiContentModelBase & {
        readonly cultures?: Record<string, IApiContentRouteModel>
readonly name?: string | null
readonly createDate?: string
readonly updateDate?: string
route?: IApiContentRouteModel
readonly id?: string
readonly contentType?: string
readonly properties?: Record<string, unknown>
    });

export type IApiContentRouteModel = {
        readonly path?: string
startItem?: IApiContentStartItemModel
    };

export type IApiContentStartItemModel = {
        readonly id?: string
readonly path?: string
    };

export type IApiElementModel = PageSettingsElementModel | PageContentElementModel | UpdateAlertElementModel | CVentryElementModel | EventInfoElementModel | ImageWithCaptionElementModel | RichTextElementModel | EmploymentHistoryElementModel;

export type IApiElementModelBase = {
        readonly id?: string
readonly contentType?: string
readonly properties?: Record<string, unknown>
    };

export type IApiMediaWithCropsModel = {
        focalPoint?: ImageFocalPointModel
readonly crops?: Array<ImageCropModel> | null
readonly id?: string
readonly name?: string
readonly mediaType?: string
readonly url?: string
readonly extension?: string | null
readonly width?: number | null
readonly height?: number | null
readonly bytes?: number | null
readonly properties?: Record<string, unknown>
    };

export type IApiMediaWithCropsResponseModel = {
        readonly path?: string
readonly createDate?: string
readonly updateDate?: string
focalPoint?: ImageFocalPointModel
readonly crops?: Array<ImageCropModel> | null
readonly id?: string
readonly name?: string
readonly mediaType?: string
readonly url?: string
readonly extension?: string | null
readonly width?: number | null
readonly height?: number | null
readonly bytes?: number | null
readonly properties?: Record<string, unknown>
    };

export type ImageCropCoordinatesModel = {
        x1?: number
y1?: number
x2?: number
y2?: number
    };

export type ImageCropModel = {
        alias?: string | null
width?: number
height?: number
coordinates?: ImageCropCoordinatesModel
    };

export type ImageFocalPointModel = {
        left?: number
top?: number
    };

export type ImageWithCaptionElementModel = (IApiElementModelBase & {
        properties?: ImageWithCaptionPropertiesModel
    });

export type ImageWithCaptionPropertiesModel = {
        image?: Array<IApiMediaWithCropsModel> | null
caption?: string | null
    };

export type PageContentElementModel = (IApiElementModelBase & {
        properties?: PageContentPropertiesModel
    });

export type PageContentPropertiesModel = {
        featuredImage?: Array<IApiMediaWithCropsModel> | null
title?: string | null
content?: string | null
grid?: ApiBlockGridModel
    };

export type PageSettingsElementModel = (IApiElementModelBase & {
        properties?: PageSettingsPropertiesModel
    });

export type PageSettingsPropertiesModel = {
        umbracoUrlName?: string | null
umbracoUrlAlias?: string | null
    };

export type PagedIApiContentResponseModel = {
        total: number
items: Array<IApiContentResponseModel>
    };

export type PagedIApiMediaWithCropsResponseModel = {
        total: number
items: Array<IApiMediaWithCropsResponseModel>
    };

export type ProblemDetails = {
        type?: string | null
title?: string | null
status?: number | null
detail?: string | null
instance?: string | null
[key: string]: unknown | undefined
    };

export type RichTextElementModel = (IApiElementModelBase & {
        properties?: RichTextPropertiesModel
    });

export type RichTextPropertiesModel = {
        content?: string | null
    };

export type SpeakingPageContentModel = (IApiContentModelBase & {
        properties?: SpeakingPagePropertiesModel
    });

export type SpeakingPageContentResponseModel = (IApiContentResponseModelBase & SpeakingPageContentModel);

export type SpeakingPagePropertiesModel = (PageSettingsPropertiesModel & PageContentPropertiesModel);

export type SpeakingPostContentModel = (IApiContentModelBase & {
        properties?: SpeakingPostPropertiesModel
    });

export type SpeakingPostContentResponseModel = (IApiContentResponseModelBase & SpeakingPostContentModel);

export type SpeakingPostPropertiesModel = (PageSettingsPropertiesModel & PageContentPropertiesModel & EventInfoPropertiesModel & {
        additionalEvents?: ApiBlockListModel
    });

export type UpdateAlertElementModel = (IApiElementModelBase & {
        properties?: UpdateAlertPropertiesModel
    });

export type UpdateAlertPropertiesModel = {
        date?: string | null
content?: string | null
    };

export type ContentData = {
        
        payloads: {
            GetContent: {
                        /**
 * Defines the language to return. Use this when querying language variant content items.
 */
acceptLanguage?: string
/**
 * API key specified through configuration to authorize access to the API.
 */
apiKey?: string
/**
 * Defines the properties that should be expanded in the response. Refer to [the documentation](https://docs.umbraco.com/umbraco-cms/reference/content-delivery-api#query-parameters) for more details on this.
 */
expand?: string
/**
 * Specifies the content items to fetch. Refer to [the documentation](https://docs.umbraco.com/umbraco-cms/reference/content-delivery-api#query-parameters) for more details on this.
 */
fetch?: string
/**
 * Defines how to filter the fetched content items. Refer to [the documentation](https://docs.umbraco.com/umbraco-cms/reference/content-delivery-api#query-parameters) for more details on this.
 */
filter?: Array<string>
/**
 * Whether to request draft content.
 */
preview?: boolean
/**
 * Specifies the number of found content items to skip. Use this to control pagination of the response.
 */
skip?: number
/**
 * Defines how to sort the found content items. Refer to [the documentation](https://docs.umbraco.com/umbraco-cms/reference/content-delivery-api#query-parameters) for more details on this.
 */
sort?: Array<string>
/**
 * URL segment or GUID of a root content item.
 */
startItem?: string
/**
 * Specifies the number of found content items to take. Use this to control pagination of the response.
 */
take?: number
                        
                    };
GetContent20: {
                        /**
 * Defines the language to return. Use this when querying language variant content items.
 */
acceptLanguage?: string
/**
 * API key specified through configuration to authorize access to the API.
 */
apiKey?: string
/**
 * Defines the properties that should be expanded in the response. Refer to [the documentation](https://docs.umbraco.com/umbraco-cms/reference/content-delivery-api#query-parameters) for more details on this.
 */
expand?: string
/**
 * Specifies the content items to fetch. Refer to [the documentation](https://docs.umbraco.com/umbraco-cms/reference/content-delivery-api#query-parameters) for more details on this.
 */
fetch?: string
/**
 * Explicitly defines which properties should be included in the response (by default all properties are included). Refer to [the documentation](https://docs.umbraco.com/umbraco-cms/reference/content-delivery-api#query-parameters) for more details on this.
 */
fields?: string
/**
 * Defines how to filter the fetched content items. Refer to [the documentation](https://docs.umbraco.com/umbraco-cms/reference/content-delivery-api#query-parameters) for more details on this.
 */
filter?: Array<string>
/**
 * Whether to request draft content.
 */
preview?: boolean
/**
 * Specifies the number of found content items to skip. Use this to control pagination of the response.
 */
skip?: number
/**
 * Defines how to sort the found content items. Refer to [the documentation](https://docs.umbraco.com/umbraco-cms/reference/content-delivery-api#query-parameters) for more details on this.
 */
sort?: Array<string>
/**
 * URL segment or GUID of a root content item.
 */
startItem?: string
/**
 * Specifies the number of found content items to take. Use this to control pagination of the response.
 */
take?: number
                        
                    };
GetContentItem: {
                        /**
 * Defines the language to return. Use this when querying language variant content items.
 */
acceptLanguage?: string
/**
 * API key specified through configuration to authorize access to the API.
 */
apiKey?: string
/**
 * Defines the properties that should be expanded in the response. Refer to [the documentation](https://docs.umbraco.com/umbraco-cms/reference/content-delivery-api#query-parameters) for more details on this.
 */
expand?: string
id?: Array<string>
/**
 * Whether to request draft content.
 */
preview?: boolean
/**
 * URL segment or GUID of a root content item.
 */
startItem?: string
                        
                    };
GetContentItemByPath: {
                        /**
 * Defines the language to return. Use this when querying language variant content items.
 */
acceptLanguage?: string
/**
 * API key specified through configuration to authorize access to the API.
 */
apiKey?: string
/**
 * Defines the properties that should be expanded in the response. Refer to [the documentation](https://docs.umbraco.com/umbraco-cms/reference/content-delivery-api#query-parameters) for more details on this.
 */
expand?: string
path: string
/**
 * Whether to request draft content.
 */
preview?: boolean
/**
 * URL segment or GUID of a root content item.
 */
startItem?: string
                        
                    };
GetContentItemByPath20: {
                        /**
 * Defines the language to return. Use this when querying language variant content items.
 */
acceptLanguage?: string
/**
 * API key specified through configuration to authorize access to the API.
 */
apiKey?: string
/**
 * Defines the properties that should be expanded in the response. Refer to [the documentation](https://docs.umbraco.com/umbraco-cms/reference/content-delivery-api#query-parameters) for more details on this.
 */
expand?: string
/**
 * Explicitly defines which properties should be included in the response (by default all properties are included). Refer to [the documentation](https://docs.umbraco.com/umbraco-cms/reference/content-delivery-api#query-parameters) for more details on this.
 */
fields?: string
path: string
/**
 * Whether to request draft content.
 */
preview?: boolean
/**
 * URL segment or GUID of a root content item.
 */
startItem?: string
                        
                    };
GetContentItemById: {
                        /**
 * Defines the language to return. Use this when querying language variant content items.
 */
acceptLanguage?: string
/**
 * API key specified through configuration to authorize access to the API.
 */
apiKey?: string
/**
 * Defines the properties that should be expanded in the response. Refer to [the documentation](https://docs.umbraco.com/umbraco-cms/reference/content-delivery-api#query-parameters) for more details on this.
 */
expand?: string
id: string
/**
 * Whether to request draft content.
 */
preview?: boolean
/**
 * URL segment or GUID of a root content item.
 */
startItem?: string
                        
                    };
GetContentItemById20: {
                        /**
 * Defines the language to return. Use this when querying language variant content items.
 */
acceptLanguage?: string
/**
 * API key specified through configuration to authorize access to the API.
 */
apiKey?: string
/**
 * Defines the properties that should be expanded in the response. Refer to [the documentation](https://docs.umbraco.com/umbraco-cms/reference/content-delivery-api#query-parameters) for more details on this.
 */
expand?: string
/**
 * Explicitly defines which properties should be included in the response (by default all properties are included). Refer to [the documentation](https://docs.umbraco.com/umbraco-cms/reference/content-delivery-api#query-parameters) for more details on this.
 */
fields?: string
id: string
/**
 * Whether to request draft content.
 */
preview?: boolean
/**
 * URL segment or GUID of a root content item.
 */
startItem?: string
                        
                    };
GetContentItems20: {
                        /**
 * Defines the language to return. Use this when querying language variant content items.
 */
acceptLanguage?: string
/**
 * API key specified through configuration to authorize access to the API.
 */
apiKey?: string
/**
 * Defines the properties that should be expanded in the response. Refer to [the documentation](https://docs.umbraco.com/umbraco-cms/reference/content-delivery-api#query-parameters) for more details on this.
 */
expand?: string
/**
 * Explicitly defines which properties should be included in the response (by default all properties are included). Refer to [the documentation](https://docs.umbraco.com/umbraco-cms/reference/content-delivery-api#query-parameters) for more details on this.
 */
fields?: string
id?: Array<string>
/**
 * Whether to request draft content.
 */
preview?: boolean
/**
 * URL segment or GUID of a root content item.
 */
startItem?: string
                        
                    };
        }
        
        
        responses: {
            GetContent: PagedIApiContentResponseModel
                ,GetContent20: PagedIApiContentResponseModel
                ,GetContentItem: Array<IApiContentResponseModel>
                ,GetContentItemByPath: IApiContentResponseModel
                ,GetContentItemByPath20: IApiContentResponseModel
                ,GetContentItemById: IApiContentResponseModel
                ,GetContentItemById20: IApiContentResponseModel
                ,GetContentItems20: Array<IApiContentResponseModel>
                
        }
        
    }

export type MediaData = {
        
        payloads: {
            GetMedia: {
                        /**
 * API key specified through configuration to authorize access to the API.
 */
apiKey?: string
/**
 * Defines the properties that should be expanded in the response. Refer to [the documentation](https://docs.umbraco.com/umbraco-cms/reference/content-delivery-api/media-delivery-api#query-parameters) for more details on this.
 */
expand?: string
/**
 * Specifies the media items to fetch. Refer to [the documentation](https://docs.umbraco.com/umbraco-cms/reference/content-delivery-api/media-delivery-api#query-parameters) for more details on this.
 */
fetch?: string
/**
 * Defines how to filter the fetched media items. Refer to [the documentation](https://docs.umbraco.com/umbraco-cms/reference/content-delivery-api/media-delivery-api#query-parameters) for more details on this.
 */
filter?: Array<string>
/**
 * Specifies the number of found media items to skip. Use this to control pagination of the response.
 */
skip?: number
/**
 * Defines how to sort the found media items. Refer to [the documentation](https://docs.umbraco.com/umbraco-cms/reference/content-delivery-api/media-delivery-api#query-parameters) for more details on this.
 */
sort?: Array<string>
/**
 * Specifies the number of found media items to take. Use this to control pagination of the response.
 */
take?: number
                        
                    };
GetMedia20: {
                        /**
 * API key specified through configuration to authorize access to the API.
 */
apiKey?: string
/**
 * Defines the properties that should be expanded in the response. Refer to [the documentation](https://docs.umbraco.com/umbraco-cms/reference/content-delivery-api/media-delivery-api#query-parameters) for more details on this.
 */
expand?: string
/**
 * Specifies the media items to fetch. Refer to [the documentation](https://docs.umbraco.com/umbraco-cms/reference/content-delivery-api/media-delivery-api#query-parameters) for more details on this.
 */
fetch?: string
/**
 * Explicitly defines which properties should be included in the response (by default all properties are included). Refer to [the documentation](https://docs.umbraco.com/umbraco-cms/reference/content-delivery-api/media-delivery-api#query-parameters) for more details on this.
 */
fields?: string
/**
 * Defines how to filter the fetched media items. Refer to [the documentation](https://docs.umbraco.com/umbraco-cms/reference/content-delivery-api/media-delivery-api#query-parameters) for more details on this.
 */
filter?: Array<string>
/**
 * Specifies the number of found media items to skip. Use this to control pagination of the response.
 */
skip?: number
/**
 * Defines how to sort the found media items. Refer to [the documentation](https://docs.umbraco.com/umbraco-cms/reference/content-delivery-api/media-delivery-api#query-parameters) for more details on this.
 */
sort?: Array<string>
/**
 * Specifies the number of found media items to take. Use this to control pagination of the response.
 */
take?: number
                        
                    };
GetMediaItem: {
                        /**
 * API key specified through configuration to authorize access to the API.
 */
apiKey?: string
/**
 * Defines the properties that should be expanded in the response. Refer to [the documentation](https://docs.umbraco.com/umbraco-cms/reference/content-delivery-api/media-delivery-api#query-parameters) for more details on this.
 */
expand?: string
id?: Array<string>
                        
                    };
GetMediaItemByPath: {
                        /**
 * API key specified through configuration to authorize access to the API.
 */
apiKey?: string
/**
 * Defines the properties that should be expanded in the response. Refer to [the documentation](https://docs.umbraco.com/umbraco-cms/reference/content-delivery-api/media-delivery-api#query-parameters) for more details on this.
 */
expand?: string
path: string
                        
                    };
GetMediaItemByPath20: {
                        /**
 * API key specified through configuration to authorize access to the API.
 */
apiKey?: string
/**
 * Defines the properties that should be expanded in the response. Refer to [the documentation](https://docs.umbraco.com/umbraco-cms/reference/content-delivery-api/media-delivery-api#query-parameters) for more details on this.
 */
expand?: string
/**
 * Explicitly defines which properties should be included in the response (by default all properties are included). Refer to [the documentation](https://docs.umbraco.com/umbraco-cms/reference/content-delivery-api/media-delivery-api#query-parameters) for more details on this.
 */
fields?: string
path: string
                        
                    };
GetMediaItemById: {
                        /**
 * API key specified through configuration to authorize access to the API.
 */
apiKey?: string
/**
 * Defines the properties that should be expanded in the response. Refer to [the documentation](https://docs.umbraco.com/umbraco-cms/reference/content-delivery-api/media-delivery-api#query-parameters) for more details on this.
 */
expand?: string
id: string
                        
                    };
GetMediaItemById20: {
                        /**
 * API key specified through configuration to authorize access to the API.
 */
apiKey?: string
/**
 * Defines the properties that should be expanded in the response. Refer to [the documentation](https://docs.umbraco.com/umbraco-cms/reference/content-delivery-api/media-delivery-api#query-parameters) for more details on this.
 */
expand?: string
/**
 * Explicitly defines which properties should be included in the response (by default all properties are included). Refer to [the documentation](https://docs.umbraco.com/umbraco-cms/reference/content-delivery-api/media-delivery-api#query-parameters) for more details on this.
 */
fields?: string
id: string
                        
                    };
GetMediaItems20: {
                        /**
 * API key specified through configuration to authorize access to the API.
 */
apiKey?: string
/**
 * Defines the properties that should be expanded in the response. Refer to [the documentation](https://docs.umbraco.com/umbraco-cms/reference/content-delivery-api/media-delivery-api#query-parameters) for more details on this.
 */
expand?: string
/**
 * Explicitly defines which properties should be included in the response (by default all properties are included). Refer to [the documentation](https://docs.umbraco.com/umbraco-cms/reference/content-delivery-api/media-delivery-api#query-parameters) for more details on this.
 */
fields?: string
id?: Array<string>
                        
                    };
        }
        
        
        responses: {
            GetMedia: PagedIApiMediaWithCropsResponseModel
                ,GetMedia20: PagedIApiMediaWithCropsResponseModel
                ,GetMediaItem: Array<IApiMediaWithCropsResponseModel>
                ,GetMediaItemByPath: IApiMediaWithCropsResponseModel
                ,GetMediaItemByPath20: IApiMediaWithCropsResponseModel
                ,GetMediaItemById: IApiMediaWithCropsResponseModel
                ,GetMediaItemById20: IApiMediaWithCropsResponseModel
                ,GetMediaItems20: Array<IApiMediaWithCropsResponseModel>
                
        }
        
    }