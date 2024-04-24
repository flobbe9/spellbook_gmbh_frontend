import { CSSProperties, ReactNode } from "react";


/**
 * @since 0.0.1
 */
export default interface DefaultProps {

    id?: string,
    className?: string,
    children?: ReactNode,
    style?: CSSProperties
}


/**
 * @param props to clean up
 * @param componentName to prepend to id and className
 * @returns clean default props object with componentName prepended to id and className and no ```undefined``` values
 */
export function getCleanDefaultProps(props: DefaultProps, componentName?: string): DefaultProps {

    componentName = componentName || "";

    return {
        id: componentName + (props.id || ""),
        className: componentName + (props.className || ""),
        children: props.children || "",
        style: props.style || {},
    }
}