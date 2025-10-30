import type DefaultProps from "@/abstracts/props/DefaultProps";
import ConditionalDiv from "./ConditionalDiv";
import { getDefaultProps } from "@/abstracts/props/DefaultProps";

/**
 * @since latest
 */
export default function _404(props: DefaultProps<HTMLDivElement>) {
    const { children, ...otherProps } = getDefaultProps("_404", props);

    return (
        <ConditionalDiv {...otherProps}>
            <h1>404</h1>
            {children}
        </ConditionalDiv>
    )
}