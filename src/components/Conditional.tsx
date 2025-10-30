import type DefaultProps from "@/abstracts/props/DefaultProps";
import { Fragment } from "react/jsx-runtime";

/**
 * @since latest
 */
export default function Conditional({ rendered = true, ...props}: DefaultProps<HTMLDivElement>) {
    if (!rendered)
        return <Fragment />;

    return props.children;
}