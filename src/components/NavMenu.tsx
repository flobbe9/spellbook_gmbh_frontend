import React, { useEffect, useRef, useState } from "react";
import "../assets/styles/NavMenu.scss";
import DefaultProps, { getCleanDefaultProps } from "../abstract/props/DefaultProps";
import { getJQueryElementById, getRandomString, includesIgnoreCaseTrim, isBlank, log } from "../helpers/genericUtils";
import NavMenuItem from "./NavMenuItem";
import { WPNavMenu } from "../abstract/WPNavMenu";
import Button from "./helpers/Button";
import HelperDiv from "./helpers/HelperDiv";
import useKeyPress from "../hooks/useKeyPress";


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
    const [tabPressed, setTabPressed] = useState(false);

    const navMenuItemsContainerRef = useRef(null);
    const arrowIconRef = useRef(null);

    /** Duration of the nav menu slide and other animations related */
    const navMenuSlideDuration = 200;


    useEffect(() => {
        window.addEventListener("keydown", handleWindowKeyDown);

        return () => {
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

        return wpNavMenuItems.map((wpNavMenuItem, i) => 
            <NavMenuItem 
                key={getRandomString()} 
                wpNavMenuItem={wpNavMenuItem} 
                linkClassName="themeLink" 
                onBlur={(event) => {
                    // case: last nav menu item
                    if (i === wpNavMenuItems.length - 1)
                        handleLastNavMenuItemBlur(event)
                }}
                onKeyDown={handleNavMenuItemKeyDown}
            />);
    }


    function handleNavMenuLabelClick(event): void {
        
        const navMenuItemsContainer = $(navMenuItemsContainerRef.current!);

        const isVisible = navMenuItemsContainer.is(":visible");

        if (!isVisible)
            showNavMenu();

        else
            hideNavMenu();

        flipArrowIcon();
    }

    
    function hideNavMenu(): void {

        $(navMenuItemsContainerRef.current!).slideUp(navMenuSlideDuration, "swing");
    }

    function showNavMenu(): void {

        $(navMenuItemsContainerRef.current!).slideDown(navMenuSlideDuration, "swing");
    }
    

    function handleWindowKeyDown(event): void {

        const key = event.key;

        if (key === "Escape") 
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


    function handleBlur(event): void {

        if (!tabPressed)
            hideNavMenu();
    }


    function handleLastNavMenuItemBlur(event): void {

        hideNavMenu();
    }


    function handleNavMenuItemKeyDown(event): void {

        if (event.key === "Enter")
            hideNavMenu();
    }


    function handleKeyDownCapture(event): void {

        setTabPressed(true);
    }


    function handleKeyUpCapture(event): void {

        setTabPressed(false);
    }


    return (
        <HelperDiv 
            id={id} 
            className={className + (!navMenuItems.length ? " hidden" : "")}
            style={style}
            onBlur={handleBlur}
            onKeyDownCapture={handleKeyDownCapture}
            onKeyUpCapture={handleKeyUpCapture}
        >
            <Button className="navMenuLabel" onClick={handleNavMenuLabelClick}>
                <span className="me-2 dontMarkText">{wpNavMenu.name}</span>
                <i className="fa-solid fa-chevron-down" ref={arrowIconRef}></i>
            </Button>

            <HelperDiv 
                className="navMenuItemsContainer" 
                ref={navMenuItemsContainerRef}
            >
                {navMenuItems}
            </HelperDiv>
             
            {children}
        </HelperDiv>
    )
}