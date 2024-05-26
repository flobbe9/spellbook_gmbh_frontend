import React from "react";
import "../assets/styles/Footer.css";
import DefaultProps, { getCleanDefaultProps } from "../abstract/DefaultProps";
import Flex from "./helpers/Flex";
import { COMPANY_NAME, VERSION } from "../utils/constants";
import CardTextBox from "./helpers/CardTextBox";
import { Link } from "react-router-dom";


interface Props extends DefaultProps {

}


/**
 * @since 0.0.1
 */
export default function Footer({...otherProps}: Props) {

    const { id, className, style, children } = getCleanDefaultProps(otherProps, "Footer", true);

    // icon link
    // link target
    // title

    return (
        <div 
            id={id} 
            className={className}
            style={style}
        >
            <CardTextBox squareBoxBackgroundColor="var(--themeColor2)">
                <Flex horizontalAlign="center" verticalAlign="start">
                    {/* Left */}
                    <Flex className="col-4 leftNavItem" verticalAlign="center">
                        <Link to="/impressum" className="link me-4 themeLink">Impressum</Link>
                        <Link to="/datenschutz" className="link me-4 themeLink">Datenschutz</Link>
                    </Flex>
                    
                    {/* Center */}
                    <Flex className="middleNavItem col-4" horizontalAlign="center" verticalAlign="center">
                        <Link to="/">
                            <img className="companyName dontMarkText" src="/companyName.png" alt="Company name" height="20"/>
                        </Link>
                    </Flex>
                    
                    {/* Right */}
                    <Flex className="rightNavItem col-4" horizontalAlign="right" verticalAlign="center">
                        <a href="">
                            <img src="/insta.png" className="me-3 dontMarkText" alt="instagram icon" height="25" />
                        </a>
                        <a href="">
                            <img src="/twitter.png" className="me-5 dontMarkText" alt="twitter icon" height="25" />
                        </a>
                        v{VERSION}
                    </Flex>
                </Flex>

                {children}
            </CardTextBox>
        </div>
    )
}