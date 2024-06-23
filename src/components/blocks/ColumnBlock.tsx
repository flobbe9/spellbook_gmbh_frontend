import React, { CSSProperties, useContext, useEffect, useRef } from "react";
import "../../assets/styles/ColumnBlock.css";
import DefaultProps, { getCleanDefaultProps } from "../../abstract/props/DefaultProps";
import Flex from "../helpers/Flex";
import WPBlock from "../../abstract/wp/WPBlock";
import Block from "./Block";
import { parseWPAlignString } from "../../abstract/wp/WPBlockAttribute";
import { getCSSValueAsNumber, getHTMLStringAttribs, isBlank, isNumberFalsy, log, logWarn, parseCSSStringToJson } from "../../helpers/genericUtils";
import { TextAlign } from "../../abstract/CSSTypes";
import { AppContext } from "../App";


interface Props extends DefaultProps {
    wpBlock: WPBlock
}


/**
 * @since 0.0.1
 */
export default function ColumnBlock({wpBlock, ...otherProps}: Props) {

    const { id, className, style, children } = getCleanDefaultProps(otherProps, "ColumnBlock");
    const { verticalAlignment, width, columnIndex, totalNumColumnBlocks = 1 } = wpBlock.attrs;

    const componentRef = useRef(null);

    const { getDeviceWidth } = useContext(AppContext);


    useEffect(() => {
        initPadding();

    }, []);


    /**
     * Adjust padding of <ColumnBlock> depending on it's index in <ColumnsBlock>. 
     */
    function initPadding(): void {

        // case: no column index
        if (isNumberFalsy(columnIndex))
            return;

        const thisColumn = $(componentRef.current!);
        const { isMobileWidth, isTabletWidth, isDesktopWidth } = getDeviceWidth();
        
        // case: mobile
        if (isMobileWidth) {
            $(thisColumn).css("paddingLeft", 0);
            $(thisColumn).css("paddingRight", 0);

        // case: tablet (depends on Block.tsx col-md-6)
        } else if (isTabletWidth) {
            // case: even column
            if (columnIndex! % 2 === 0)
                $(thisColumn).css("paddingLeft", 0);

            // case: uneven column
            if (columnIndex! % 2 === 1)
                $(thisColumn).css("paddingRight", 0);

        // case: desktop
        } else if (isDesktopWidth) {
            // case: first column
            if (columnIndex === 0)
                $(thisColumn).css("paddingLeft", 0);

            // case: last column
            if (columnIndex === totalNumColumnBlocks - 1) {
                $(thisColumn).css("paddingRight", 0);
            }
        }
    }


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


    /**
     * @returns className for ".columnBlockContainer"
     */
    function getContainerClassName(): string {

        let newClassName = className || "";

        newClassName += getHTMLStringAttribs(wpBlock.innerHTML).className || "";
        
        return newClassName;
    }
    

    function getClassName(): string {

        let newClassName = className || "";

        // case: width is present
        if (!isBlank(width)) {
            // remove default col-lg- class
            newClassName = newClassName.replaceAll("col-lg-", " ");
            // add custom col-lg- class
            newClassName += " " + getBootstrapClass();
        }

        return newClassName;
    }


    function getId(): string {

        let newId = id || "";

        newId += getHTMLStringAttribs(wpBlock.innerHTML).id || "";

        return newId;
    }


    function getWidth(): string | undefined {

        // case: is handled by getBootstrapClass()
        if (width?.endsWith("%"))
            return "";

        return width;
    }


    /**
     * @returns the number appended to the bootstrap class "col" depending on this blocks ```width``` 
     * (e.g. ```width = 25%``` => "col-3"). Return ```NaN``` if ```width``` is blank
     */
    function getBootstrapColNumber(): number {

        // case: no specific width
        if (isBlank(width))
            // let <Block> handle this
            return NaN;

        const widthNumber = getCSSValueAsNumber(width!, 1);
        // should not happen
        if (isNumberFalsy(widthNumber)) {
            logWarn("Failed to get bootstrap col number for Column Block from " + width);
            return NaN;
        }

        return Math.ceil(widthNumber * 12 / 100);
    }   


    /**
     * @returns the "col-" class depending on the ```width```
     */
    function getBootstrapClass(): string {

        const bootstrapColNumber = getBootstrapColNumber();
        if (isNumberFalsy(bootstrapColNumber))
            return "";

        return `col-lg-${bootstrapColNumber}`;
    }


    return (
        <Flex 
            id={getId()}
            className={getClassName()}
            style={{
                ...style,
                width: getWidth()
            }}
            verticalAlign={parseWPAlignString(verticalAlignment || "")}
            ref={componentRef}
        > 
            <Flex 
                className={"fullWidth columnBlockContainer " + getContainerClassName()} 
                disableFlex={!isFlex()} 
                flexDirection={isReverse() ? "row-reverse" : "row"}
            >
                <Block className="flex1" wpBlocks={wpBlock.innerBlocks} />

                {children}
            </Flex>
        </Flex>
    )
}