import type { CustomResponseFormat } from "./CustomResponseFormat";

export interface CustomUseQueryConfig {
    /** Default should be `false` */
    fetchOnMount?: boolean, 
    
    onError?: (response: CustomResponseFormat) => void, 
    
    queryKey: string[]
}