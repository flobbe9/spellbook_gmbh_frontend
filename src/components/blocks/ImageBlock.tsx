import React, { useEffect, useRef } from "react";
import "../../assets/styles/ImageBlock.css";
import { getCleanDefaultProps } from "../../abstract/props/DefaultProps";
import WPBlock from "../../abstract/wp/WPBlock";
import Sanitized from "../helpers/Sanitized";
import { log } from "../../helpers/genericUtils";
import BlockProps, { getCleanBlockProps } from "../../abstract/props/BlockProps";
import Flex from "../helpers/Flex";
import Block from "./Block";
import { parseWPAlignString } from "../../abstract/wp/WPBlockAttribute";


interface Props extends BlockProps {
}


/**
 * Serves as component for "core/image" block type.
 * 
 * @since 0.0.1
 */
export default function ImageBlock({wpBlock, mainTagNames, ...otherProps}: Props) {

    const { id, className, style, children } = getCleanBlockProps(otherProps, "ImageBlock");

    const { align } = wpBlock.attrs;
    const imageClass = wpBlock.attrs.className;

    const componentRef = useRef(null);

    // use variable?
    useEffect(() => {
        setFigureAlign();

    }, []);


    /**
     * Return ```marginLeft``` in case of ```align``` "right" and ```marginRight``` in case of ```align``` "left" .
     * 
     * @returns an object with only the margin prop depending on the alignment
     */
    function getMargin(): object {

        if (align === "right")
            return {marginLeft: "25px"}

        if (align === "left")
            return {marginRight: "25px"}

        return {};
    }


    /**
     * Set the "justifyContent" prop of all ```<figure>``` tags inside this block depending on ```align```.
     */
    function setFigureAlign(): void {

        let figureAlign = "";
        if (align === "left" || align === "right" || align === "center")
            figureAlign = align;

        $(componentRef.current!).find("figure").css("justifyContent", figureAlign);
    }


    return (
        <Flex 
            id={id} 
            className={className}
            style={{
                ...style,
                ...getMargin()
            }}
            horizontalAlign={parseWPAlignString(align || "")}
            ref={componentRef}
        >
            {/* InnerHTML */}
            <Sanitized
                className={imageClass + " dontMarkText"}
                dirtyHTML={wpBlock.innerHTML} 
                mainTagNames={mainTagNames}
            />
            
            {/* InnerBlocks */}
            <Block wpBlocks={wpBlock.innerBlocks} />
                
            {children}
        </Flex>
    )
}