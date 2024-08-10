import React, { useEffect, useRef, useState } from "react";
import "../assets/styles/NavMenu.scss";
import DefaultProps, { getCleanDefaultProps } from "../abstract/props/DefaultProps";
import { getJQueryElementById, getRandomString, includesIgnoreCaseTrim, isBlank, log } from "../helpers/genericUtils";
import NavMenuItem from "./NavMenuItem";
import { WPNavMenu } from "../abstract/WPNavMenu";
import Button from "./helpers/Button";


interface Props extends DefaultProps {
    wpNavMenu: WPNavMenu
}


/**
 * Menu (label and box with menu items) that slides down in ```<NavBar>```. See also {@link WPNavMenu}
 * 
 * @since 0.0.2
 */
// TODO: full width for easier click
export default function NavMenu({wpNavMenu, ...otherProps}: Props) {

    const { id, className, style, children } = getCleanDefaultProps(otherProps, "NavMenu");

    const [navMenuItems, setWpNavMenuItems] = useState<(JSX.Element | undefined)[]>([]);

    const navMenuItemsContainerRef = useRef(null);
    const arrowIconRef = useRef(null);

    /** Duration of the nav menu slide and other animations related */
    const navMenuSlideDuration = 200;


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
        $(".navMenuItemsContainer").slideUp(navMenuSlideDuration, "swing");
        
        // case: is visible
        if (!isVisible)
            showNavMenu();

        flipArrowIcon();
    }

    
    function hideNavMenu(): void {
        
        $(navMenuItemsContainerRef.current!).slideUp(navMenuSlideDuration, "swing");
    }

    function showNavMenu(): void {
        
        $(navMenuItemsContainerRef.current!).slideDown(navMenuSlideDuration, "swing");
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
    
    
    /**
     * Rotates arrow icon by 360deg.
     */
    function flipArrowIcon(): void {

        const arrowIcon = $(arrowIconRef.current!);

        const currentRotation = arrowIcon.css("rotate");

        arrowIcon.animate(
            {"rotate": currentRotation === "360deg" ? "0deg" : "360deg"},
            navMenuSlideDuration,
            "swing"
        );
    }

    return (
        <div 
            id={id} 
            className={className + (!navMenuItems.length ? " hidden" : "")}
            style={style}
        >
            <Button className="navMenuLabel dontHideNavMenu" onClick={handleNavMenuLabelClick}>
                <span className="me-2 dontMarkText dontHideNavMenu">{wpNavMenu.name}</span>
                <i className="fa-solid fa-chevron-down dontHideNavMenu" ref={arrowIconRef}></i>
            </Button>

            <div className="navMenuItemsContainer dontHideNavMenu" ref={navMenuItemsContainerRef}>
                {navMenuItems}
            </div>
             
            {children}
        </div>
    )
}