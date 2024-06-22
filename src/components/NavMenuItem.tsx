import React from "react";
import "../assets/styles/NavMenuItem.css";
import { Link } from "react-router-dom";
import DefaultProps, { getCleanDefaultProps } from "../abstract/DefaultProps";
import { LINK_DEFAULT_REL, PROTOCOL } from "../helpers/constants";
import { isBlank, log } from "../helpers/genericUtils";
import { WPNavMenuItem } from "../abstract/WPNavMenuItem";


interface Props extends DefaultProps {
    wpNavMenuItem: WPNavMenuItem,
    linkClassName?: string,
    onLinkClick?: (event?) => void
}


/**
 * One item (maybe a link or text) inside a NavMenu.
 * 
 * @since 0.0.1
 */
export default function NavMenuItem({wpNavMenuItem, linkClassName, onLinkClick, ...otherProps}: Props) {

    const { id, className, style, children } = getCleanDefaultProps(otherProps, "NavMenuItem");

    const { url, target, title, isInternalLink } = wpNavMenuItem;


    /**
     * @returns img tag wrapped around an <a> tag (for an external url) or a <Link> tag (for an internal url)
     */
    function returnWithLink(content: JSX.Element): JSX.Element {

        // case: no url
        if (isBlank(url))
            return content;

        // case: external url
        if (!isInternalLink)
            return (
                <a 
                    className={linkClassName} 
                    href={url} 
                    target={target} 
                    rel={LINK_DEFAULT_REL}
                    onClick={onLinkClick}
                >
                    {content}
                </a>)

        // case: internal url
        return (
            <Link 
                className={linkClassName} 
                to={url!} 
                target={target} 
                rel={LINK_DEFAULT_REL}
                onClick={onLinkClick}
            >
                {content}
            </Link>
        )
    }


    return (
        <div 
            id={id}
            className={className}
            style={style}
        >
            {returnWithLink(<span>{title}</span>)}

            {children}
        </div>
    );
}