import type DefaultProps from "@/abstracts/props/DefaultProps";
import { forwardRef, type Ref } from "react";
import Conditional from "./Conditional";

/**
 * @since latest
 */
export default forwardRef(function ConditionalDiv(
    {children, ...props}: DefaultProps,
    ref: Ref<HTMLDivElement>
) {
    return (
        <Conditional {...props}>
            <div ref={ref} {...props}>{children}</div>
        </Conditional>
    );
})