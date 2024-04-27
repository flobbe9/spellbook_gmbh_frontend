import React from "react";
import "../assets/styles/App.css";
import DefaultProps, { getCleanDefaultProps } from "../abstract/DefaultProps";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import NavBar from "./Navbar";
import Home from "./Home";


interface Props extends DefaultProps {
}


/**
 * @since 0.0.1
 */
export default function App({...otherProps}: Props) {

    const { id, className, style, children } = getCleanDefaultProps(otherProps, "App");


    return (
        <BrowserRouter>
            <div id={id} className={className} style={style}>
                <NavBar />

                <div className="content">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/impressum" element={<div>Impressum</div>} />
                        <Route path="*" element={<div>404</div>} />
                    </Routes>
                </div>

                {children}

                <div>footer</div>
            </div>
        </BrowserRouter>
    )
}