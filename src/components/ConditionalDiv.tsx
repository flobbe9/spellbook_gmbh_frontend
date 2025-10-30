import type DefaultProps from "@/abstracts/props/DefaultProps";
import { forwardRef, type Ref } from "react";
import Conditional from "./Conditional";

/**
 * @since 0.0.1
 */
export default forwardRef(function ConditionalDiv(
    {children, ...props}: DefaultProps<HTMLDivElement>,
    ref: Ref<HTMLDivElement>
) {
    return (
        <Conditional {...props}>
            <div ref={ref} {...props}>{children}</div>
        </Conditional>
    );
})