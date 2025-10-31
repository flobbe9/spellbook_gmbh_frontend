import type DefaultProps from "@/abstracts/props/DefaultProps";
import { useDefaultProps } from "@/hooks/useDefaultProps";
import ConditionalDiv from "./ConditionalDiv";

interface Props extends DefaultProps<HTMLDivElement> {
    mode: "window-width" | "margin-auto"
}

/**
 * @since latest
 */
export default function BlockDimensions({mode, ...props}: Props) {
    const componentName = "BlockDimensions";
    const { className, children, ...otherProps } = useDefaultProps(componentName, props);

    return (
        <ConditionalDiv className={`${className} ${className}-${mode}`} {...otherProps}>
            {children}
        </ConditionalDiv>
    )
}
