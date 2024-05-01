import React, { useEffect } from "react";
import "../assets/styles/App.css";
import DefaultProps, { getCleanDefaultProps } from "../abstract/DefaultProps";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import NavBar from "./Navbar";
import Home from "./Home";
import { usePages } from "../hooks/usePages";
import { getRandomString, log } from "../utils/genericUtils";
import _404 from './_404';
import Block from "./blocks/Block";
import Page from "./Page";
import Flex from "./helpers/Flex";


interface Props extends DefaultProps {
}


/**
 * @since 0.0.1
 */
// TODO: seo
export default function App({...otherProps}: Props) {

    const { id, className, style, children } = getCleanDefaultProps(otherProps, "App", true);

    const wpPages = usePages();


    useEffect(() => {

    }, []);


    // TODO: handle loading properly
    function renderPages(): JSX.Element[] {

        // iterate pages
        return wpPages.map(wpPage => 
            <Route key={getRandomString()} path={wpPage.path} element={<Page wpPage={wpPage} />} />)
    }


    return (
        <BrowserRouter>
            <div id={id} className={className} style={style}>
                <NavBar />

                <Flex horizontalAlign="center" verticalAlign="end">

                    <div className="content">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            {renderPages()}
                            <Route path="*" element={<_404 pending={!wpPages?.length} />} />
                        </Routes>
                    </div>
                </Flex>

                {children}

                <div>footer</div>
            </div>
        </BrowserRouter>
    )
}