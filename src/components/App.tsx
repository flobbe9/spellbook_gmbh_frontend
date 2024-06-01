import React, { createContext, useEffect, useRef, useState } from "react";
import "../assets/styles/App.css";
import DefaultProps, { getCleanDefaultProps } from "../abstract/DefaultProps";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import NavBar from "./Navbar";
import { usePages } from "../hooks/usePages";
import { equalsIgnoreCase, getCssConstant, getCSSValueAsNumber, getRandomString, includesIgnoreCaseTrim, isNumberFalsy, log } from "../utils/genericUtils";
import _404 from './_404';
import Page from "./Page";
import Flex from "./helpers/Flex";
import BasicAuth from "./BasicAuth";
import useBasicAuth from "../hooks/useBasicAuth";
import Toast, { ToastSevirity } from "./Toast";
import Footer from "./Footer";
import { JQueryEasing } from "../abstract/CSSTypes";
import Initializer from "./Initializer";
import { COMPANY_NAME, IS_SITE_LIVE } from "../utils/constants";
import Parallax from "./blocks/ParallaxBlock";
import WPPage from "../abstract/wp/WPPage";


interface Props extends DefaultProps {
}


/**
 * @since 0.0.1
 */
// TODO: seo
// TODO: wp health stuff
// TODO: mobile
// TODO: custom 404 page
// TODO: logout button
// TODO: fetch footer icons
// IDEA: font families for each game?

// TODO: new url
    // order
        // 1. compose stop✅
        // 2. assign ips to new domain✅
        // 3. copy new prod compose file to server✅
        // 4. edit default-ssl.conf✅
        // 5. rename db volume✅
        // 6. git push
        // rename db site urls
        // rename local ssh config
        // delete old files on server
        // delete old docker repos
        // dont forward 8080 anymore
        // dont fowrad 3306 for frontend
        // adjust vscode commands
        // remove old db
        
    // local ssh config

// GO LIVE TODO: 
    // change text for login page in wp
    // change env variable IS_SITE_LIVE


export default function App({...otherProps}: Props) {

    const { id, className, style, children } = getCleanDefaultProps(otherProps, "App", true);

    /** Time the toast popup takes to slide up and down in ms. */
    const toastSlideDuration = 400;

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const [toastSummary, setToastSummary] = useState("");
    const [toastMessage, setToastMessage] = useState("");
    const [toastSevirity, setToastSevirity] = useState<ToastSevirity>("info");
    const [toastScreenTimeTimeout, setToastScreenTimeTimeout] = useState<NodeJS.Timeout>();

    /** The <Route> tags, rendered using the fetched {@link WPPage}s */
    const [routes, setRoutes] = useState<(JSX.Element | undefined)[]>([]);

    const context = {
        isLoggedIn,
        setIsLoggedIn,

        toast,
        moveToast
    }

    const toastRef = useRef(null);

    const wpPages = usePages();


    useEffect(() => {
        window.addEventListener("keydown", handleWindowKeyDown);

        return () => {
            window.removeEventListener("keydown", handleWindowKeyDown);
        }

    }, []);


    useEffect(() => {
        if (wpPages)
            setRoutes(renderPages());

    }, [wpPages]);


    /**
     * Map all pages to a ```Route``` component. Combine wp content with existing content in case of "login".
     * 
     * @returns array of ```Route``` components with ```Page``` elements
     */
    function renderPages(): (JSX.Element | undefined)[] {

        let isLoginPagePresent = false;

        const pages = wpPages.map(wpPage => {
            // case: hide this page in frontend
            if (!wpPage)
                return; 

            // case: is login page
            if (equalsIgnoreCase("login", wpPage.post_title)) {
                isLoginPagePresent = true;
                return <Route 
                            key={getRandomString()} 
                            path={wpPage.path} 
                            element={
                                <Page wpPage={wpPage}>
                                    <BasicAuth />
                                </Page>} 
                        />
            }

            return <Route key={getRandomString()} path={wpPage.path} element={<Page wpPage={wpPage} />} />
        });

        // case: custom login page is missing
        if (!isLoginPagePresent)
            pages.push(<Route key={getRandomString()} path={"/login"} element={<BasicAuth />} />);

        return pages;
    }


    /**
     * Set given text to toast and call ```toggle()``` on it.
     * 
     * @param summary serves like a small heading
     * @param message to display in tost body
     * @param sevirity will define the toast style. See {@link ToastSevirity}
     * @param screenTime time in ms that the popup should stay visible before hiding again automatically. If omitted, 
     *                   the popup wont hide by itself.
     */
    function toast(summary: string, message = "", sevirity: ToastSevirity = "info", screenTime?: number): void {

        setToastSummary(summary);
        setToastMessage(message);
        setToastSevirity(sevirity);

        // case: hide automatically
        if (!isNumberFalsy(screenTime)) {
            // stop toast animation
            clearTimeout(toastScreenTimeTimeout);
            $(toastRef.current!).stop();

            // restart toast animation
            const toastTimeout = setTimeout(() => moveToast(true), screenTime);
            setToastScreenTimeTimeout(toastTimeout);
        }

        setTimeout(() => {
            moveToast();
        }, 10)
    }


    /**
     * Show toast or hide it if ```hideToast``` is ```true```.
     * 
     * @param hideToast if true, toast will definitely by hidden regardless of it's state before. Default is ```false```
     */
    function moveToast(hideToast = false): void {

        const toast = $(toastRef.current!);

        // space between window bottom and toast bottom
        let toastHeight = 30;

        // case: hide
        if (hideToast) 
            // set to negative toast height to make sure it's completely hidden
            toastHeight = -getCSSValueAsNumber(toast.css("height"), 2);

        toast.animate({bottom: toastHeight}, {duration: toastSlideDuration, "easing": "easeOutSine"});
    }


    function handleWindowKeyDown(event): void {

        const key = event.key;

        if (key === "Escape")
            moveToast(true);
    }


    return (
        <AppContext.Provider value={context}>
            <BrowserRouter>
                <div id={id} className={className} style={style}>
                    {/* No html, just function calls here */}
                    <Initializer wpPages={wpPages} />

                    {(isLoggedIn || IS_SITE_LIVE) && <NavBar />}

                    {/* Content */}
                    <Flex horizontalAlign="center" verticalAlign="end">
                        <div className="content">
                            <Routes>
                                {routes}
                                <Route path="*" element={<_404 wpPages={wpPages} />} />
                            </Routes>
                        </div>
                    </Flex>

                    {/* Toast popup */}
                    <Toast 
                        summary={toastSummary}
                        message={toastMessage}
                        sevirity={toastSevirity}
                        ref={toastRef} 
                    />

                    {children}

                    {(isLoggedIn || IS_SITE_LIVE) && <Footer />}
                </div>
            </BrowserRouter>
        </AppContext.Provider>
    )
}


export const AppContext = createContext({
    isLoggedIn: false,
    setIsLoggedIn: (isLoggedIn: boolean) => {},

    toast: (summary: string, message = "", sevirity: ToastSevirity = "info", screenTime?: number) => {},
    moveToast: (hideToast = false, screenTime?: number) => {}
})