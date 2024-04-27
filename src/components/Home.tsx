import React from "react";
import "../assets/styles/Home.css";
import DefaultProps, { getCleanDefaultProps } from "../abstract/DefaultProps";


interface Props extends DefaultProps {

}


/**
 * 
 * @returns @since 0.0.1
 */
export default function Home({...otherProps}: Props) {

    const { id, className, style, children } = getCleanDefaultProps(otherProps, "Home");

    return (
        <div 
            id={id} 
            className={className}
            style={style}
            >
                <p>content here...</p>
            {children}
        </div>
    )
}