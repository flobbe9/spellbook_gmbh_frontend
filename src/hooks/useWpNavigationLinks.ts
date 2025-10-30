import type { WpNavigationLink } from "@/abstracts/backendDefinitions/WpNavigationLink";
import type { FetchConfig } from "@/abstracts/CustomFetchOptions";
import type { CustomUseQueryConfig } from "@/abstracts/CustomUseQueryOptions";
import { BACKEND_API_BASE_URL } from "@/helpers/constants";
import type { DefinedUseQueryResult } from "@tanstack/react-query";
import { useBackendApi } from "./useBackendApi";

const QUERY_KEY = ["navigation", "links"]

/**
 * Get the nav bar links meant to appear outisde a nav bar menu.
 * 
 * @returns queryResult with {@link WpNavigationLink} array
 * @since 0.0.1
 */
export function useWpNavigationLinks(cacheConfig?: CustomUseQueryConfig, fetchConfig?: FetchConfig): DefinedUseQueryResult<WpNavigationLink[]> {

    const queryResult = useBackendApi<WpNavigationLink[]>(
        {
            url: `${BACKEND_API_BASE_URL}/navigation/links`,
            ...(fetchConfig ?? {})
        },
        {
            queryKey: QUERY_KEY,
            ...(cacheConfig ?? {})
        }
    );

    return queryResult;
}