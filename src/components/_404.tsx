import React, { useEffect, useState } from "react";
import "../assets/styles/_404.css";
import DefaultProps, { getCleanDefaultProps } from "../abstract/DefaultProps";
import WPPage from "../abstract/wp/WPPage";
import { getCssConstant, log } from "../utils/genericUtils";
import Flex from "./helpers/Flex";
import { ENV } from "../utils/constants";
import { Link } from "react-router-dom";


interface Props extends DefaultProps {
    wpPages: WPPage[]
}


/**
 * Fallback component for 404 status. If ```pending``` is ```true``` a pending animation will be 
 * displayed instead of a 404 message. Pending should be ```true``` if no pages have been fetched from wp yet.
 * 
 * @since 0.0.1
 */
export default function _404({wpPages, ...otherProps}: Props) {

    const { id, className, style, children } = getCleanDefaultProps(otherProps, "_404", true);

    const [content, setContent] = useState<JSX.Element>(<Pending />);


    useEffect(() => {
        // give wpPages a bit time to load
        setTimeout(updateContent, ENV === "dev" ? 0 : 3000);

    }, [wpPages]);


    function updateContent(): void {

        setContent(!wpPages.length ? <Pending /> : <NotFound />)
    }


    function Pending() {
        return (
            <Flex className="pendingContainer" horizontalAlign="center" verticalAlign="center">
                <div className="textCenter">
                    <i className="fa-solid fa-spinner rotating"></i>
                    <p className="mt-3">Suche Kontent...</p>
                </div>
            </Flex>
        )
    }


    // IDEA: use wp page instead?
    function NotFound() {

        return (
            <div className="textCenter mt-5">
                <h1>404</h1>

                <h3>Diese Seite konnte nicht gefunden zu werden.</h3>

                <p><Link to="/" className="backToStartLink">Zurück zur Startseite</Link></p>
            </div>
        );
    }


    return (
        <div 
            id={id} 
            className={className}
            style={style}
        >
            {content}
                
            {children}
        </div>
    )
}