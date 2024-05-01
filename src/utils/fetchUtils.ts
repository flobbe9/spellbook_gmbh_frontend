import { equalsIgnoreCaseTrim, isBlank, log, logApiResponse, logError, logWarn } from "./genericUtils";
import { ApiExceptionFormat } from './../abstract/ApiExceptionFormat';
import { WORDPRESS_BASE_URL } from "./constants";


/** Http status code "Service Unavailable" 503, use this status when ```fetch()``` throws "failed to fetch" error */
export const FAILED_TO_FETCH_STATUS_CODE = 503;


/**
 * Call ```fetchAny``` with given params.
 * 
 * @param url to send the request to
 * @param method http request method, default is "get"
 * @param body (optional) to add to the request
 * @param headers json object with strings as keys and values
 * @param fetchCsrfToken if true, a new csrf token is fetched before sending the actual request. Default is false
 * @returns response as json
 */
export default async function fetchJson(url: string, method = "get", body?: any, headers?, fetchCsrfToken = false): Promise<Response | ApiExceptionFormat> {

    const response = await fetchAny(url, method, body, headers, fetchCsrfToken, false);

    // case: failed to fetch, already read stream to json
    if (response.status === FAILED_TO_FETCH_STATUS_CODE)
        return response;

    const jsonResponse = await (response as Response).json();

    if (!isHttpStatusCodeAlright(jsonResponse.status))
        logApiResponse(jsonResponse);

    return jsonResponse;
}


/**
 * Sends an http request using given url, method and body. Will only log fetch errors.<p>
 * 
 * Fetch errors will be returned as {@link ApiExceptionFormat}.<p>
 * 
 * In case of a 403 response, the request might be sent a second time with a new csrf token. This happens only if
 * fetching the csrf token can be done without authentication and ```fetchCsrfToken``` is false (to prevent a loop).
 *  
 * @param url to send the request to
 * @param method http request method, default is "get"
 * @param body (optional) to add to the request
 * @param headers json object with strings as keys and values
 * @param fetchCsrfToken if true, a new csrf token is fetched before sending the actual request. Default is false
 * @param debug if true, a response with a bad status code will be read to ```.json()``` and logged. Default is true
 * @returns a promise with the response or an {@link ApiExceptionFormat} object in it
 */
export async function fetchAny(url: string, method = "get", body?: any, headers?, fetchCsrfToken = false, debug = true): Promise<Response | ApiExceptionFormat> {
    
    // set headers
    const fetchConfig: RequestInit = {
        method: method,
        headers: await getFetchHeaders(url, headers, fetchCsrfToken, method),
        credentials: "include"
    }

    // case: request has body
    if (body) 
        fetchConfig.body = JSON.stringify(body);

    // send request
    try {
        const response = await fetch(url, fetchConfig);

        // case: request failed
        if (!isHttpStatusCodeAlright(response.status)) {
            if (debug)
                logApiResponse(await response.json());

            // try with fresh csrf token
            if (response.status === 403 && !fetchCsrfToken && isCsrfTokenFree(url))
                return await fetchAny(url, method, body, headers, true, debug);
        }
        
        return response;

    // case: failed to fetch
    } catch(e) {
        return handleFetchError(e, url);
    }
}


/**
 * Fetch content from givn url and call ```URL.createObjectURL(response.blob())``` on it.
 * 
 * @param url to send the request to
 * @param method http request method, default is "get"
 * @param body (optional) to add to the request
 * @param headers json object with strings as keys and values
 * @returns a Promise with a url object containing the blob, that can be downloaded with an ```<a></a>``` tag. If error, return
 *          {@link ApiExceptionFormat} object
 */
export async function fetchAnyReturnBlobUrl(url: string, method = "get", body?: object, headers?: any): Promise<string | ApiExceptionFormat> {

    const response = await fetchAny(url, method, body, headers);

    // case: request failed
    if (!isHttpStatusCodeAlright(response.status))
        return response as ApiExceptionFormat;

    const blob = await (response as Response).blob();

    // case: falsy blob
    if (!blob) {
        const error: ApiExceptionFormat = {
            status: 406, // not acceptable
            error: null,
            message: "Failed to get blob from response.",
            path: url.replace(WORDPRESS_BASE_URL, "")
        }

        logApiResponse(error);

        return error;
    }

    return URL.createObjectURL(blob);
}


/**
 * @param statusCode http status code to check
 * @returns true if status code is informational (1xx), successful (2xx) or redirectional (3xx), else false
 */
export function isHttpStatusCodeAlright(statusCode: number): boolean {

    const firstDigit = Math.floor(statusCode / 100)

    return firstDigit === 1 || firstDigit === 2 ||  firstDigit === 3;
}


/**
 * Set content type to "application/json" if not present.<p>
 * 
 * Set csrf token if is not a "get" method and ```refreshCsrfToken``` is true or csrf token header is not set yet.
 * 
 * @param url to send the request to
 * @param headers json object with strings as keys and values
 * @param refreshCsrfToken if true the csrf token will be fetched again before sending the request. Default is false
 * @param method http method of request. If is "GET" then no csrf token will be attached to headers. Default is "get"
 * @returns ```headers``` object with necessary props set 
 */
async function getFetchHeaders(url: string, headers?: Record<string, any>, refreshCsrfToken = false, method = "get") {

    const contentType = {"Content-Type": "application/json"};

    // get correct csrfToken
    const csrfToken = ""; // TODO

    // case: fetch new csrf token
    // TODO
    // if (refreshCsrfToken && isCsrfTokenFree(url))
    //     csrfToken.setToken(await fetchCsrfToken(url));
    
    // TODO:
    // const csrfTokenHeader = {[csrfToken.getHeaderName()]: csrfToken.getToken()};

    if (!headers)
        headers = {};

    // content type
    if (!headers["Content-Type"])
        Object.assign(headers, contentType);

    // csrf token
    // TODO
    // if ((!headers[csrfToken.getHeaderName()] || refreshCsrfToken) && !equalsIgnoreCaseTrim(method, "get")) 
    //     Object.assign(headers, csrfTokenHeader);

    return headers;
}


// /**
//  * Fetch csrf token from session id.<p>
//  * 
//  * Assuming that ```baseUrl + "/getCsrfToken"``` is the correct endpoint.
//  * 
//  * @param url to get the baseUrl from that will be prepended to "/getCsrfToken". May also just be the baseUrl itself
//  * @returns return csrf token string for document_builder or empty string if request failed or csrf endpoint would require auth
//  */
// export async function fetchCsrfToken(url: string): Promise<string> {

//     const baseUrl = getBaseUrlFromUrl(url);
//     if (isBlank(baseUrl) || !isCsrfTokenFree(url))
//         return "";

//     const response = await fetchAny(baseUrl + "/getCsrfToken");

//     if (!isHttpStatusCodeAlright(response.status))
//         return "";
    
//     return await (response as Response).text();
// }


/**
 * Format given fetch error as {@link ApiExceptionFormat}, log and return it.
 * 
 * @param e fetch error that was thrown 
 * @param url that fetch() used
 * @returns {@link ApiExceptionFormat} using most values from given error
 */
function handleFetchError(e: Error, url: string): ApiExceptionFormat {

    const error: ApiExceptionFormat = {
        status: FAILED_TO_FETCH_STATUS_CODE,
        error: e.toString(),
        message: e.message,
        path: url.replace(WORDPRESS_BASE_URL, "")
    }

    logApiResponse(error);

    return error;
}


/**
 * @param url to check
 * @returns true if fetching the csrf token does not require any authentication
 */
function isCsrfTokenFree(url: string) {

    return url.startsWith(WORDPRESS_BASE_URL);
}