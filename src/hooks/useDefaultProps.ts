import type DefaultProps from "@/abstracts/props/DefaultProps";

/**
 * Add `componentName` to `className`.
 * 
 * @param componentName to add to className
 * @param props passed to this component
 * @returns slightly modified `props`
 */
export function useDefaultProps<T extends HTMLElement = HTMLElement, P extends DefaultProps = DefaultProps<T>>(componentName: string, props: P): P {
    return {
        ...props,
        className: ((componentName ? `${componentName} ` : '') + (props.className ?? '')).trim()
    };
}