import React, { useEffect, useState } from "react";
import "../assets/styles/Page.css";
import DefaultProps, { getCleanDefaultProps } from "../abstract/props/DefaultProps";
import WPPage from "../abstract/wp/WPPage";
import Block from "./blocks/Block";
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

    const [h1, setH1] = useState(<></>);

    useEffect(() => {
        setH1(getH1());

    }, []);


    function getPageTitle(): string {

        return COMPANY_NAME + " | " + wpPage.post_title;
    }


    /**
     * @returns a hidden ```<h1>``` with ```getPageTitle()``` for seo purposes or ```<></>``` if this page already
     *          contains an h1
     */
    function getH1(): JSX.Element {

        const wpBlockH1 = wpPage.blocks.find(wpBlock => wpBlock.innerHTML.includes("</h1>"));

        return wpBlockH1 ? <></> : <h1 className="hidden">{getPageTitle()}</h1>;
    }
    

    return (
        <div 
            id={id} 
            className={className}
            style={style}
        >
            <title>{getPageTitle()}</title>

            {/* Seo stuff */}
            {h1}
            <link rel="canonical" href={window.location.href} />

            <Block wpBlocks={wpPage.blocks} />
                
            {children}
        </div>
    )
}