import React from "react";
import "../assets/styles/NavBar.css";
import DefaultProps, { getCleanDefaultProps } from "../abstract/DefaultProps";
import Sanitized from './helpers/Sanitized';


interface Props extends DefaultProps {

}


/**
 * @since 0.0.1
 */
export default function NavBar({...otherProps}: Props) {

    const { id, className, style, children } = getCleanDefaultProps(otherProps, "NavBar", true);

    return (
        <div 
            id={id} 
            className={className + " flexCenter"}
            style={style}
            >

            {/* Spielen */}
            <div className="navItem">
                <span className="me-2">Spielen</span>
                <i className="fa-solid fa-chevron-down"></i>

                {/* NavMenu */}
            </div>

            {/* Logo */}
            <div className="navItem navHeading">
                <div className="flexCenter">
                    {/* quotient of width/height should be ~1.69 */}
                    <img className="faviconTransparent" src="faviconTransparent.png" alt="Logo" height="50" width="85"/>
                </div>
                <div className="flexCenter mt-1">
                    {/* quotient of width/height should be ~5.92 */}
                    <img className="companyName" src="companyName.png" alt="Company name" height="30" width="177"/>
                </div>
            </div>

            {/* Kaufen */}
            <div className="navItem">
                <span className="me-2">Kaufen</span>
                <i className="fa-solid fa-chevron-down"></i>

                {/* NavMenu */}
            </div>
                
            {children}
        </div>
    )
}