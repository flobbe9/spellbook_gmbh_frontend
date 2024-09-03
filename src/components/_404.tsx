import React, { useEffect, useState } from "react";
import "../assets/styles/_404.css";
import DefaultProps, { getCleanDefaultProps } from "../abstract/props/DefaultProps";
import WPPage from "../abstract/wp/WPPage";
import Flex from "./helpers/Flex";
import { COMPANY_NAME, ENV, LINK_DEFAULT_REL } from "../helpers/constants";
import { Link } from "react-router-dom";
import Head from "./Head";


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
        setTimeout(updateContent, ENV === "development" ? 0 : 3000);

    }, [wpPages]);


    function updateContent(): void {

        setContent(!wpPages.length ? <Pending /> : <NotFound />)
    }


    function Pending() {
        return (
            <Flex className="pendingContainer" horizontalAlign="center" verticalAlign="center">
                <div className="textCenter">
                    <i className="fa-solid fa-spinner rotating"></i>
                    <p className="mt-3">Lade Kontent...</p>
                </div>
            </Flex>
        )
    }


    function NotFound() {

        return (
            <div className="textCenter mt-5">
                <h1>404</h1>

                <h2>Diese Seite konnte nicht gefunden zu werden.</h2>

                <p><Link to="/" className="backToStartLink" rel={LINK_DEFAULT_REL}>Zurück zur Startseite</Link></p>
            </div>
        );
    }

    
    function getPageTitle(): string {

        return `${COMPANY_NAME} | 404 Not found`;
    }


    return (
        <div 
            id={id} 
            className={className}
            style={style}
        >
            <Head 
                headTagStrings={[
                    `<title>${getPageTitle()}</title>`
                ]}
            />

            {content}
                
            {children}
        </div>
    )
}