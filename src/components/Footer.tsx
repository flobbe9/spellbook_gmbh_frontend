import type DefaultProps from "@/abstracts/props/DefaultProps";
import { useDefaultProps } from "@/hooks/useDefaultProps";
import ConditionalDiv from "./ConditionalDiv";

/**
 * @since latest
 */
export default function Footer(props: DefaultProps) {
    const componentName = "Footer";
    const { children, ...otherProps } = useDefaultProps(componentName, props);

    return (
        <ConditionalDiv {...otherProps}>
            Footer
        </ConditionalDiv>
    )
}