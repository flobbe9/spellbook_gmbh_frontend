import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiExceptionFormat } from "../abstract/ApiExceptionFormat";
import { ENV, SESSION_EXPIRY_DAYS, WORDPRESS_BASE_URL, WORDPRESS_CUSTOM_PATH, WORDPRESS_REQUEST_MAPPING } from "../utils/constants";
import fetchJson, { isHttpStatusCodeAlright } from "../utils/fetchUtils";
import { datePlusDays, isDateAfter, isDateBefore, log, logError, stringToNumber } from "../utils/genericUtils";
import { CryptoHelper } from "../abstract/CryptoHelper";
import BasicAuth from './../components/BasicAuth';
import { useNavigate } from "react-router";


/**
 * Proides some functions for basic authentication used in {@link BasicAuth}.
 * 
 * @since 0.0.1
 */
export default function useBasicAuth() {

    /** The key of the session expiry date stored in local storage. */
    const SESSION_KEY = "sessionExpiryDate";

    const globalCryptoHelper = new CryptoHelper().build();

    const navigate = useNavigate();


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
        // redirect to "/"
        redirect(true);

        if (ENV === "development")
            log("Login successful");

        return jsonResponse;
    }


    /**
     * Create a date plus {@link SESSION_EXPIRY_DAYS} days, encrypt ```getTime()``` and store it in in local storage using
     * {@link SESSION_KEY}.
     */
    async function createSession(): Promise<void> {

        const cryptoHelper = await globalCryptoHelper;
        const expiryDate = datePlusDays(SESSION_EXPIRY_DAYS);
        const encryptedExpiryDate = await cryptoHelper.encrypt(expiryDate.getTime().toString());
        // case: encryption failed (should not happen)
        if (!encryptedExpiryDate) {
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
        if (!encryptedExpiryDate)
            return false;
        
        const cryptoHelper = await globalCryptoHelper;
        const expiryDateString = await cryptoHelper.decrypt(encryptedExpiryDate, false) as string;
        if (!expiryDateString) {
            logError("Failed to validate session. Could not decrypt session object");
            return false;
        }

        return isDateAfter(new Date(stringToNumber(expiryDateString)), new Date());
    }


    /**
     * Validate session, update global state and redirect if necessary.
     * 
     * @param setIsLoggedIn setter of global ```isLoggedIn``` state
     */
    async function updateSession(setIsLoggedIn: (isLoggedIn: boolean) => void): Promise<void> {

        const sessionValid = await isSessionValid();

        // update state
        setIsLoggedIn(sessionValid);

        // redirect if necessary
        redirect(sessionValid);
    }


    /**
     * Redirect to ```/login``` page if not already there and session is invalid.
     * 
     * Redirect to ```/``` page if not already there and session is valid.
     * 
     * @param isSessionValid if ```true```, it is assumed that ```isLoggedIn === true```
     */
    async function redirect(isSessionValid: boolean): Promise<void> {

        const path = window.location.pathname;

        // case: not logged in
        if (path !== "/login" && !isSessionValid)
            navigate("/login");

        // case: logged in
        else if (path === "/login" && isSessionValid)
            navigate("/");
    }


    return {
        login,
        updateSession
    }
}