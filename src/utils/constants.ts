import sanitize from "sanitize-html";
import { isBlank, logWarn, stringToNumber } from "./genericUtils";
import { CryptoHelper } from './../abstract/CryptoHelper';
import { Env } from "../abstract/Env";

// App
export const ENV: Env = process.env.NODE_ENV as Env;
export const PROTOCOL = process.env.REACT_APP_PROTOCOL + "";
export const COMPANY_NAME = "Spellbook GmbH";
export const VERSION = process.env.REACT_APP_VERSION + "";
/** True if basic auth has been removed for normal users */
export const IS_SITE_LIVE = process.env.REACT_APP_IS_SITE_LIVE === "true";

// URLs
export const WORDPRESS_BASE_URL = process.env.REACT_APP_WORDPRESS_BASE_URL + "";
/** does not start or end with a "/" */
export const WORDPRESS_REQUEST_MAPPING = process.env.REACT_APP_WORDPRESS_REQUEST_MAPPING + "";
/** does not start or end with a "/" */
export const WORDPRESS_CUSTOM_PATH = "custom";


// Sanitizer
const ALLOWED_TAG_ATTRIBUTES = ["class", "id", "title", "style"];
export const DEFAULT_HTML_SANTIZER_OPTIONS: sanitize.IOptions = {
    allowedTags: [
        "a",
        "bdo",
        "code",
        "div",
        "em",
        "figcaption",
        "figure",
        "h1", "h2", "h3", "h4", "h5", "h6",
        "img",
        "kbd",
        "mark",
        "p",
        "s",
        "span",
        "strong",
        "sub",
        "sup",
        "svg",
    ],
    allowedAttributes: {
        "a": ["href", "alt", "target", "rel", ...ALLOWED_TAG_ATTRIBUTES],
        "bdo": ["lang", "dir", ...ALLOWED_TAG_ATTRIBUTES],
        "div": [...ALLOWED_TAG_ATTRIBUTES],
        "figure": [...ALLOWED_TAG_ATTRIBUTES],
        "h1": [...ALLOWED_TAG_ATTRIBUTES],
        "h2": [...ALLOWED_TAG_ATTRIBUTES],
        "h3": [...ALLOWED_TAG_ATTRIBUTES],
        "h4": [...ALLOWED_TAG_ATTRIBUTES],
        "h5": [...ALLOWED_TAG_ATTRIBUTES],
        "h6": [...ALLOWED_TAG_ATTRIBUTES],
        "img": ["src", "alt", ...ALLOWED_TAG_ATTRIBUTES],
        "mark": ["alt", "color", ...ALLOWED_TAG_ATTRIBUTES],
        "p": [...ALLOWED_TAG_ATTRIBUTES],
        "span": [...ALLOWED_TAG_ATTRIBUTES],
    },
    parseStyleAttributes: false
}


// Other
export const IMAGE_EXTENSIONS = [
    "jpg",
    "jpeg",
    "png",
    "gif",
    "webp",
    "tiff",
    "psd",
    "raw",
    "bmp",
    "heif",
    "indd",
    "jp2", 
    "j2k", 
    "jpf", 
    "jpx", 
    "jpm", 
    "mj2"
] 
/**
 * @param name of file or url
 * @returns true if ```name``` ends on one of {@link IMAGE_EXTENSIONS}
 */
export function isImage(name: string): boolean {

    if (isBlank(name))
        return false;

    return !!IMAGE_EXTENSIONS.filter(extension => name.endsWith(extension)).length;
}

export const SESSION_EXPIRY_DAYS = 7;


// Crypto
export const CRYPTO_KEY = getCryptoKey();
export const CRYPTO_COUNTER = getCryptoCounter();
export const CRYPTO_ALG = process.env.REACT_APP_CRYPTO_ALG || "";
export const CRYPTO_LENGTH = stringToNumber(process.env.REACT_APP_CRYPTO_LENGTH);

function getCryptoKey(): Uint8Array {

    // parse numbers from .env to number[]
    const cryptoKeyString = process.env.REACT_APP_CRYPTO_KEY || "";
    const cryptoKeyArray = parseEnvNumbers(cryptoKeyString);

    if (!cryptoKeyArray.length) 
        logWarn("Failed to parse CRYPTO_KEY from .env");

    return Uint8Array.from(cryptoKeyArray);
}

function getCryptoCounter(): Uint8Array {

    // parse numbers from .env to number[]
    const cryptoKeyString = process.env.REACT_APP_CRYPTO_COUNTER || "";
    const cryptoKeyArray = parseEnvNumbers(cryptoKeyString);

    if (cryptoKeyArray.length <= 1) 
        logWarn("Failed to parse CRYPTO_COUNTER from .env");

    return Uint8Array.from(cryptoKeyArray);
}

function parseEnvNumbers(envVariable: string): number[] {

    const cryptoKeyStringArray = envVariable.split(",");

    return cryptoKeyStringArray.map(str => stringToNumber(str));
}