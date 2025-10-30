import { CustomResponseFormat } from '@/abstracts/CustomResponseFormat';
import type { FetchArgs } from '@/abstracts/CustomFetchOptions';
import { QueryClient } from '@tanstack/react-query';
import { BASE_URL, CONTENT_TYPE_APPLICATION_JSON, CSRF_HEADER_NAME, CSRF_TOKEN_STORAGE_KEY, FAILED_TO_FETCH_STATUS_CODE } from '@/helpers/constants';
import { logApiResponse } from '@/helpers/logUtils';
import { assertFalsyOrBlankAndThrow, equalsIgnoreCaseTrim, isBlank, sleep } from '@/helpers/utils';

/**
 * Call `fetchAny` with given params, then parse to json.
 *
 * @param args see {@link FetchArgs}
 * @returns response as json
 */
export default async function fetchJson(args: FetchArgs): Promise<any | CustomResponseFormat> {
    const response = await fetchAny(args);

    // case: failed to fetch, already read stream to json
    if (isHttpResponseNotAlright(response)) 
        return response;

    return await (response as Response).json();
}

/**
 * Sends an http request using given url, method and body. Will only log fetch errors.<p>
 *
 * Fetch errors will be returned as {@link CustomResponseFormat}.<p>
 *
 * @param args see {@link FetchArgs} 
 * @returns a promise with the response or an {@link CustomResponseFormat} object in it
 */
export async function fetchAny(args: FetchArgs): Promise<Response | CustomResponseFormat> {
    const { url, headers, body, method = "get" } = args;
    
    // set headers
    const fetchConfig: RequestInit = {
        method: method,
        headers: getFetchHeaders(method, headers),
        credentials: 'include'
    };

    // set body
    if (body) 
        fetchConfig.body = headers["Content-Type"] !== CONTENT_TYPE_APPLICATION_JSON ? body : JSON.stringify(body);

    let response: Response | CustomResponseFormat;
    // fetch
    try {
        response = await fetch(url, fetchConfig);

        // case: response with error status
        if (!isHttpStatusCodeAlright(response.status))
            response = await response.json();

    // case: url not reachable, try again
    } catch (e) {
        await sleep(1000);

        try {
            response = await fetch(url, fetchConfig);

        // case: 503, url not reachable (failed to fetch)
        } catch (e2) {
            response = CustomResponseFormat.builder()
                .status(FAILED_TO_FETCH_STATUS_CODE)
                .message(e2.message)
                .path(url.replace(BASE_URL, ''))
                .build();
        }
    }

    if (isHttpResponseNotAlright(response))
        logApiResponse(response);

    return response;
}

/**
 * @param statusCode http status code to check
 * @returns true if status code is informational (1xx), successful (2xx) or redirectional (3xx), else false
 */
export function isHttpStatusCodeAlright(statusCode: number): boolean {
    const firstDigit = Math.floor(statusCode / 100);

    return firstDigit === 1 || firstDigit === 2 || firstDigit === 3;
}

/**
 * Indicates whether given response can be considered successful or not. See also {@link isHttpStatusCodeAlright}.
 *
 * @param response to check
 * @returns ```true``` if given ```response``` is falsy or does have a ```status``` field with a status code that is not alright
 */
export function isHttpResponseNotAlright(response: any): response is CustomResponseFormat {
    return !response || (response.status && !isHttpStatusCodeAlright(response.status));
}

/**
 * Add csrf token to request header if necessary.
 *
 * @param method http request method. Default is "get"
 * @param headers json object with strings as keys and values
 * @returns ```headers``` object with necessary props set
 */
function getFetchHeaders(method: string, headers?: Record<string, any>): HeadersInit {
    if (!headers) 
        headers = {};

    if (isAddCsrfToken(method))
        headers = {...headers, [CSRF_HEADER_NAME] : getCsrfTokenFromLocalStorage()}

    return headers;
}


/**
 * @returns the csrf token from localStorage or blank string if not found
 */
export function getCsrfTokenFromLocalStorage(): string {
    return localStorage.getItem(CSRF_TOKEN_STORAGE_KEY) || '';
}

/**
 * Set or replace csrf token in localStorage. Wont save if csrf token is blank..
 * 
 * @param csrfToken csrf token to save
 */
export function saveCsrfTokenToLocalStorage(csrfToken: string | null): void {
    if (isBlank(csrfToken))
        return;

    localStorage.setItem(CSRF_TOKEN_STORAGE_KEY, csrfToken || '');
}

/**
 * @param method http request method
 * @returns ```true``` if http method requires a csrf token to be sent along (for post, put and delete)
 */
function isAddCsrfToken(method: string): boolean {

    return equalsIgnoreCaseTrim("post", method) ||
        equalsIgnoreCaseTrim("put", method) ||
        equalsIgnoreCaseTrim("delete", method);
}

/**
 * Indicates that `useQuery` has retrieved something from cache. During render it would return 
 * `undefined` regardless of the cache's state. Only once the data is no longer `undefined` (but maybe `null` or anything else)
 * the data can be considered valid.
 *  
 * @param queryClient
 * @param queryKey
 * @returns `true` if cached data is no longer `undefined`
 */
export function hasCacheBeenInitialized(queryClient: QueryClient, queryKey: string[]): boolean {
    assertFalsyOrBlankAndThrow(queryClient, queryKey);
    return queryClient.getQueryData(queryKey) !== undefined;
}