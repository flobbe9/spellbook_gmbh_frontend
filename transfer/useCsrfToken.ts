import { CSRF_TOKEN_STORAGE_KEY, CSRF_URL_QUERY_KEY } from "@/helpers/constants";
import { getUrlQueryParam, isBlank, setUrlQueryParam } from "@/helpers/utils";
import { useEffect } from "react";
import { useIsLoggedIn } from "./useIsLoggedIn";

/**
 * Attempt to retrieve csrf token from url query param. Call this hook inside the component of the route which the backend
 * redirects to after successful login.
 * 
 * @since 0.0.1
 * @author f.schikarski
 */
export function useCsrfToken(): void {
    const { data: isLoggedIn, isPending: isLoggedInPending, isFetching: isLoggedInFetching } = useIsLoggedIn();

    useEffect(() => {
        cacheOrRemoveCsrfToken();
    }, [isLoggedIn]);

    /**
     * Attempt to retrieve csrf token from url query params if `isLoggedIn`.
     * Save to localstorage if token is non-blank and nothing cached yet.
     * Clean query param and browser history entry either way.
     * 
     * Remove from storage if logged out (don't touch query param at all)
     */
    function cacheOrRemoveCsrfToken(): void {
        if (isLoggedIn) {
            const csrfToken = getUrlQueryParam(CSRF_URL_QUERY_KEY);

            // case: got a value
            if (!isBlank(csrfToken)) {
                // case: nothing cached yet
                if (isBlank(localStorage.getItem(CSRF_TOKEN_STORAGE_KEY)))
                    localStorage.setItem(CSRF_TOKEN_STORAGE_KEY, csrfToken);

                setUrlQueryParam([[CSRF_URL_QUERY_KEY, null]], {navigationType: "replace"});
            }

        // case: definitively logged out
        } else if (!isLoggedInPending && !isLoggedInFetching)
            localStorage.removeItem(CSRF_TOKEN_STORAGE_KEY);
    }
}