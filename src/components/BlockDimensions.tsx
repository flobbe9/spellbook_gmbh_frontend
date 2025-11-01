import type DefaultProps from "@/abstracts/props/DefaultProps";
import { useDefaultProps } from "@/hooks/useDefaultProps";
import { forwardRef, type Ref } from "react";
import ConditionalDiv from "./ConditionalDiv";

export interface BlockDimensionProps extends DefaultProps<HTMLDivElement> {
    /** Determines the width mode. See "_BlockDimensions.scss" for class definitions */
    mode: "window-width" | "margin-auto" | "fit-content"
}

/**
 * Wrap a `<Block>` component in this.
 * 
 * @since latest
 */
export default forwardRef(function BlockDimensions({mode, ...props}: BlockDimensionProps, ref: Ref<HTMLDivElement>) {
    const componentName = "BlockDimensions";
    const { className, children, ...otherProps } = useDefaultProps(componentName, props);

    return (
        <ConditionalDiv className={`${className} ${componentName}-${mode}`} ref={ref} {...otherProps}>
            {children}
        </ConditionalDiv>
    )
})