import { AppContext } from "@/components/context/AppContextProvider";
import { useContext } from "react";

/**
 * @since latest
 */
export function useAppContext() {
    return useContext(AppContext);
}