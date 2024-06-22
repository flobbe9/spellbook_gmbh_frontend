import React, { useContext, useEffect, useRef } from "react";
import "../assets/styles/Footer.css";
import DefaultProps, { getCleanDefaultProps } from "../abstract/DefaultProps";
import Flex from "./helpers/Flex";
import { COMPANY_NAME, LINK_DEFAULT_REL, VERSION } from "../helpers/constants";
import CardTextBox from "./helpers/CardTextBox";
import { Link } from "react-router-dom";
import { getJQueryElementById, setCssConstant } from "../helpers/genericUtils";
import { AppContext } from "./App";


interface Props extends DefaultProps {

}


/**
 * @since 0.0.1
 */
// TODO: make footer open social links in app if installed
export default function Footer({...otherProps}: Props) {

    const { id, className, style, children } = getCleanDefaultProps(otherProps, "Footer", true);

    const componentRef = useRef(null);

    const { windowSize } = useContext(AppContext);

    
    useEffect(() => {
        setFooterHeightConstant();

    }, [windowSize]);


    /**
     * Init "footerHeight" css constant
     */
    function setFooterHeightConstant(): void {

        setCssConstant("footerHeight", $(componentRef.current!).outerHeight() + "px");
    }

// TODO: social links
    // icon link
    // link target
    // title

    return (
        <div 
            id={id} 
            className={className}
            style={style}
            ref={componentRef}
        >
            <Flex horizontalAlign="center">
                {/* Left */}
                <Flex className="leftNavItem col-5 col-lg-4" horizontalAlign="left">
                    <Link to="/impressum" className="link col-12 col-lg-4 col-xl-3 themeLink" rel={LINK_DEFAULT_REL}>Impressum</Link>
                    <Link to="/datenschutz" className="link col-12 col-lg-4 col-xl-3 themeLink" rel={LINK_DEFAULT_REL}>Datenschutz</Link>
                </Flex>
                    
                {/* Center */}
                <Flex className="middleNavItem col-2 col-lg-4" horizontalAlign="center" verticalAlign="start">
                    <Link to="/" rel={LINK_DEFAULT_REL}>
                        <img className="faviconTransparent dontMarkText" src="/img/companyNameTransparent.png" alt="company name" height="60"/>
                    </Link>
                </Flex>
                
                {/* Right */}
                <Flex className="rightNavItem col-5 col-lg-4" horizontalAlign="right">
                    <Flex className="col-12 col-lg-1 ms-2" horizontalAlign="right">
                        {/* TODO */}
                        {/* <a href="intent://instagram.com/#Intent;scheme=https;package=com.instagram.android;end"> */}
                        <a href="https://instagram.com/spellbook_2024" target="_blank" rel={LINK_DEFAULT_REL}>
                            <img 
                                src="/img/insta.png" 
                                className="dontMarkText footerIcon" 
                                title="instagram"
                                alt="instagram icon" 
                                height="25" 
                            />
                        </a>
                    </Flex>
                    <Flex className="col-12 col-lg-1 ms-2" horizontalAlign="right">
                        <a href="https://tiktok.com/@spellbooktcg" target="_blank" rel={LINK_DEFAULT_REL}>
                            <img 
                                src="/img/tiktok.png" 
                                className="dontMarkText footerIcon" 
                                title="tiktok"
                                alt="tiktok icon" 
                                height="25" 
                            />
                        </a>
                    </Flex>
                    <Flex className="col-12 col-lg-1 ms-2" horizontalAlign="right">
                        <a href="https://www.cardmarket.com/de/YuGiOh/Users/Spellbook" target="_blank" rel={LINK_DEFAULT_REL}>
                            <img 
                                src="/img/cardmarket.png" 
                                className="dontMarkText footerIcon" 
                                title="cardmarket"
                                alt="cardmarket icon" 
                                height="25" 
                            />
                        </a>
                    </Flex>

                    <Flex className="col-12 col-lg-2 ms-2" horizontalAlign="right">
                        v{VERSION}
                    </Flex>
                </Flex>
            </Flex>

            {children}
        </div>
    )
}