import type { HTMLAttributes } from "react";

/**
 * @type T the html element type, e.g. `HTMLDivElement`
 * @since latest
 */
export default interface DefaultProps<T extends HTMLElement = HTMLElement> extends HTMLAttributes<T> {
    /** Components should return `<Fragment />` if `false` (see Conditional.tsx). Default should be `true` */
    rendered?: boolean
}