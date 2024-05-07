import React, { useContext, useEffect } from "react";
import DefaultProps, { getCleanDefaultProps } from "../abstract/DefaultProps";
import useBasicAuth from "../hooks/useBasicAuth";
import { AppContext } from "./App";
import { ENV } from "../utils/constants";


interface Props extends DefaultProps {

}


/**
 * Component placed inside app and routing context. Should not render any html. Do ```useEffect()``` calls here,
 * that normally would go inside ```App```.
 * 
 * @since 0.0.1
 */
export default function Initializer({...otherProps}: Props) {

    const { updateSession } = useBasicAuth();

    const { setIsLoggedIn } = useContext(AppContext);


    useEffect(() => {
        if (ENV !== "dev")
            updateSession(setIsLoggedIn);

    }, []);


    return (<></>)
}