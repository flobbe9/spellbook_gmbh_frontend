/**
 * Project specific utils
 * 
 * @since 0.0.1
 */

import { getCSSValueAsNumber } from "./utils";

export function getRootFontSizePixels(): number {
    const body = document.documentElement.querySelector("body");
    return getCSSValueAsNumber(getComputedStyle(body).getPropertyValue("font-size"), 2);
}