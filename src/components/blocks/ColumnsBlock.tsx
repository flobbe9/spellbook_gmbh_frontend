import React, { CSSProperties } from "react";
import "../../assets/styles/ColumnsBlock.css";
import DefaultProps, { getCleanDefaultProps } from "../../abstract/DefaultProps";
import Flex from "../helpers/Flex";
import Sanitized from '../helpers/Sanitized';
import WPBlock from "../../abstract/wp/WPBlock";
import Block from "./Block";
import sanitize from "sanitize-html";
import { DEFAULT_HTML_SANTIZER_OPTIONS } from "../../utils/constants";
import parse, { Element } from "html-react-parser";
import { getHTMLStringAttribs, log, parseCSSStringToJson } from "../../utils/genericUtils";


interface Props extends DefaultProps {
    wpBlock: WPBlock
}


/**
 * Serves as container for ```ColumnBlock``` blocks. Wont render the ```innerHtml``` here, since it's trivial anyway.
 * 
 * @since 0.0.1
 */
export default function ColumnsBlock({wpBlock, ...otherProps}: Props) {

    const { id, className, style, children } = getCleanDefaultProps(otherProps, "ColumnsBlock");
    const { verticalAlignment, align, isStackedOnMobile = true } = wpBlock.attrs;


    function isFullWindowWidth(): boolean {

        return align === "full";
    }


    function getClassName(): string {

        let newClassName = className || "";
        if (isFullWindowWidth())
            newClassName += " fullWindowWidth ";

        newClassName += getHTMLStringAttribs(wpBlock.innerHTML).className || "";
        
        return newClassName;
    }


    function getId(): string {

        let newId = id || "";

        newId += getHTMLStringAttribs(wpBlock.innerHTML).id || "";

        return newId;
    }


    function getStyle(): CSSProperties {

        let style = getHTMLStringAttribs(wpBlock.innerHTML).style;
        if (!style)
            return {};

        return parseCSSStringToJson(style);
    }


    return (
        <Flex 
            id={getId()}
            className={getClassName()}
            style={{
                ...style,
                ...getStyle(),
                alignItems: verticalAlignment,
                flexWrap: isStackedOnMobile ? "wrap" : "nowrap",
            }}
            horizontalAlign="center"
        > 
            <Block wpBlocks={wpBlock.innerBlocks} />

            {children}
        </Flex>
    )
}