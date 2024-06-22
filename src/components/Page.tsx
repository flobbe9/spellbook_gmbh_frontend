import React from "react";
import "../assets/styles/Page.css";
import DefaultProps, { getCleanDefaultProps } from "../abstract/DefaultProps";
import WPPage from "../abstract/wp/WPPage";
import Block from "./blocks/Block";
import Flex from "./helpers/Flex";
import { COMPANY_NAME } from "../helpers/constants";


interface Props extends DefaultProps {
    wpPage: WPPage
}


/**
 * Component rendering one page designed with wp.
 * 
 * @since 0.0.1
 */
export default function Page({wpPage, ...otherProps}: Props) {

    const { id, className, style, children } = getCleanDefaultProps(otherProps, "Page", true);


    function getPageTitle(): string {

        if (wpPage.path === "/")
            return COMPANY_NAME;

        return COMPANY_NAME + " | " + wpPage.post_title;
    }
    

    return (
        <div 
            id={id} 
            className={className}
            style={style}
        >
            <title>{getPageTitle()}</title>

            {/* Seo stuff */}
            <h1 className="hidden">{getPageTitle()}</h1>
            <link rel="canonical" href={window.location.href} />

            <Block wpBlocks={wpPage.blocks} />
                
            {children}
        </div>
    )
}