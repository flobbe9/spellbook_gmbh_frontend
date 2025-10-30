import { logError, logWarn } from "./logUtils";

/**
 * @param obj 
 * @returns `true` if, and only if, `obj` is `undefined` or `null`
 */
export function isFalsy(obj: any): boolean {
    return obj === undefined || obj === null;
}

/**
 * @param str string to check
 * @returns true if given string is empty or only contains white space chars
 */
export function isBlank(str: string | undefined | null): boolean {
    if (isFalsy(str))
        return true;

    str = str!.trim();

    return str.length === 0;
}

/**
 * @param date to format, default is ```new Date()```
 * @returns nicely formatted string formatted like ```year-month-date hours:minutes:seconds:milliseconds```
 */
export function getTimeStamp(date = new Date()): string {
    return (
        date.getFullYear() +
        "-" +
        prepend0ToNumber(date.getMonth() + 1) +
        "-" +
        prepend0ToNumber(date.getDate()) +
        " " +
        prepend0ToNumber(date.getHours()) +
        ":" +
        prepend0ToNumber(date.getMinutes()) +
        ":" +
        prepend0ToNumber(date.getSeconds()) +
        ":" +
        prepend0ToNumber(date.getMilliseconds(), 3)
    );
}

/**
 * @param num to prepend a 0 to
 * @param totalDigits number of digits (including `num`) to stop prepending zeros at. Default is 2, that would make `5 => 05`
 * @returns a string representation of given number with a 0 prended if the number has only one digit
 */
function prepend0ToNumber(num: number, totalDigits = 2): string {
    let str = num.toString();

    while (str.length < totalDigits)
        // case: one digit only
        str = "0" + str;        

    return str;
}

/**
 * Throws at the first arg beeing blank (but not if no args are specified).
 *
 * @param args to check
 */
export function assertFalsyOrBlankAndThrow(...args: any[]): void {
    if (!args || !args.length) return;

    for (let i = 0; i < args.length; i++) {
        const arg = args[i];

        if (typeof arg === "string" && isBlank(arg) || isFalsy(arg)) 
            throw new Error(`Invalid arg at index ${i}`);
    }
}

/**
 * @param expected first value to compare
 * @param actual second value to compare
 * @returns ```expected === actual``` after calling ```toLowerCase()``` on both values.
 *          Types wont be considered: ```"1" === 1 = true```
 */
export function equalsIgnoreCase(expected: string | number | undefined, actual: string | number | undefined): boolean {
    if (!expected || !actual) return expected === actual;

    expected = expected.toString().toLowerCase();
    actual = actual.toString().toLowerCase();

    return expected === actual;
}

/**
 * @param expected first value to compare
 * @param actual second value to compare
 * @returns ```expected === actual``` after calling ```trim()``` and ```toLowerCase()``` on both values.
 *          Types wont be considered: ```"1" === 1 = true```
 */
export function equalsIgnoreCaseTrim(expected: string | number, actual: string | number): boolean {
    if (!expected || !actual) return expected === actual;

    expected = expected.toString().trim().toLowerCase();
    actual = actual.toString().trim().toLowerCase();

    return expected === actual;
}

/**
 * Await a promise that resolves after given delay with given ```resolveValue```.
 * 
 * @param delay in ms
 * @param resolveValue value passed to ```res``` callback 
 * @returns ```resolveValue``` or ```undefined```
 */
export async function sleep<T>(delay: number, resolveValue?: T): Promise<T | undefined> {
    return await new Promise((res, ) => {
        setTimeout(() => {
            res(resolveValue);
        }, delay);
    });
} 

/**
 * Removes current page from browser history and replaces it with given ```path```.
 * 
 * @param path relative path to replace the current history entry with. Default is the current path
 * @param state the ```history.state``` to replace. Default is ```null``` (beeing the current one)
 */
export function replaceCurrentBrowserHistoryEntry(path: string | URL | null = window.location.pathname, state: any = null): void {
    window.history.replaceState(state, "", path);
}

/**
 * @returns hash map of url query param key values of current url (empty map if none present)
 */
function parseUrlQueryParams(): Map<string, string> {
    const urlQueryParams = window.location.search;

    // case: no params or only a '?'
    if (urlQueryParams.length <= 1)
        return new Map();

    const keyValueArr = urlQueryParams.replace("?", "").split("&");

    const keyValueMap = new Map<string, string>();

    keyValueArr
        .forEach(keyValuePair => {
            const firstEqualsIndex = keyValuePair.indexOf("=");

            // case: no value
            if (firstEqualsIndex === -1)
                keyValueMap.set(keyValuePair, "");
        
            else {
                const key = keyValuePair.substring(0, firstEqualsIndex);
                let value = keyValuePair.substring(firstEqualsIndex).replace("=", "");
                value = decodeURI(value);
                
                keyValueMap.set(key, value);
            }
        });

    return keyValueMap;
}

/**
 * @param queryParamsMap hashmap containing url query param key values
 * @returns url query param string starting with '?' or blank string if map is falsy
 */
function parseQueryParamsMap(queryParamsMap: Map<string, string>): string {
    if (!queryParamsMap)
        return "";

    let queryParams = '?';
    Array.from(queryParamsMap.entries())
        .forEach(([key, value], i) => {
            if (isBlank(key)) {
                logWarn(`Invalid query param key '${key}'`);
                return;
            }

            if (isBlank(value))
                value = '';

            if (i > 0)
                queryParams += '&';

            queryParams += `${key}=${value}`
        })

    return queryParams;
}


/**
 * Retrieve the url query param value for given key using ```window.location.search```. Usefull if react hooks don't work for some reason.
 * 
 * @param key of the url query param value
 * @returns the value for given key or ```null```
 */
export function getUrlQueryParam(key: string): string | null {
    if (isFalsy(key))
        return null;

    return parseUrlQueryParams().get(key) || null;
}

/**
 * Update / add url query params for each `[key, value]` pair. Do nothing if `key` is blank, delete param if `value` is blank
 * 
 * @param keyValues array of `[key, value]` touples to set
 * @param navigationOptions specify how to navigate after updating the url query params. Will refresh page by default
 */
export function setUrlQueryParam(
    keyValues: [string, string][], 
    navigationOptions: {
        /** 
         * 'refresh' will refresh page, 'navigate' will use provided `navigate` callback to go to new url, 'replace' will replace the 
         * current browser history entry, navigating to updated url without page refresh
         */
        navigationType: "refresh" | "navigate" | "replace",
        /** Mandatory if `navigationType` is 'navigate' */
        navigate?: (to: string) => void
    } = {navigationType: "refresh"}
): void {
    assertFalsyOrBlankAndThrow(keyValues);

    if (!keyValues.length)
        return;

    const queryParamsMap = parseUrlQueryParams();
    keyValues.forEach(([key, value], i) => {
        if (isBlank(key)) {
            logError(`Failed to set url query param, key falsy at index ${i}`);
            return;
        }

        if (isBlank(value))
            queryParamsMap.delete(key);
        else
            queryParamsMap.set(key, value);
    })

    const updatedQueryParams = parseQueryParamsMap(queryParamsMap);

    const {navigationType, navigate} = navigationOptions;
    switch (navigationType) {
        case "refresh":
            window.location.search = updatedQueryParams;
            break;

        case "navigate":
            if (!navigate)
                throw new Error("Specify a 'navigate' callback in order to use navigationType 'navigate'");
            navigate(`${window.location.pathname}${updatedQueryParams}`);
            break;

        case "replace":
            replaceCurrentBrowserHistoryEntry(`${window.location.pathname}${updatedQueryParams}`)
            break;
            
        default:
            throw new Error(`Invalid 'navigationType': '${navigationType}'`);
    }
}

/**
 * Basically calls ```animate()``` but will commit any animation styles to ```element.style```.
 * 
 * @param element to animate styles of
 * @param keyframes see {@link KeyFrame} and {@link PropertyIndexedKeyframes}
 * @param options of the animation. Will set ```fill = "both"``` by default, this can be overridden though
 * @returns the animation or ```null``` if given ```element``` is falsy
 */
export async function animateAndCommit(element: HTMLElement | undefined | null, keyframes: Keyframe[] | PropertyIndexedKeyframes | null, options?: KeyframeAnimationOptions & { onComplete?: () => void }): Promise<Animation | null> {

    if (!element)
        return null;

    const animation = element.animate(keyframes, {
        fill: "both",
        ...(options ?? {})
    });

    try {
        await animation.finished;
        animation.commitStyles();
        
    // might throw AbortError or InvalidStateError, happens when animation is canceled before finished, has no consequences though
    } catch (e) {
    }
    
    if (options?.onComplete)
        options.onComplete();

    return animation
}

/**
 * Animate element from transparent to solid and set ```display = 'block'```.
 * 
 * @param element to fade in
 * @param options more animation options, see {@link KeyframeAnimationOptions}
 */
export async function fadeIn(element: HTMLElement | undefined | null, options?: KeyframeAnimationOptions & { onComplete?: () => void }): Promise<Animation | null> {
    if (!element)
        return null;

    const { duration = 100 } = options ?? {};

    element.style.display = "block";
    return animateAndCommit(
        element,
        [
            { opacity: 0 }, 
            { opacity: 1 }
        ],
        { 
            duration, 
            ...(options ?? {})
        }
    );
}


/**
 * Animate element to transparent, then set ```display = 'none'```. Resolves once animation is finished.
 * 
 * @param element to fade out
 * @param options more animation options, see {@link KeyframeAnimationOptions}
 */
export async function fadeOut(element: HTMLElement | undefined | null, options?: KeyframeAnimationOptions & { onComplete?: () => void }): Promise<Animation | null> {
    if (!element)
        return;

    const { duration = 100, onComplete } = options ?? {};

    const opacity = Number(window.getComputedStyle(element).getPropertyValue("opacity"));
    return animateAndCommit(
        element,
        [
            { opacity: opacity === -1 ? 1 : opacity }, 
            { opacity: 0 }
        ],
        { 
            duration,
            onComplete: () => {
                if (onComplete)
                    onComplete();
                element.style.display = "none";
            },
            ...(options || {}) 
        }
    );
}