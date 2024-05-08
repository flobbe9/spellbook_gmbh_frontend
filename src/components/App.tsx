import React, { createContext, useEffect, useRef, useState } from "react";
import "../assets/styles/App.css";
import DefaultProps, { getCleanDefaultProps } from "../abstract/DefaultProps";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import NavBar from "./Navbar";
import Home from "./Home";
import { usePages } from "../hooks/usePages";
import { equalsIgnoreCase, getCssConstant, getCSSValueAsNumber, getRandomString, isNumberFalsy, log } from "../utils/genericUtils";
import _404 from './_404';
import Page from "./Page";
import Flex from "./helpers/Flex";
import BasicAuth from "./BasicAuth";
import useBasicAuth from "../hooks/useBasicAuth";
import Toast, { ToastSevirity } from "./Toast";
import Footer from "./Footer";
import { JQueryEasing } from "../abstract/CSSTypes";
import Initializer from "./Initializer";


interface Props extends DefaultProps {
}


/**
 * @since 0.0.1
 */
// TODO: seo
// TODO: mobile
// TODO: pipeline, Dockerfile

// To disable login:
    // remove BasicAuth component from renderPages()
    // remove updateSession() from Initializer component
export default function App({...otherProps}: Props) {

    const { id, className, style, children } = getCleanDefaultProps(otherProps, "App", true);

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const [toastSummary, setToastSummary] = useState("");
    const [toastMessage, setToastMessage] = useState("");
    const [toastSevirity, setToastSevirity] = useState<ToastSevirity>("info");
    /** Refers to the css prop ```bottom```. Starts "below" screen in order to slide up. */
    const [toastBottom, setToastBottom] = useState<number>(-50);

    const context = {
        isLoggedIn,
        setIsLoggedIn,

        toast,
        toggleToast
    }

    const toastRef = useRef(null);

    const wpPages = usePages();


    /**
     * Map all pages to a ```Route``` component. Combine wp content with existing content in case of "login".
     * 
     * @returns array of ```Route``` components with ```Page``` elements
     */
    function renderPages(): JSX.Element[] {

        let isLoginPagePresent = false;

        const pages = wpPages.map(wpPage => {
            // case: connect wp content with existing content
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

            // case: is home page
            if (wpPage.path === "/12-2")
                return <Route key={getRandomString()} path={"/"} element={<Page wpPage={wpPage} />} />

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
        if (!isNumberFalsy(screenTime))
            setTimeout(() => toggleToast(true), screenTime);

        toggleToast();
    }


    /**
     * Show or hide toast depending on it's current visibility.
     * 
     * @param hideToast if true, toast will definitely by hidden regardless of it's state before. Default is ```false```
     */
    function toggleToast(hideToast = false): void {

        const toast = $(toastRef.current!);

        let toastHeight = getCSSValueAsNumber(toast.css("height"), 2);
        let animationEasing: JQueryEasing = "easeOutSine";

        // case: toast currently visible
        if (getCSSValueAsNumber(toastBottom, 2) > 0 || hideToast) {
            toastHeight *= -1;
            animationEasing = "easeInSine";
        }

        setToastBottom(toastHeight);

        toast.animate({bottom: toastHeight}, {duration: 200, "easing": animationEasing});
    }


    return (
        <AppContext.Provider value={context}>
            <BrowserRouter>
                <div id={id} className={className} style={style}>
                    {/* No html, just function calls here */}
                    <Initializer />

                    <NavBar />

                    {/* Content */}
                    <Flex horizontalAlign="center" verticalAlign="end">
                        <div className="content">
                            <Routes>
                                {/* <Route path="/" element={<Home />} /> */}
                                {renderPages()}
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

                    <Footer />
                </div>
            </BrowserRouter>
        </AppContext.Provider>
    )
}


export const AppContext = createContext({
    isLoggedIn: false,
    setIsLoggedIn: (isLoggedIn: boolean) => {},

    toast: (summary: string, message = "", sevirity: ToastSevirity = "info", screenTime?: number) => {},
    toggleToast: (hideToast = false, screenTime?: number) => {}
})