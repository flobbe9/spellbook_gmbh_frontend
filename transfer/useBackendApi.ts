import { AbstractEntity } from "@/abstracts/backendDefinitions/AbstractEntity";
import { FetchConfig } from "@/abstracts/CustomFetchOptions";
import { CustomResponseFormat } from "@/abstracts/CustomResponseFormat";
import { CustomUseQueryConfig } from "@/abstracts/CustomUseQueryConfig";
import { CONTENT_TYPE_APPLICATION_JSON, CONTENT_TYPE_PLAIN_TEXT } from "@/helpers/constants";
import { fetchAny, hasCacheBeenInitialized, isHttpResponseNotAlright } from "@/helpers/fetchUtils";
import { logTrace } from "@/helpers/logUtils";
import { assertFalsyOrBlankAndThrow } from "@/helpers/utils";
import { DefinedUseQueryResult, useQuery, useQueryClient } from "@tanstack/react-query";
import { useHasComponentMounted } from "./useHasComponentMounted";

/** Possible response types returned from backend api endpoints */
export type BackendApiResponseType = AbstractEntity | AbstractEntity[] | string | boolean | null;

/**
 * Make an http request to the backend api, attempt to parse the response to json or text, then cache the data.
 * 
 * @param fetchConfig expect json response by default
 * @param cacheOptions by default wont fetch on mount
 * @type T the expected return type of the fetch call
 * @returns DefinedUseQueryResult with data of type `T`. May be `undefined` for a brief moment, while `useQuery`
 * is no initialized yet. Use {@link hasCacheBeenInitialized} for that
 * @since 0.0.1
 * @author f.schikarski
 */
export function useBackendApi<T extends BackendApiResponseType>(
    fetchConfig: FetchConfig,
    cacheOptions: CustomUseQueryConfig
): DefinedUseQueryResult<T> {
    assertFalsyOrBlankAndThrow(fetchConfig, cacheOptions);
    
    const queryClient = useQueryClient();

    const hasMounted = useHasComponentMounted();
    const { fetchOnMount = false, onError, queryKey } = cacheOptions;

    const queryResult = useQuery<T>({
        queryKey: queryKey,
        queryFn: fetchData,
        initialData: queryClient.getQueryData(queryKey)
    })

    async function fetchData(): Promise<T> {
        const cachedData: T = queryClient.getQueryData(queryKey);
        
        // case: don't want to refetch on mount
        if (!hasMounted && !fetchOnMount) {
            logTrace("still mounting...", fetchConfig.url);
            return cachedData;
        }

        const { expectedReturnType = CONTENT_TYPE_APPLICATION_JSON } = fetchConfig;
        // fetch expecting json or any other response type
        let response: CustomResponseFormat | T | Response = await fetchAny(fetchConfig);

        if (isHttpResponseNotAlright(response)) {
            if (onError)
                onError(response);

            if (hasThisCacheBeenInitialized())
                return cachedData;

            throw new Error(response.message);
        }

        switch (expectedReturnType) {
            case CONTENT_TYPE_APPLICATION_JSON:
                return await response.json() as T;

            case CONTENT_TYPE_PLAIN_TEXT:
                return await (response as Response).text() as T;

            case "boolean":
                return (await (response as Response).text() === "true") as T;
                
            default:
                throw new Error(`Return type ${expectedReturnType} not implemented`)
        }
    }

    function hasThisCacheBeenInitialized(): boolean {
        return hasCacheBeenInitialized(queryClient, queryKey);
    }

    return queryResult;
}