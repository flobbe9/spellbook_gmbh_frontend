import type { WpNavigationMenu } from "@/abstracts/backendDefinitions/WpNavigationMenu";
import type { FetchConfig } from "@/abstracts/CustomFetchOptions";
import type { CustomUseQueryConfig } from "@/abstracts/CustomUseQueryOptions";
import { BACKEND_API_BASE_URL } from "@/helpers/constants";
import type { DefinedUseQueryResult } from "@tanstack/react-query";
import { useBackendApi } from "./useBackendApi";

const QUERY_KEY = ["navigation", "menus"]

/**
 * @returns queryResult with {@link WpNavigationMenu} array
 * @since 0.0.1
 */
export function useWpNavigationMenus(cacheConfig?: CustomUseQueryConfig, fetchConfig?: FetchConfig): DefinedUseQueryResult<WpNavigationMenu[]> {

    const queryResult = useBackendApi<WpNavigationMenu[]>(
        {
            url: `${BACKEND_API_BASE_URL}/navigation/menus`,
            ...(fetchConfig ?? {})
        },
        {
            queryKey: QUERY_KEY,
            ...(cacheConfig ?? {})
        }
    );

    return queryResult;
}