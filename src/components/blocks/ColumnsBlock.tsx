import React, { CSSProperties, useEffect, useRef, useState } from "react";
import "../../assets/styles/ColumnsBlock.css";
import { getCleanDefaultProps } from "../../abstract/props/DefaultProps";
import Flex from "../helpers/Flex";
import Block from "./Block";
import { getHTMLStringAttribs, isBlank, log, parseCSSStringToJson } from "../../helpers/genericUtils";
import BlockProps from "../../abstract/props/BlockProps";


interface Props extends BlockProps {
}


/**
 * Serves as container for ```ColumnBlock``` blocks. Wont render the ```innerHtml``` here, since it's trivial anyway.
 * 
 * @since 0.0.1
 */
export default function ColumnsBlock({wpBlock, ...otherProps}: Props) {

    const { id, className, style, children } = getCleanDefaultProps(otherProps, "ColumnsBlock");
    const { verticalAlignment, isStackedOnMobile = true } = wpBlock.attrs;

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
                <Block wpBlocks={wpBlock.innerBlocks} />

                {children}
            </Flex>
        </Flex>
    )
}