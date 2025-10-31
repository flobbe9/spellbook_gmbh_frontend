import type DefaultProps from "@/abstracts/props/DefaultProps";
import { Fragment } from "react/jsx-runtime";

/**
 * Renders no container around children, renders a fragment if `rendered = false`.
 * 
 * @since latest
 */
export default function Conditional({ rendered = true, children }: DefaultProps<HTMLDivElement>) {
    if (!rendered)
        return <Fragment />;

    return children;
}