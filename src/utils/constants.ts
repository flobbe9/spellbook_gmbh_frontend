import sanitize from "sanitize-html";

export const ENV = process.env.REACT_APP_ENV + "";

export const WORDPRESS_BASE_URL = process.env.REACT_APP_WORDPRESS_BASE_URL + "";

/** does not start or end with a "/" */
export const WORDPRESS_REQUEST_MAPPING = process.env.REACT_APP_WORDPRESS_REQUEST_MAPPING + "";

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
        "a": ["href", "alt", ...ALLOWED_TAG_ATTRIBUTES],
        "bdo": ["lang", "dir", ...ALLOWED_TAG_ATTRIBUTES],
        "div": [...ALLOWED_TAG_ATTRIBUTES],
        "figure": [...ALLOWED_TAG_ATTRIBUTES],
        "img": ["src", "alt", ...ALLOWED_TAG_ATTRIBUTES],
        "mark": ["alt", "color", ...ALLOWED_TAG_ATTRIBUTES],
        "span": [...ALLOWED_TAG_ATTRIBUTES]
    },
    parseStyleAttributes: false
}