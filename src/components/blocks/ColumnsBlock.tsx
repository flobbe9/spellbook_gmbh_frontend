import React, { CSSProperties, useEffect, useRef, useState } from "react";
import "../../assets/styles/ColumnsBlock.css";
import DefaultProps, { getCleanDefaultProps } from "../../abstract/DefaultProps";
import Flex from "../helpers/Flex";
import WPBlock from "../../abstract/wp/WPBlock";
import Block from "./Block";
import { getHTMLStringAttribs, isBlank, log, parseCSSStringToJson } from "../../helpers/genericUtils";


interface Props extends DefaultProps {
    wpBlock: WPBlock,
    /** The numer of innerBlocks with name "core/column" */
    numColumnBlocks: number
}


/**
 * Serves as container for ```ColumnBlock``` blocks. Wont render the ```innerHtml``` here, since it's trivial anyway.
 * 
 * @since 0.0.1
 */
export default function ColumnsBlock({wpBlock, numColumnBlocks, ...otherProps}: Props) {

    const { id, className, style, children } = getCleanDefaultProps(otherProps, "ColumnsBlock");
    const { verticalAlignment, align, isStackedOnMobile = true } = wpBlock.attrs;

    const componentRef = useRef(null);


    function getClassName(): string {

        let newClassName = className || "";

        newClassName += getHTMLStringAttribs(wpBlock.innerHTML).className || "";
        
        return newClassName;
    }


    function getContainerClassName(): string {

        let newClassName = "";

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


    /**
     * @returns bootrap "col-" class name for child all ```<ColumnBlock>``` assuming same width
     */
    function getColumnBlockBootstrapClassname(): string {

        const numCols = numColumnBlocks;
        if (numCols === 0)
            return "";

        return `col-lg-${Math.floor(12 / numColumnBlocks)}`;
    }


    return (
        <Flex 
            id={getId()}
            className={getClassName()}
            style={{
                ...style,
                ...getStyle(),
                alignItems: verticalAlignment,
            }}
            horizontalAlign="center"
            ref={componentRef}
        > 
            <Flex className={"columnsBlockContainer  " + getContainerClassName()} flexWrap={isStackedOnMobile ? "wrap" : "nowrap"}>
                {/* all inner <ColumnBlock> components */}
                <Block wpBlocks={wpBlock.innerBlocks} className={getColumnBlockBootstrapClassname()} />

                {children}
            </Flex>
        </Flex>
    )
}