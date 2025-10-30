import type WpPage from "@/abstracts/backendDefinitions/WpPage";
import type { FetchConfig } from "@/abstracts/CustomFetchOptions";
import type { CustomUseQueryConfig } from "@/abstracts/CustomUseQueryOptions";
import type { DefinedUseQueryResult } from "@tanstack/react-query";
import { useBackendApi } from "./useBackendApi";
import { BACKEND_API_BASE_URL } from "@/helpers/constants";
import { WpPostType } from "@/abstracts/backendDefinitions/WpPostType";

/**
 * Fetch any wordpress page.
 * 
 * @param slug of the wordpress page (no slashes)
 * @param postType of the wordpress page
 * @param cacheConfig 
 * @param fetchConfig 
 * @returns queryResult of type `WpPage`
 * @since latest
 */
export function useWpPage(
    slug: string, 
    postType: WpPostType,
    cacheConfig?: CustomUseQueryConfig, 
    fetchConfig?: FetchConfig
): DefinedUseQueryResult<WpPage> {
    const QUERY_KEY = ["page", postType, slug];

    const queryResult = useBackendApi<WpPage>(
        {
            url: `${BACKEND_API_BASE_URL}/${postType}/getBySlug/${slug}`,
            ...(fetchConfig ?? {})
        },
        {
            queryKey: QUERY_KEY,
            ...(cacheConfig ?? {})
        }
    )

    return queryResult;
}