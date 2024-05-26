import React, { useEffect, useState } from "react";
import "../assets/styles/NavBar.css";
import DefaultProps, { getCleanDefaultProps } from "../abstract/DefaultProps";
import Flex from "./helpers/Flex";
import { getJQueryElementById, includesIgnoreCaseTrim, log } from "../utils/genericUtils";
import CardTextBox from "./helpers/CardTextBox";
import { Link } from "react-router-dom";
import NavMenu from "./NavMenu";
import useNavMenus from "../hooks/useNavMenus";
import { WPNavMenu } from "../abstract/WPNavMenu";


interface Props extends DefaultProps {

}


/**
 * @since 0.0.1
 */
export default function NavBar({...otherProps}: Props) {

    const { id, className, style, children } = getCleanDefaultProps(otherProps, "NavBar", true);

    const [navMenu1, setNavMenu1] = useState<WPNavMenu>(WPNavMenu.getDefaultInstance());
    const [navMenu2, setNavMenu2] = useState<WPNavMenu>(WPNavMenu.getDefaultInstance());

    const navMenus = useNavMenus();


    useEffect(() => {
        window.addEventListener("click", handleWindowClick);
        window.addEventListener("keydown", handleWindowKeyDown);

        return () => {
            window.removeEventListener("click", handleWindowClick);
            window.removeEventListener("keydown", handleWindowKeyDown);
        }
    }, []);
    

    useEffect(() => {
        if (navMenus.length)
            setNavMenu1(navMenus[0]);

        if (navMenus.length > 1)
            setNavMenu2(navMenus[1]);

    }, [navMenus])


    function toggleNavMenu(event, id: string): void {

        const navMenu = getJQueryElementById(id);
        if (!navMenu)
            return;

        navMenu.slideToggle(200, "swing");
    }


    function handleWindowClick(event): void {

        const eventClassName = event.target.className as string;

        slideUpNavMenuOnClickOutside("NavMenuSpielen", "dontHideNavMenuSpielen", eventClassName);
        slideUpNavMenuOnClickOutside("NavMenuKaufen", "dontHideNavMenuKaufen", eventClassName);
    }

    
    function handleWindowKeyDown(event): void {

        const eventClassName = event.target.className as string;
        const key = event.key;

        if (key === "Escape") {
            slideUpNavMenuOnClickOutside("NavMenuSpielen", "dontHideNavMenuSpielen", eventClassName);
            slideUpNavMenuOnClickOutside("NavMenuKaufen", "dontHideNavMenuKaufen", eventClassName);
        }
    }


    /**
     * Slide up given nav menu unless the nav menu class name is included in event target class name.
     * 
     * @param navMenuId id of nav menu to slide up
     * @param navMenuClassName class name to compare to event class name
     * @param eventTargetClassName class name of ```event.target```
     */
    function slideUpNavMenuOnClickOutside(navMenuId: string, navMenuClassName: string, eventTargetClassName: string): void {

        const navMenu = getJQueryElementById(navMenuId);
        if (!navMenu)
            return;

        if (!includesIgnoreCaseTrim(eventTargetClassName, navMenuClassName))
            navMenu.slideUp(200, "swing");
    }


    return (
        <div 
            id={id} 
            className={className}
            style={style}
        >
            <CardTextBox boxShadow="var(--boxShadow)" squareBoxBackgroundColor="var(--themeColor)">
                {/* Navbar content */}
                <Flex className="navBarContainer" horizontalAlign="center" verticalAlign="center">
                    {/* Spielen */}
                    {/* hide if is empty */}
                    <div className={"navItem" + (navMenu1.items.length === 0 ? " hidden" : "")}>
                        <div className="themeLink dontHideNavMenuSpielen" onClick={(event) => toggleNavMenu(event,  "NavMenuSpielen")}>
                            <span className="me-2 dontMarkText dontHideNavMenuSpielen">{navMenu1.name}</span>
                            <i className="fa-solid fa-chevron-down dontHideNavMenuSpielen"></i>
                        </div>

                        {/* NavMenu */}
                        <NavMenu id="Spielen" className="dontHideNavMenuSpielen" wpNavMenu={navMenu1} />
                    </div>

                    {/* Logo */}
                    <div className="navItem navHeading">
                        <Link to="/">
                            <div className="flexCenter">
                                {/* quotient of width/height should be ~1.69 */}
                                <img className="faviconTransparent dontMarkText" src="/faviconTransparent.png" alt="Logo" height="50" width="85"/>
                                {/* <img className="faviconTransparent dontMarkText" src="/favicon.ico" alt="Logo" height="50" width="85" /> */}
                                </div>
                            <div className="flexCenter mt-1">
                                {/* quotient of width/height should be ~5.92 */}
                                <img className="companyName dontMarkText" src="/companyName.png" alt="Company name" height="30" width="177"/>
                            </div>
                        </Link>
                    </div>

                    {/* Kaufen */}
                    {/* hide if is empty */}
                    <div className={"navItem" + (navMenu2.items.length === 0 ? " hidden" : "")}>
                        <div className="themeLink dontHideNavMenuKaufen" onClick={(event) => toggleNavMenu(event,  "NavMenuKaufen")}>
                            <span className="me-2 dontMarkText dontHideNavMenuKaufen">{navMenu2.name}</span>
                            <i className="fa-solid fa-chevron-down dontHideNavMenuKaufen"></i>
                        </div>

                        {/* NavMenu */}
                        <NavMenu id="Kaufen" className="dontHideNavMenuKaufen" wpNavMenu={navMenu2} />
                    </div>
                        
                    {children}
                </Flex>
            </CardTextBox>
        </div>
    )
}