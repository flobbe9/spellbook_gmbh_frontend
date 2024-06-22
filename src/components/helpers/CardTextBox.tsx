import React, { CSSProperties, useEffect, useRef, useState } from "react";
import "../../assets/styles/CardTextBox.css";
import DefaultProps, { getCleanDefaultProps } from "../../abstract/DefaultProps";
import { getCssConstant, getCSSValueAsNumber, log } from "../../helpers/genericUtils";
import SquareBox from "./SquareBox";


interface Props extends DefaultProps {
    squareBoxBackgroundColor?: string,
    /** Default is var(--boxShadow2) */
    boxShadow?: string,
    classNameOuterDiv?: string,
    styleOuterDiv?: CSSProperties | undefined
}


/**
 * Box designed to look similar to a playing card text box.
 * 
 * Props will be passed to an inner div
 * 
 * @since 0.0.2
 */
export default function CardTextBox({boxShadow, squareBoxBackgroundColor, classNameOuterDiv, styleOuterDiv, ...otherProps}: Props) {

    const { id, className, style, children } = getCleanDefaultProps(otherProps);
    /** The "bottom" attribute for the two bottom square boxes */
    const [bottomSquareBox, setBottomSquareBox] = useState(0);

    const cardTextBoxRef = useRef(null);

    const squareBoxSize = 9;


    useEffect(() => {
        updateBottomSquareBox();
    }, []);


    /**
     * Update the "bottom" attribute for the two bottom square boxes using the relativeContainer's height and padding.
     */
    function updateBottomSquareBox(): void {

        const currentBottomSquareBox = getCSSValueAsNumber($(cardTextBoxRef.current!).css("height"), 2);
        const relativeContainerPadding = getCSSValueAsNumber(getCssConstant("relativeContainerPadding"), 2);
        setBottomSquareBox(currentBottomSquareBox - squareBoxSize + relativeContainerPadding * 2);
    }


    return (
        <div className={"relativeContainer " + classNameOuterDiv} style={styleOuterDiv}>
            {/* Squareboxes on each corner */}
            <SquareBox top={0} left={0} backgroundColor={squareBoxBackgroundColor} size={squareBoxSize + "px"} style={{borderRadius: "2px"}}/>
            <SquareBox top={0} right={0} backgroundColor={squareBoxBackgroundColor} size={squareBoxSize + "px"} style={{borderRadius: "2px"}}/>
            <SquareBox top={bottomSquareBox} left={0} backgroundColor={squareBoxBackgroundColor} size={squareBoxSize + "px"} style={{borderRadius: "2px"}}/>
            <SquareBox top={bottomSquareBox} right={0} backgroundColor={squareBoxBackgroundColor} size={squareBoxSize + "px"} style={{borderRadius: "2px"}}/>
            
            <div 
                id={id} 
                ref={cardTextBoxRef}
                className={className + " CardTextBox"}
                style={{
                    ...style,
                    boxShadow: boxShadow
                }}
            >
                {children}
            </div>
        </div>
    )
}