import type { Env } from "@/abstracts/Env";
import sanitize from "sanitize-html";
import { LogLevel } from "@/abstracts/LogLevel";

export const ENV: Env = import.meta.env.VITE_ENV as Env;
export const VERSION = import.meta.env.VITE_VERSION as string;
export const LOG_LEVEL = LogLevel[import.meta.env.VITE_LOG_LEVEL as string];

export const CONTENT_TYPE_APPLICATION_JSON = "application/json";
export const CONTENT_TYPE_TEXT_PLAIN = "text/plain";
export const BASE_URL = import.meta.env.VITE_BASE_URL; 
export const BACKEND_API_BASE_URL = `${BASE_URL}/?rest_route=/spellbook_gmbh/v1`;
export const CSRF_HEADER_NAME = "csrf";
export const CSRF_TOKEN_STORAGE_KEY = "csrf";
export const FAILED_TO_FETCH_STATUS_CODE = 503;




// Sanitizer
const ALLOWED_TAG_ATTRIBUTES = ["class", "id", "title", "style"];
export const DEFAULT_HTML_SANTIZER_OPTIONS: sanitize.IOptions = {
    allowedTags: [
        "a",
        "bdo",
        "br",
        "code",
        "div",
        "em",
        "figcaption",
        "figure",
        "h1", "h2", "h3", "h4", "h5", "h6",
        "i",
        "img",
        "input",
        "kbd",
        "mark",
        "p",
        "pre",
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
        "i": [...ALLOWED_TAG_ATTRIBUTES],
        "img": ["src", "alt", ...ALLOWED_TAG_ATTRIBUTES],
        "input": ["placeholder", "value", "defaultValue", ...ALLOWED_TAG_ATTRIBUTES],
        "mark": ["alt", "color", ...ALLOWED_TAG_ATTRIBUTES],
        "p": [...ALLOWED_TAG_ATTRIBUTES],
        "span": [...ALLOWED_TAG_ATTRIBUTES],
    },
    parseStyleAttributes: false
}