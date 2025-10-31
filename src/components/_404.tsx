import type DefaultProps from "@/abstracts/props/DefaultProps";
import ConditionalDiv from "./ConditionalDiv";
import { useDefaultProps } from "@/hooks/useDefaultProps";

/**
 * @since latest
 */
export default function _404(props: DefaultProps<HTMLDivElement>) {
    const { children, ...otherProps } = useDefaultProps("_404", props);

    return (
        <ConditionalDiv {...otherProps}>
            <h1>404</h1>
            {children}
        </ConditionalDiv>
    )
}