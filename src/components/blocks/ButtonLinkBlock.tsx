import { parseWpButtonLinkBlock } from "@/abstracts/backendDefinitions/WpButtonLinkBlock";
import { useBlockProps } from "@/hooks/useBlockProps";
import type { BlockProps } from "../Block";
import Conditional from "../Conditional";
import type { MouseEvent } from "react";
import { BASE_URL } from "@/helpers/constants";
import { useNavigate } from "react-router-dom";

/**
 * Styled that navigates on click, navigate without refresh if possible.
 * 
 * @since latest
 */
export default function ButtonLinkBlock(props: BlockProps) {
    const navigate = useNavigate();

    const componentName = "ButtonLinkBlock";
    const { children, parsedWpBlock, style = {}, ...otherProps } = useBlockProps(componentName, props, parseWpButtonLinkBlock);

    const { open_in_new_tab, label, background_color, external_url, internal_page, scope } = parsedWpBlock;

    function handleClick(_event: MouseEvent): void {
        let href = "";
        if (scope === "internal") {
            if (open_in_new_tab)
                href = `${BASE_URL}${internal_page}`;
            else
                href = `${internal_page}`;

        } else
            href = external_url;

        if (open_in_new_tab || scope === "external")
            window.open(href, open_in_new_tab ? "_blank" : "_self");
        else
            navigate(href);
    }

    return (
        <Conditional {...otherProps}>
            <button
                style={{
                    ...style,
                    backgroundColor: background_color
                }}
                onClick={handleClick}
                {...otherProps}
            >
                {label}
                {children}
            </button>
        </Conditional>
    )
}