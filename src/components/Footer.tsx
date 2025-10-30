import type DefaultProps from "@/abstracts/props/DefaultProps";
import { getDefaultProps } from "@/abstracts/props/DefaultProps";
import ConditionalDiv from "./ConditionalDiv";

/**
 * @since latest
 */
export default function Footer(props: DefaultProps<HTMLDivElement>) {
    const componentName = "Footer";
    const { children, ...otherProps } = getDefaultProps(componentName, props);

    return (
        <ConditionalDiv {...otherProps}>
            Footer
        </ConditionalDiv>
    )
}