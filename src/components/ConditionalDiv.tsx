import type DefaultProps from "@/abstracts/props/DefaultProps";
import Conditional from "./Conditional";

/**
 * @since 0.0.1
 */
export default function ConditionalDiv({children, ...props}: DefaultProps<HTMLDivElement>) {
    return (
        <Conditional {...props}>
            <div {...props}>{children}</div>
        </Conditional>
    );
}