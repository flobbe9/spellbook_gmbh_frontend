import { CONTENT_TYPE_APPLICATION_JSON, CONTENT_TYPE_TEXT_PLAIN } from '@/helpers/constants';

/**
 * @since latest
 */
export interface FetchArgs {
    url: string,
    /** Default is 'get' */
    method?: string,
    body?: any,
    headers?: HeadersInit
}

/**
 * @since latest
 */
export interface FetchConfig extends FetchArgs {
    expectedReturnType?: typeof CONTENT_TYPE_APPLICATION_JSON | typeof CONTENT_TYPE_TEXT_PLAIN | "boolean";
}