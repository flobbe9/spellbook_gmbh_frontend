import React from "react";
import { Link } from "react-router-dom";
import DefaultProps, { getCleanDefaultProps } from "../../abstract/DefaultProps";
import { LINK_DEFAULT_REL, PROTOCOL } from "../../utils/constants";
import { isBlank } from "../../utils/genericUtils";


interface ImageProps extends DefaultProps {
    src: string,
    index: number,
    link?: string,
    linkTarget?: string,
    alt?: string,
    height?: number,
    title?: string,
    width?: number,
}

/**
 * One Image in the slider. Pass the same height as for the container.
 * 
 * @since 0.0.1
 */
export default function ImageLink({src, alt, title, link, linkTarget, height, width, index, ...otherProps}: ImageProps) {

    const { id, className, style } = getCleanDefaultProps(otherProps, "ImageLink");


    /**
     * @returns given ```title``` or image name
     */
    function getTitle(): string {

        if (title)
            return title;

        if (isBlank(src))
            return "";

        const splitSrc = src.split("/");

        return splitSrc[splitSrc.length - 1]
    }


    /**
     * 
     * @returns given ```alt``` or index of image with some text
     */
    function getAlt(): string {

        if (alt)
            return alt;

        return `Bild Nummer ${index + 1} im Slider`;
    }


    function getImgTag(): JSX.Element {

        return <img 
            id={id}
            className={className + " dontMarkText"}
            style={style}
            src={src}
            alt={getAlt()}
            title={getTitle()}
            height={height}
            width={width}
        />
    }


    /**
     * @returns img tag wrapped around an <a> tag (for an external link) or a <Link> tag (for an internal link)
     */
    function returnWithLink(): JSX.Element {

        // case: no link
        if (isBlank(link))
            return getImgTag();

        // case: external link
        if (link!.startsWith(PROTOCOL))
            return (
                <a href={link} target={linkTarget} rel={LINK_DEFAULT_REL} title={getTitle() + "-Link"}>
                    {getImgTag()}
                </a>)

        // case: internal link
        return (
            <Link to={link!} target={linkTarget} rel={LINK_DEFAULT_REL} title={getTitle() + "-Link"}>
                {getImgTag()}
            </Link>
        )
    }


    return returnWithLink();
}