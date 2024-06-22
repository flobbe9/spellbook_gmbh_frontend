import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import "../assets/styles/NavBar.css";
import DefaultProps, { getCleanDefaultProps } from "../abstract/DefaultProps";
import Flex from "./helpers/Flex";
import { getCssConstant, getCSSValueAsNumber, getJQueryElementById, getRandomString, includesIgnoreCaseTrim, log } from "../helpers/genericUtils";
import { Link } from "react-router-dom";
import NavMenu from "./NavMenu";
import useNavMenus from "../hooks/useNavMenus";
import { WPNavMenu } from "../abstract/WPNavMenu";
import { AppContext } from "./App";
import useBasicAuth from "../hooks/useBasicAuth";
import MobileNavMenu from "./MobileNavMenu";
import { LINK_DEFAULT_REL } from "../helpers/constants";


interface Props extends DefaultProps {

}


/**
 * @since 0.0.1
 */
// TODO
    // multiple menus???
export default function NavBar({...otherProps}: Props) {

    const { id, className, style, children } = getCleanDefaultProps(otherProps, "NavBar", true);

    const [navMenu1, setNavMenu1] = useState<WPNavMenu>(WPNavMenu.getDefaultInstance());
    const [navMenu2, setNavMenu2] = useState<WPNavMenu>(WPNavMenu.getDefaultInstance());

    const initNavBarHeight = getCSSValueAsNumber(getCssConstant("navBarHeight"), 2);
    
    const { logout } = useBasicAuth();
    const { isLoggedIn, toast } = useContext(AppContext);
    
    const componentRef = useRef(null);
    const mobileNavMenuContainerRef = useRef(null);
    const burgerButtonRef = useRef(null);

    const navMenus = useNavMenus();

    const context = {
        collapseAllMobileNavMenus,
        slideMobileNavBarUp
    }


    useEffect(() => {
        window.addEventListener("click", handleWindowClick);

        return () => {
            window.removeEventListener("click", handleWindowClick);
        }

    }, []);


    useEffect(() => {
        if (navMenus.length)
            setNavMenu1(navMenus[0]);

        if (navMenus.length > 1)
            setNavMenu2(navMenus[1]);

    }, [navMenus])


    function handleBurgerButtonClick(event): void {

        // case: nav items hidden
        if (!areMobileNavMenusVisible())
            slideNavMobileBarDown();

        else {
            collapseAllMobileNavMenus();
            slideMobileNavBarUp();
        }

        flipBurgerButton();
    }


    function slideNavMobileBarDown(): void {

        const navBar = $(componentRef.current!);

        const mobileNavMenuContainer = $(mobileNavMenuContainerRef.current!);
        const mobileNavMenuContainerHeight = mobileNavMenuContainer.outerHeight() || 0;

        navBar.animate(
            // slide down
            {"height": initNavBarHeight + mobileNavMenuContainerHeight},
            200, 
            "swing",
            () => {
                // make navbar height move with menu height
                mobileNavMenuContainer.css("position", "relative");
                navBar.css("height", "");
            }
        );
        
    }


    function slideMobileNavBarUp(): void {

        const navBar = $(componentRef.current!);

        const mobileNavMenuContainer = $(mobileNavMenuContainerRef.current!);

        navBar.animate(
            // slide down
            {"height": initNavBarHeight},
            200, 
            "swing",
            () => {
                mobileNavMenuContainer.css("position", "absolute");
            }
        );
    }


    /**
     * Hide all nav menu items (in mobile mode only). Does not resize nav bar height.
     */
    function collapseAllMobileNavMenus(): void {
        
        // slide all up
        $(".mobileNavMenuItemContainer").slideUp(200, "swing");

        // all icons to right
        $(".mobileNavMenuIcon").css("rotate", "-90deg");

        unHighlightAllNavMenuLabels();
    }

    
    function unHighlightAllNavMenuLabels(): void {

        $(".mobileNavMenuLabelText").css("color", "black");
        $(".mobileNavMenuIcon").css("color", "black");
    }


    /**
     * Rotates burger button (in mobile) by 180deg depending on the visibility of the mobile nav menus
     */
    function flipBurgerButton(): void {

        const burgerButton = $(burgerButtonRef.current!);

        burgerButton.animate(
            {"rotate": areMobileNavMenusVisible() ? "0deg" : "180deg"},
            200,
            "swing"
        );
    }


    function areMobileNavMenusVisible(): boolean {

        const mobileNavMenuContainer = $(mobileNavMenuContainerRef.current!);
        return mobileNavMenuContainer.css("position") !== "absolute";
    }


    function handleWindowClick(event): void {

        const eventTargetClassName = event.target.className;

        if (!includesIgnoreCaseTrim(eventTargetClassName || "", "dontHideMobileNavMenu")) {
            // case: mobile mode
            if (areMobileNavMenusVisible()) {
                slideMobileNavBarUp();
                collapseAllMobileNavMenus();
            }
        }
    }


    function handleLogout(event): void {

        logout();

        toast("Logout", "Du bist ausgeloggt.", "info", 3000);
    }


    const LogoutLink = (
        <>
            {isLoggedIn ?
                // Logout link
                <Flex 
                    onClick={handleLogout}
                    className="logoutLink"
                    verticalAlign="center"
                >
                    <span className="me-1 logoutLabel dontMarkText">Logout</span>
                    <i className="fa-solid fa-right-from-bracket logoutIcon"></i>
                </Flex>
                :
                // Login link
                <Link to="/login" className="logoutLink blackLink" rel={LINK_DEFAULT_REL}>
                    <span className="logoutLabel dontMarkText">Login</span>
                </Link>
            }
        </>
    );


    return (
        <NavBarContext.Provider value={context}>
            <div 
                id={id} 
                className={className}
                style={style}
                ref={componentRef}
            >
                <Flex className="navBarContainer" horizontalAlign="center" verticalAlign="center">
                    {/* Left */}
                    <Flex 
                        // hide if menu is empty
                        className={"navItem navItemLeft col-4" + (navMenu1.items.length === 0 ? " hidden" : "")} 
                        horizontalAlign="center"
                    >
                        {/* Menu1 */}
                        <Flex className="col-8" horizontalAlign="right">
                            <NavMenu id="1" wpNavMenu={navMenu1} />
                        </Flex>
                    </Flex>

                    {/* Center */}
                    <div className="navItem navItemCenter col-12 col-sm-4">
                        {/* Logo */}
                        <Link to="/" rel={LINK_DEFAULT_REL}>
                            <div className="flexCenter">
                                <img className="faviconTransparent dontMarkText" src="/img/companyNameTransparent.png" alt="Logo" height={120} />
                            </div>
                        </Link>

                        {/* Mobile NavMenus */}
                        <div className="mobileNavBarContainer pt-1">
                            {/* Burger Button */}
                            <Flex horizontalAlign="center" className="dontHideMobileNavMenu">
                                <i className="fa-solid fa-bars burgerButton dontHideMobileNavMenu mt-3 mb-3" onClick={handleBurgerButtonClick} ref={burgerButtonRef}></i>
                            </Flex>

                            <div className="mobileNavMenuContainer dontHideMobileNavMenu pt-1" ref={mobileNavMenuContainerRef}>
                                {/* Menus */}
                                <MobileNavMenu wpNavMenu={navMenu1} className="dontHideMobileNavMenu" />
                                <MobileNavMenu wpNavMenu={navMenu2} className="dontHideMobileNavMenu" />

                                {/* Logout */}
                                <div className="me-3 flexRight dontHideMobileNavMenu">{LogoutLink}</div>
                            </div>
                        </div>
                    </div>

                    {/* Right */}
                    <Flex 
                        // hide if menu is empty
                        className={"navItem navItemRight col-4" + (navMenu2.items.length === 0 ? " hidden" : "")}
                        horizontalAlign="center"
                    >
                        {/* Menu2 */}
                        <Flex className="col-5" horizontalAlign="center">
                            <NavMenu id="2" wpNavMenu={navMenu2} />
                        </Flex>

                        {/* Logout */}
                        <Flex 
                            className="logoutContainer col-5" 
                            verticalAlign="center" 
                            horizontalAlign="right"
                        >
                            {LogoutLink}
                        </Flex>
                    </Flex>
                </Flex>

                {children}
            </div>
        </NavBarContext.Provider>
    )
}


export const NavBarContext = createContext({
    collapseAllMobileNavMenus: () => {},
    slideMobileNavBarUp: () => {}
})