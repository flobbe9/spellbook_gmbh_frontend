import React, { useContext, useEffect, useRef, useState } from "react";
import "../assets/styles/MobileNavMenu.css";
import DefaultProps, { getCleanDefaultProps } from "../abstract/DefaultProps";
import { WPNavMenu } from "../abstract/WPNavMenu";
import NavMenuItem from "./NavMenuItem";
import { getRandomString, log, logWarn } from "../utils/genericUtils";
import { NavBarContext } from "./Navbar";


interface Props extends DefaultProps {
    wpNavMenu: WPNavMenu
}


/**
 * One nav menu (label and items) displayed in the navbar only in mobile mode. See also {@link WPNavMenu}
 * 
 * @since 0.1.0
 */
export default function MobileNavMenu({wpNavMenu, ...otherProps}: Props) {

    const { id, className, style, children } = getCleanDefaultProps(otherProps, "MobileNavMenu");

    const [navMenuItems, setWpNavMenuItems] = useState<(JSX.Element | undefined)[]>([]);

    const mobileNavMenuItemContainerRef = useRef(null);
    const mobileNavMenuLabelTextRef = useRef(null);
    const mobileNavMenuIconRef = useRef(null);

    const { collapseAllMobileNavMenus, slideMobileNavBarUp } = useContext(NavBarContext);


    useEffect(() => {
        if (wpNavMenu)
            setWpNavMenuItems(mapNavMenuItems());
        
    }, [wpNavMenu]);


    function handleNavMenuLabelClick(event): void {

        const mobileNavMenuItemContainer = $(mobileNavMenuItemContainerRef.current!);
        const isVisible = mobileNavMenuItemContainer.is(":visible");

        collapseAllMobileNavMenus();

        // case: was not visible
        if (!isVisible) {
            showNavMenu();
            rotateIconPointDown();
            highlightNavMenuLabel();
        }
    }


    function highlightNavMenuLabel(): void {

        $(mobileNavMenuLabelTextRef.current!).css("color", "var(--themeColor)");
        $(mobileNavMenuIconRef.current!).css("color", "var(--themeColor)");
    }


    function rotateIconPointDown(): void {

        $(mobileNavMenuIconRef.current!).css("rotate", "0deg")
    }


    function showNavMenu(): void {

        $(mobileNavMenuItemContainerRef.current!).slideDown(200, "swing");
    }


    function mapNavMenuItems(): JSX.Element[] {

        // check items
        if (!wpNavMenu.items || !wpNavMenu.items.length) 
            return [];
        
        return wpNavMenu.items.map(wpNavMenuItem =>
            <NavMenuItem 
                key={getRandomString()} 
                className="dontHideMobileNavMenu"
                wpNavMenuItem={wpNavMenuItem} 
                linkClassName="themeLink" 
                onLinkClick={() => {
                    slideMobileNavBarUp();
                    collapseAllMobileNavMenus();
                }}
            />)
    }


    return (
        <div 
            id={id} 
            className={className + (!navMenuItems.length ? " hidden" : "")}
            style={style}
        >
            {/* Label */}
            <div className="mobileNavMenuLabel dontHideMobileNavMenu" onClick={handleNavMenuLabelClick}>
                <i className="fa-solid fa-chevron-down mobileNavMenuIcon m-2 ms-3 dontHideMobileNavMenu" ref={mobileNavMenuIconRef}></i>
                <span className="me-2 dontMarkText mobileNavMenuLabelText dontHideMobileNavMenu" ref={mobileNavMenuLabelTextRef}>{wpNavMenu.name}</span>
            </div>

            {/* Menu Items */}
            <div className="mobileNavMenuItemContainer" ref={mobileNavMenuItemContainerRef}>
                {navMenuItems}
            </div>
                
            {children}
        </div>
    )
}