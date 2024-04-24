import React from "react";
import DefaultProps, { getCleanDefaultProps } from "../abstract/DefaultProps";
import { BrowserRouter, Route, Routes } from "react-router-dom";


interface Props extends DefaultProps {
}


export default function({...otherProps}: Props) {

    const { id, className, style, children } = getCleanDefaultProps(otherProps);


    return (
        <BrowserRouter>
            <div id={id} className={className} style={style}>
                <h1>App</h1>

                <div>Navbar</div>

                <Routes>
                    <Route path="/" element={<div>Home</div>} />
                    <Route path="/impressum" element={<div>Impressum</div>} />
                    <Route path="*" element={<div>404</div>} />
                </Routes>

                {children}

                <div>footer</div>
            </div>
        </BrowserRouter>
    )
}