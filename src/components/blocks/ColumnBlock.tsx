import React, { CSSProperties } from "react";
import "../../assets/styles/ColumnBlock.css";
import DefaultProps, { getCleanDefaultProps } from "../../abstract/DefaultProps";
import Flex from "../helpers/Flex";
import Sanitized from '../helpers/Sanitized';
import WPBlock from "../../abstract/wp/WPBlock";
import Block from "./Block";
import { parseWPAlignString } from "../../abstract/wp/WPBlockAttribute";
import { getHTMLStringAttribs, log, parseCSSStringToJson } from "../../utils/genericUtils";
import { TextAlign } from "../../abstract/CSSTypes";
import sanitize from "sanitize-html";
import parse, { Element } from "html-react-parser";
import { DEFAULT_HTML_SANTIZER_OPTIONS } from "../../utils/constants";


interface Props extends DefaultProps {
    wpBlock: WPBlock
}


/**
 * @since 0.0.1
 */
export default function ColumnBlock({wpBlock, ...otherProps}: Props) {

    const { id, className, style, children } = getCleanDefaultProps(otherProps, "ColumnBlock");
    const { verticalAlignment, width } = wpBlock.attrs;


    /**
     * @returns true if the first image block of ```innerBlocks``` has an ```align``` prop of "left" or "right" else false.
     */
    function isFlex(): boolean {

        const imageAlignment = getImageAlign();

        // case: use flex only for these
        if (imageAlignment === "left" || imageAlignment === "right")
            return true;

        return false;
    }


    /**
     * @returns the horizontal align of the first image block inside ```innerBlocks``` or ```undefined``` if no image block is present
     */
    function getImageAlign(): TextAlign | undefined {

        const imageBlock = wpBlock.innerBlocks.find(wpBlock => wpBlock.blockName === "core/image");
        // case: no image in this column
        if (!imageBlock)
            return undefined;

        const imageAlignment = imageBlock.attrs.align;
        // case: align set to "none" in wp
        if (!imageAlignment)
            return undefined;

        // case: align not compatible with "justify-content"
        if (imageAlignment === "full")
            return undefined;

        return imageAlignment;
    }


    function isReverse(): boolean {

        return getImageAlign() === "right";
    }



    function getClassName(): string {

        let newClassName = className || "";

        newClassName += getHTMLStringAttribs(wpBlock.innerHTML).className || "";
        
        return newClassName;
    }


    function getId(): string {

        let newId = id || "";

        newId += getHTMLStringAttribs(wpBlock.innerHTML).id || "";

        return newId;
    }


    function getFlex1(): string {

        return width ? "" : " flex1"
    }
    

    return (
        <Flex 
            id={getId()}
            className={className + getFlex1()}
            style={{
                ...style,
                width: width
            }}
            verticalAlign={parseWPAlignString(verticalAlignment || "")}
        > 
            <Flex 
                className={"fullWidth columnBlockContainer " + getClassName()} 
                disableFlex={!isFlex()} 
                flexDirection={isReverse() ? "row-reverse" : "row"}
            >
                <Block className="flex1" wpBlocks={wpBlock.innerBlocks} />

                {children}
            </Flex>
        </Flex>
    )
}