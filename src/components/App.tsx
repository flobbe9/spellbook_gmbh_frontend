import React, { createContext, useEffect, useRef, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import DefaultProps, { getCleanDefaultProps } from "../abstract/props/DefaultProps";
import WPPage from "../abstract/wp/WPPage";
import "../assets/styles/App.css";
import { IS_SITE_LIVE } from "../helpers/constants";
import { equalsIgnoreCase, getCSSValueAsNumber, getRandomString, isNumberFalsy } from "../helpers/genericUtils";
import { usePages } from "../hooks/usePages";
import _404 from './_404';
import BasicAuth from "./BasicAuth";
import Footer from "./Footer";
import Initializer from "./Initializer";
import NavBar from "./Navbar";
import Page from "./Page";
import Toast, { ToastSevirity } from "./Toast";


interface Props extends DefaultProps {
}


// IDEA: 
    // maps (https://www.npmjs.com/package/@react-google-maps/api)
    // faq(?)
    // contact form
    // fix parallax
    // fix slider (or create new)
    // custom 404 page
    

/**
 * @since 0.0.1
*/
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

    const [windowSize, setWindowSize] = useState([window.innerWidth, window.innerHeight]);

    const context = {
        isLoggedIn,
        setIsLoggedIn,

        toast,
        moveToast,

        windowSize,
        getDeviceWidth
    }

    const toastRef = useRef(null);

    const wpPages = usePages();


    useEffect(() => {
        window.addEventListener("keydown", handleWindowKeyDown);
        window.addEventListener("resize", handleWindowResize);

        return () => {
            window.removeEventListener("keydown", handleWindowKeyDown);
            window.removeEventListener("resize", handleWindowResize);
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

        // map pages to routes
        const pages = wpPages
            .map(wpPage => {
                // case: custom login page
                if (equalsIgnoreCase("login", wpPage.post_title))
                    isLoginPagePresent = true;

                return getRouteByWpPage(wpPage);
            });

        // case: custom login page is missing
        if (!isLoginPagePresent)
            pages.push(<Route key={getRandomString()} path={"/login"} element={<BasicAuth />} />);

        return pages;
    }


    /**
     * @param wpPage to map to route
     * @returns either a ```<Route>``` component with a ```<Page>``` as element or ```undefined```
     */
    function getRouteByWpPage(wpPage: WPPage): JSX.Element | undefined {

        // case: hide this page in frontend
        if (!wpPage)
            return; 

        // case: login page
        if (equalsIgnoreCase("login", wpPage.post_title)) {
            return <Route 
                        key={getRandomString()} 
                        path={wpPage.path} 
                        element={
                            <Page wpPage={wpPage}>
                                <BasicAuth />
                            </Page>} 
                    />
        }

        // case: default page
        return <Route key={getRandomString()} path={wpPage.path} element={<Page wpPage={wpPage} />} />
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


    /**
     * Update ```windowSize``` state on ```resize``` event
     */
    function handleWindowResize(event): void {

        setWindowSize([window.innerWidth, window.innerHeight]);
    }


    /**
     * Col grid:
     * 
     * mobile: ```col-, col-sm-```,
     * 
     * tablet: ```col-md, col-lg```,
     * 
     * desktop: ```col-lg-, col-xl-, col-xxl-```
     * 
     * @returns object with 3 modes of which only one is true
     * @see https://getbootstrap.com/docs/5.3/layout/grid/
     */
    function getDeviceWidth(): {
        isMobileWidth: boolean
        isTabletWidth: boolean
        isDesktopWidth: boolean
    } {

        const windowWidth = windowSize[0];

        return {
            isMobileWidth: windowWidth < 576,
            isTabletWidth:  windowWidth >= 576 && windowWidth < 992,
            isDesktopWidth: windowWidth >= 992,
        }
    }


    return (
        <AppContext.Provider value={context}>
            <BrowserRouter>
                <div id={id} className={className} style={style}>
                    {/* No html, just function calls here */}
                    <Initializer wpPages={wpPages} />

                    {(isLoggedIn || IS_SITE_LIVE) && <NavBar />}

                    {/* Content */}
                    <div className="content">
                        <Routes>
                            {routes}
                            <Route path="*" element={<_404 wpPages={wpPages} />} />
                        </Routes>
                    </div>

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
    moveToast: (hideToast = false, screenTime?: number) => {},

    windowSize: [0, 0],
    getDeviceWidth: () => {return {isMobileWidth: false, isTabletWidth: false,isDesktopWidth: true}}
})