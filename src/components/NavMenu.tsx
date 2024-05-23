import React, { useEffect, useState } from "react";
import "../assets/styles/NavMenu.css";
import DefaultProps, { getCleanDefaultProps } from "../abstract/DefaultProps";
import { Link } from "react-router-dom";
import { PROTOCOL } from "../utils/constants";
import { getRandomString, isBlank } from "../utils/genericUtils";
import NavMenuItem from "./NavMenuItem";
import { WPNavMenu } from "../abstract/WPNavMenu";
import { WPNavMenuItem } from "../abstract/WPNavMenuItem";


interface Props extends DefaultProps {
    wpNavMenu: WPNavMenu
}


/**
 * Menu box that slides down in ```<NavBar>```.
 * 
 * @since 0.0.2
 */
export default function NavMenu({wpNavMenu, ...otherProps}: Props) {

    const { id, className, style, children } = getCleanDefaultProps(otherProps, "NavMenu");

    const [navMenuItems, setWpNavMenuItems] = useState<(JSX.Element | undefined)[]>([]);


    useEffect(() => {
        if (wpNavMenu)
            setWpNavMenuItems(mapNavMenuItems());
        
    }, [wpNavMenu]);


    /**
     * @returns array of WPNavMenuItems as ```<NavMenuItem>``` component, sorted by ```menu_order```
     */
    function mapNavMenuItems(): (JSX.Element | undefined)[] {

        if (!wpNavMenu)
            return [];

        // sort by menu_order
        const wpNavMenuItems = wpNavMenu.items.sort((a, b) => a.menu_order - b.menu_order);

        return wpNavMenuItems.map(wpNavMenuItem => 
            <NavMenuItem key={getRandomString()} wpNavMenuItem={wpNavMenuItem} />);
    }

    return (
        <div 
            id={id} 
            className={className}
            style={style}
        >
            {navMenuItems}
             
            {children}
        </div>
    )
}