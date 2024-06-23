import React, { useContext, useEffect, useRef, useState } from "react";
import "../../assets/styles/ParallaxBlock.css";
import DefaultProps, { getCleanDefaultProps } from "../../abstract/props/DefaultProps";
import { getCssConstant, getCSSValueAsNumber, getJQueryElementByClassName, getJQueryElementById, isBlank, isNumberFalsy, log, logWarn } from "../../helpers/genericUtils";
import WPBlock from "../../abstract/wp/WPBlock";
import { getCleanBlockProps } from "../../abstract/props/BlockProps";
import { AppContext } from "../App";


interface Props extends DefaultProps {
    wpBlock: WPBlock
}


/**
 * Background image filling the entire page, scrolling slower than the rest of the window.
 * 
 * @since 0.0.2
 */
export default function ParallaxBlock({wpBlock, ...otherProps}: Props) {

    const { id, className, style, children } = getCleanBlockProps(otherProps, "ParallaxBlock");

    const { data } = wpBlock.attrs;
    const imageClass = wpBlock.attrs.className;

    const { windowSize } = useContext(AppContext);

    const zIndex = getCssConstant("zIndexParallax");

    const componentRef = useRef(null);

    
    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        
        return () => 
            window.removeEventListener("scroll", handleScroll);
    }, []);


    useEffect(() => {
        adjustPageAndAppHeight();
        adjustParallaxSize();

    }, [windowSize])


    /**
     * Move parallax slightly slower than the actual content to make it seem like it's far in the background.
     *   
     * @param event 
     */
    function handleScroll(event): void {

        const parallax = $(componentRef.current!);
        const page = getJQueryElementById("Page");
        if (!page) 
            return;
        
        const windowHeight = $(window).height();
        const pageHeight = getPageHeight();
        const parallaxHeight = parallax.height();
        const scrollY = window.scrollY;

        if (isNumberFalsy(pageHeight) || isNumberFalsy(windowHeight) || isNumberFalsy(parallaxHeight))
            return;

        // calculate scroll amount sothat the parallax has bottom = 0 when the window is scrolled down completely
        // regardles of the vh
        const scrollPercent = scrollY / (pageHeight! - windowHeight!);
        const totalImageOverflow = parallaxHeight! - windowHeight!;
        const diff = totalImageOverflow * scrollPercent;

        const newTop = scrollY - diff;

        parallax.css("top", newTop);
    }


    /**
     * Set dimensions of ".parallaxImage" depending on the current view port width to hight ratio sothat
     * the parallax will always fill the window completely.
     */
    function adjustParallaxSize(): void {

        const parallax = $(componentRef.current!);

        const pageHeight = getPageHeight();
        const windowHeight = $(window).height();
        const windowWidth = $(window).width();
        if (isNumberFalsy(pageHeight) || isNumberFalsy(windowHeight) || isNumberFalsy(windowWidth))
            return;

        const isWideWindow = windowWidth! > windowHeight!;

        const parallaxImage = parallax.find(".parallaxImage");

        // either stretch the image's width or height
        parallaxImage.css("width", isWideWindow ? "100vw" : "auto");
        parallaxImage.css("height",  isWideWindow ? "auto" : "110vh");
    }


    /**
     * Adjust the height of the ```<Page>``` for the parallax effect to work for every view port.
     */
    function adjustPageAndAppHeight(): void {

        const page = getJQueryElementById("Page");
        if (!page)
            return;

        const pageHeight = getPageHeight();
        const windowHeight = $(window).height();
        const windowWidth = $(window).width();
        if (isNumberFalsy(pageHeight) || isNumberFalsy(windowHeight) || isNumberFalsy(windowWidth))
            return;

        const app = getJQueryElementById("App");
        if (!app)
            return;

        // increase page height if page height is between 100% and 110% of window height
        page.css("height", pageHeight! < windowHeight! * 1.1 ? windowHeight! * 1.1 : "");
    }


    function getPageHeight(): number | undefined {

        const page = getJQueryElementById("Page");
        const navBar = getJQueryElementById("NavBar");
        const footer = getJQueryElementById("Footer");
        if (!page || !navBar || !footer)
            return;

        const pageHeight = page.outerHeight();
        const navBarHeight = navBar.outerHeight();
        const footerHeight = footer.outerHeight();
        if (isNumberFalsy(navBarHeight) || isNumberFalsy(footerHeight) || isNumberFalsy(pageHeight))
            return;

        return pageHeight! + navBarHeight! + footerHeight!;
    }
    

    /**
     * @returns image url from ```wpBlock``` or ""
     */
    function getSrc(): string {

        if (!data || isBlank(data["image"]))
            return "";

        return data["image"];
    }
    

    return (
        <div 
            id={id} 
            className={className}
            style={{
                ...style, 
                zIndex: zIndex
            }}
            ref={componentRef}
        >
            <img 
                className={"parallaxImage " + imageClass}
                src={getSrc().replace("localhost", "192.168.2.35")}
                alt={"Parallax image"}
            />
                
            {children}
        </div>
    )
}