import React from "react";
import "../assets/styles/Footer.css";
import DefaultProps, { getCleanDefaultProps } from "../abstract/DefaultProps";
import Flex from "./helpers/Flex";
import { COMPANY_NAME, VERSION } from "../utils/constants";


interface Props extends DefaultProps {

}


/**
 * @since 0.0.1
 */
export default function Footer({...otherProps}: Props) {

    const { id, className, style, children } = getCleanDefaultProps(otherProps, "Footer", true);

    return (
        <Flex 
            id={id} 
            className={className}
            style={style}
            horizontalAlign="center"
        >

            <Flex className="leftNavItem col-4">
            </Flex>
            
            <Flex className="middleNavItem col-4" horizontalAlign="center">
                <strong>{COMPANY_NAME}</strong>
            </Flex>
            
            <Flex className="rightNavItem col-4" horizontalAlign="right">
                v{VERSION}
            </Flex>

            {children}
        </Flex>
    )
}