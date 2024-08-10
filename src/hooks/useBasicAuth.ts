import { ApiExceptionFormat } from "../abstract/ApiExceptionFormat";
import { CRYPTO_IV, CRYPTO_KEY, ENV, IS_SITE_LIVE, SESSION_EXPIRY_DAYS, WORDPRESS_BASE_URL, WORDPRESS_CUSTOM_PATH, WORDPRESS_REQUEST_MAPPING } from "../helpers/constants";
import fetchJson, { isHttpStatusCodeAlright } from "../helpers/fetchUtils";
import { datePlusDays, equalsIgnoreCaseTrim, isBlank, isDateAfter, isDateBefore, log, logError, stringToNumber } from "../helpers/genericUtils";
import BasicAuth from './../components/BasicAuth';
import { useNavigate } from "react-router";
import WPPage from "../abstract/wp/WPPage";
import { useContext } from "react";
import { AppContext } from "../components/App";
import CryptoJSImpl from "../abstract/CryptoJSImpl";


/**
 * Proides some functions for basic authentication used in {@link BasicAuth}.
 * 
 * Only call this inside react navigation context, since ```useNavigate``` is used here. 
 * Also uses {@link AppContext}.
 * 
 * @since 0.0.1
 */
export default function useBasicAuth() {

    /** The key of the session expiry date stored in local storage. */
    const SESSION_KEY = "spellbook_gmbh-sessionId";

    const crypto = new CryptoJSImpl(CRYPTO_KEY, CRYPTO_IV);

    const navigate = useNavigate();

    const { setIsLoggedIn } = useContext(AppContext);


    /**
     * Send credentials to wp backend in order to validate them.
     * 
     * @param emailOrUserName email or user name of user
     * @param password decrypted password of user
     * @returns ApiExceptionFormat or Response from backend
     */
    async function fetchLogin(emailOrUserName: string | undefined, password: string | undefined): Promise<Response | ApiExceptionFormat> {

        const url = `${WORDPRESS_BASE_URL}/${WORDPRESS_REQUEST_MAPPING}/${WORDPRESS_CUSTOM_PATH}/validateUser`;
        const body = {
            email: emailOrUserName,
            password: password
        }

        return fetchJson(url, "post", body);
    }


    /**
     * Validate credentials with wp, create session on success and redirect to "/". Do nothing on failure.
     * 
     * @param emailOrUserName email or user name of user
     * @param password decrypted password of user 
     * @returns the http response
     */
    async function login(emailOrUserName: string | undefined, password: string | undefined): Promise<Response | ApiExceptionFormat> {

        const jsonResponse = await fetchLogin(emailOrUserName, password);

        // case: login failed
        if (!isHttpStatusCodeAlright(jsonResponse.status)) 
            return jsonResponse;
        
        await createSession();

        navigate("/");

        return jsonResponse;
    }


    /**
     * Update global loggedIn state and destroy session.
     */
    function logout(): void {

        setIsLoggedIn(false);

        localStorage.removeItem(SESSION_KEY);
    }


    /**
     * Create a date plus {@link SESSION_EXPIRY_DAYS} days, encrypt ```getTime()``` and store it in in local storage using
     * {@link SESSION_KEY}.
     */
    async function createSession(): Promise<void> {

        const expiryDate = datePlusDays(SESSION_EXPIRY_DAYS);

        const encryptedExpiryDate = crypto.encrypt(expiryDate.getTime().toString()).toString();
        // case: encryption failed
        if (isBlank(encryptedExpiryDate)) {
            logError("Failed to create session. Failed to encrypt session object");
            return;
        }

        localStorage.setItem(SESSION_KEY, encryptedExpiryDate);
    }


    /**
     * @returns true if there's a session expiry date in localstorage that is not yet expired (if expiry date is
     *          today the session will be seen as valid).
     */
    async function isSessionValid(): Promise<boolean> {

        const encryptedExpiryDate = localStorage.getItem(SESSION_KEY);
        // case: no session found
        if (isBlank(encryptedExpiryDate))
            return false;
        
        const decryptedExpiryDateString = crypto.wordArrayToString(crypto.decrypt(encryptedExpiryDate!));
        // case: failed to decrypt
        if (isBlank(decryptedExpiryDateString)) {
            logError("Failed to validate session. Could not decrypt session object");
            return false;
        }

        return isDateAfter(new Date(stringToNumber(decryptedExpiryDateString)), new Date());
    }


    /**
     * Validate session, update global state.
     * 
     * Don't validate session if ```ENV``` is "development".
     * 
     * @return true if is logged in, else false
     */
    async function updateSession(): Promise<boolean> {

        // uncomment this to disable basic auth
        if (ENV === "development") {
            setIsLoggedIn(true)
            return true;
        }

        const sessionValid = await isSessionValid();

        // update state
        setIsLoggedIn(sessionValid);

        return sessionValid;
    }


    /**
     * Redirect user to "/" if they are at "/login" and logged in already.
     * 
     * Redirect user to "/login" unless they are logged in or the site is live and the page is public.
     * 
     * @param isLoggedIn true if session is valid
     * @param wpPages fetched on load to determine ```post_status``` of current page
     */
    // TODO: remove prev page from history
    function redirect(isLoggedIn: boolean, wpPages: WPPage[]): void {

        // case: is logged in
        if (isLoggedIn) {
            // case: still at login page
            if (window.location.pathname.startsWith("/login"))
                navigate("/");

            return;
        }

        // case: not logged in but site is live and page is public
        if (IS_SITE_LIVE && isPublicPage(wpPages))
            return;

        // case: not logged in
        if (!window.location.pathname.startsWith("/login"))
            navigate("/login");
    }
    

    /**
     * @param isLoggedIn true if the current session is valid
     * @returns false if the current page has a ```post_status``` other than "publish", 
     *          true if current page is public or 404 or there're no pages at all or ```isLoggedIn``` is true
     */
    function isPublicPage(wpPages: WPPage[]): boolean {

        // case: pages not fetched yet
        if (!wpPages || !wpPages.length)
            return true;

        for (const wpPage of wpPages) {
            // case: not a wp page (propably null)
            if (!wpPage)
                continue;

            // case: current page not public
            if (isPathCurrentPath(wpPage.path) && !isPagePublic(wpPage)) 
                return false;
        }

        return true;
    }


    /**
     * @param path to check agains current path
     * @returns true if given path equals ```window.location.pathname```. Also works with slashes at the end and/or front
     */
    function isPathCurrentPath(path: string): boolean {

        if (isBlank(path))
            return false;

        const currentPath = window.location.pathname;

        return equalsIgnoreCaseTrim(path, currentPath) ||
               equalsIgnoreCaseTrim("/" + path + "/", currentPath) ||
               equalsIgnoreCaseTrim("/" + path, currentPath) ||
               equalsIgnoreCaseTrim(path + "/", currentPath);
    }


    function isPagePublic(wpPage: WPPage): boolean {

        return wpPage && wpPage.post_status === "publish";
    }


    return {
        login,
        logout,
        updateSession,
        redirect
    }
}