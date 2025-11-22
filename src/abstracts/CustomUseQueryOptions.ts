import type { CustomResponseFormat } from "./CustomResponseFormat";

export interface CustomUseQueryConfig {
    /** Default should be `false` */
    fetchOnMount?: boolean, 

    /** 
     * Takes precedence over `fetchOnMount`. Indicates to fetch on mount if the cache is empty.
     * 
     * Default is `true`
     */
    fetchOnMountIfCacheIsEmpty?: boolean,
    
    onError?: (response: CustomResponseFormat) => void, 
    
    queryKey?: string[]
}