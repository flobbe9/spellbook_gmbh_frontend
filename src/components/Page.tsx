import React, { useEffect } from "react";
import DefaultProps, { getCleanDefaultProps } from "../abstract/DefaultProps";
import WPPage from "../abstract/wp/WPPage";
import Block from "./blocks/Block";


interface Props extends DefaultProps {
    wpPage: WPPage
}


/**
 * @since 0.0.1
 */
export default function Page({wpPage, ...otherProps}: Props) {

    const { id, className, style, children } = getCleanDefaultProps(otherProps, "Page", true);


    useEffect(() => {
        document.title = wpPage.post_title;

    }, []);


    return (
        <div 
            id={id} 
            className={className}
            style={style}
            >
            <Block wpBlocks={wpPage.blocks} />
                
            {children}
        </div>
    )
}