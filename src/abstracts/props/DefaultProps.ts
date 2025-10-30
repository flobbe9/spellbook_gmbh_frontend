import type { HTMLAttributes } from "react";

/**
 * @type T the html element type, e.g. `HTMLDivElement`
 * @since 0.0.1
 */
export default interface DefaultProps<T> extends HTMLAttributes<T> {
    /** Components should return `<Fragment />` if `false` (see Conditional.tsx). Default should be `true` */
    rendered?: boolean
}

/**
 * Add `componentName` to `className`.
 * 
 * @param componentName to add to className
 * @param props passed to this component
 * @returns slightly modified `props`
 */
export function getDefaultProps<T>(componentName: string, props: DefaultProps<T>): DefaultProps<T> {
    return {
        ...props,
        className: (componentName ? `${componentName} ` : '') + (props.className ?? '')
    };
}