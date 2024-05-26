import React, { useEffect, useRef, useState } from "react";
import "../../assets/styles/ParallaxBlock.css";
import DefaultProps, { getCleanDefaultProps } from "../../abstract/DefaultProps";
import { getCssConstant, getCSSValueAsNumber, isBlank, log } from "../../utils/genericUtils";
import WPBlock from "../../abstract/wp/WPBlock";


interface Props extends DefaultProps {
    wpBlock: WPBlock
}


/**
 * Background image filling the entire page, scrolling slower than the rest of the window.
 * 
 * @since 0.0.2
 */
export default function ParallaxBlock({wpBlock, ...otherProps}: Props) {

    const { id, className, style, children } = getCleanDefaultProps(otherProps, "ParallaxBlock");

    const { data } = wpBlock.attrs;
    const imageClass = wpBlock.attrs.className;

    /** 1 beeing equivalent to "fixed" image and > 1 increasing the scroll amount */
    const scrollFactor = 2;
    const [initialTop, setInitialTop] = useState<number>(getInitialTop());

    const zIndex = getCssConstant("zIndexParallax");

    const componentRef = useRef(null);

    
    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        setInitialTop(getInitialTop());

        return () => 
            window.removeEventListener("scroll", handleScroll);
    }, []);


    function handleScroll(event): void {

        const parallax = $(componentRef.current!);
        const scrollY = window.scrollY;

        // scroll image at half the speed of window
        parallax.css("top", (scrollY / scrollFactor) + initialTop);
    }


    function getSrc(): string {

        if (!data || isBlank(data["image"]))
            return "";

        return data["image"];
    }


    /**
     * @returns the initial "top" css value for this component (relative to navbar)
     */
    function getInitialTop(): number {

        const navBar = $("#NavBar");
        if (!navBar || !navBar.length)
            return 0;

        return -getCSSValueAsNumber(navBar.css("height"), 2) / scrollFactor
    }
    

    return (
        <div 
            id={id} 
            className={className}
            style={{
                ...style, 
                top: initialTop,
                zIndex: zIndex
            }}
            ref={componentRef}
        >
            <img 
                className={"parallaxImage " + imageClass}
                src={getSrc()}
                alt={"Parallax image"}
            />
                
            {children}
        </div>
    )
}