import React, { useEffect, useRef, useState } from "react";
import "../assets/styles/NavMenu.css";
import DefaultProps, { getCleanDefaultProps } from "../abstract/DefaultProps";
import { getJQueryElementById, getRandomString, includesIgnoreCaseTrim, isBlank, log } from "../utils/genericUtils";
import NavMenuItem from "./NavMenuItem";
import { WPNavMenu } from "../abstract/WPNavMenu";


interface Props extends DefaultProps {
    wpNavMenu: WPNavMenu
}


/**
 * Menu (label and box with menu items) that slides down in ```<NavBar>```. See also {@link WPNavMenu}
 * 
 * @since 0.0.2
 */
export default function NavMenu({wpNavMenu, ...otherProps}: Props) {

    const { id, className, style, children } = getCleanDefaultProps(otherProps, "NavMenu");

    const [navMenuItems, setWpNavMenuItems] = useState<(JSX.Element | undefined)[]>([]);

    const navMenuItemsContainerRef = useRef(null);


    useEffect(() => {
        window.addEventListener("click", handleWindowClick);
        window.addEventListener("keydown", handleWindowKeyDown);

        return () => {
            window.removeEventListener("click", handleWindowClick);
            window.removeEventListener("keydown", handleWindowKeyDown);
        }
    }, []);


    useEffect(() => {
        if (wpNavMenu)
            setWpNavMenuItems(mapNavMenuItems());
        
    }, [wpNavMenu]);


    /**
     * @returns array of WPNavMenuItems as ```<NavMenuItem>``` component, sorted by ```menu_order```
     */
    function mapNavMenuItems(): (JSX.Element | undefined)[] {

        if (!wpNavMenu || !Array.isArray(wpNavMenu.items))
            return [];

        // sort by menu_order
        const wpNavMenuItems = wpNavMenu.items ? wpNavMenu.items.sort((a, b) => a.menu_order - b.menu_order) : [];

        return wpNavMenuItems.map(wpNavMenuItem => 
            <NavMenuItem 
                key={getRandomString()} 
                className="dontHideNavMenu"
                wpNavMenuItem={wpNavMenuItem} 
                linkClassName="themeLink" 
            />);
    }


    function handleNavMenuLabelClick(event): void {
        
        const navMenuItemsContainer = $(navMenuItemsContainerRef.current!);

        const isVisible = navMenuItemsContainer.is(":visible");

        // hide all nav menus
        $(".navMenuItemsContainer").slideUp(200, "swing");
        
        // case: is visible
        if (!isVisible)
            showNavMenu();
    }

    
    function hideNavMenu(): void {
        
        $(navMenuItemsContainerRef.current!).slideUp(200, "swing");
    }

    function showNavMenu(): void {
        
        $(navMenuItemsContainerRef.current!).slideDown(200, "swing");
    }
    

    function handleWindowClick(event): void {

        const eventClassName = event.target.className as string;

        slideUpNavMenuOnClickOutside(eventClassName);
        slideUpNavMenuOnClickOutside(eventClassName);
    }

    
    function handleWindowKeyDown(event): void {

        const key = event.key;

        if (key === "Escape") {
            slideUpNavMenuOnClickOutside();
            slideUpNavMenuOnClickOutside();
        }
    }

    
    /**
     * Slide up given nav menu unless the nav menu class name is included in event target class name.
     * 
     * @param eventTargetClassName class name of ```event.target```
     */
    function slideUpNavMenuOnClickOutside(eventTargetClassName?: string): void {

        if (!includesIgnoreCaseTrim(eventTargetClassName || "", "dontHideNavMenu"))
            hideNavMenu();
    }


    return (
        <div 
            id={id} 
            className={className + (!navMenuItems.length ? " hidden" : "")}
            style={style}
        >
            <div className="navMenuLabel dontHideNavMenu" onClick={handleNavMenuLabelClick}>
                <span className="me-2 dontMarkText dontHideNavMenu">{wpNavMenu.name}</span>
                <i className="fa-solid fa-chevron-down dontHideNavMenu"></i>
            </div>

            <div className="navMenuItemsContainer dontHideNavMenu" ref={navMenuItemsContainerRef}>
                {navMenuItems}
            </div>
             
            {children}
        </div>
    )
}