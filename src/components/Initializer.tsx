import React, { useContext, useEffect } from "react";
import DefaultProps, { getCleanDefaultProps } from "../abstract/DefaultProps";
import useBasicAuth from "../hooks/useBasicAuth";
import { ENV, WORDPRESS_BASE_URL } from "../utils/constants";
import WPPage from "../abstract/wp/WPPage";
import { log } from "../utils/genericUtils";
import { AppContext } from "./App";
import { useLocation } from "react-router";


interface Props extends DefaultProps {
    wpPages: WPPage[]
}


/**
 * Component placed inside app and routing context. Should not render any html. Do ```useEffect()``` calls here,
 * that normally would go inside ```App```.
 * 
 * @since 0.0.1
 */
export default function Initializer({wpPages, ...otherProps}: Props) {

    const { updateSession, redirect } = useBasicAuth();

    const { isLoggedIn } = useContext(AppContext);

    const location = useLocation();


    useEffect(() => {
        handlePageLoad();

    }, [wpPages, isLoggedIn, location]);


    /**
     * Update session and redirect if necessary (see ```redirect``` function).
     * 
     * Don't redirect if ```ENV``` is "development".
     */
    async function handlePageLoad(): Promise<void> {

        const isLoggedIn = await updateSession();

        // uncomment this to deactivate redirects in dev
        // if (ENV !== "development")
        redirect(isLoggedIn, wpPages);
    }


    return (<></>)
}