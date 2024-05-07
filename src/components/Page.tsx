import React, { useEffect } from "react";
import DefaultProps, { getCleanDefaultProps } from "../abstract/DefaultProps";
import WPPage from "../abstract/wp/WPPage";
import Block from "./blocks/Block";
import Flex from "./helpers/Flex";
import { COMPANY_NAME } from "../utils/constants";


interface Props extends DefaultProps {
    wpPage: WPPage
}


/**
 * Component rendering one page designed with wp.
 * 
 * @since 0.0.1
 */
export default function Page({wpPage, ...otherProps}: Props) {

    const { id, className, style, children } = getCleanDefaultProps(otherProps, "Page", true);


    useEffect(() => {
        document.title = wpPage.post_title + " | " + COMPANY_NAME;

    }, []);


    return (
        <Flex 
            id={id} 
            className={className}
            style={style}
            verticalAlign="center"
            flexDirection="column"
        >
            <Block wpBlocks={wpPage.blocks} />
                
            {children}
        </Flex>
    )
}