import type DefaultProps from "@/abstracts/props/DefaultProps";
import { useDefaultProps } from "@/hooks/useDefaultProps";
import { includesIgnoreCaseTrim } from "@/helpers/utils";
import parse, { attributesToProps, Element, type HTMLReactParserOptions } from "html-react-parser";
import React, { type JSX, type ReactNode } from "react";
import sanitize from "sanitize-html";
import Conditional from "./Conditional";
import { DEFAULT_HTML_SANTIZER_OPTIONS } from "@/helpers/constants";


interface Props extends DefaultProps<any> {
    dirtyHTML: string,
    /** Will fully replace the default options */
    parseOptions?: HTMLReactParserOptions,
    /** Will fully replace the default options */
    sanitizeOptions?: sanitize.IOptions,
    /** Tag names that component props will be passed to. Default is `["div"]` */
    mainTagNames?: (keyof HTMLElementTagNameMap)[],
}


/**
 * Component that sanitizes and parses given html string safely. See default sanizing options here: {@link DEFAULT_HTML_SANTIZER_OPTIONS}
 * 
 * NOTE: expect one parent only or will have duplicate react keys
 * 
 * @since 0.0.1
 */
export default function Sanitized({
    dirtyHTML,
    mainTagNames = ["div"],
    parseOptions,
    sanitizeOptions,
    rendered = true,
    ...props
}: Props) {
    const { id, className, style, children, ...otherProps } = useDefaultProps("Sanitized", props);

    // add component props to parsed html
    const defaultParserOptions: HTMLReactParserOptions = {
        replace(domNode) {
            return nodeToJSXElement(domNode as Element, -1);
        }
    }

    /**
     * @param node to convert to jsx element
     * @param childIndex -1 if this is the top level node, else the index of this node child amongst it's siblings
     * @returns jsx element of given ```node``` or ```null``` if given ```node``` is falsy
     */
    function nodeToJSXElement(node: Element, childIndex: number): JSX.Element | null {
        // case: invalid node
        if (!node || !node.attribs) 
            return null;

        // pass component props to 
        const tagName = node.name;
        const newProps = combineProps(node, childIndex);
        
        // case: no children
        if (!node.children || !node.children.length)
            return React.createElement(tagName, newProps)

        // map children to jsx elements
        const children = mapNodeChildrenToReactNode(node);
        
        return React.createElement(tagName, newProps, children);
    }

    /**
     * Combine ```node``` props and component's props if tag name of ```node``` is included in ```mainTagNames```.
     * 
     * @param node to get props from
     * @param childIndex -1 if this is the top level node, else the index of this child amongst it's siblings
     * @returns combined props of ```node``` props and this component's props
     */
    function combineProps(node: Element, childIndex: number): object {
        // case: invalid node
        if (!node || !node.attribs) 
            return {};
        
        const nodeProps = attributesToProps(node.attribs);

        // case: is not main tag
        if (!isMainTagName(node)) 
            return {...nodeProps, key: childIndex};

        // combine node and component properties
        return {
            ...nodeProps,
            id: ((nodeProps.id || "") + (id || "")).trim(),
            className: ((nodeProps.className || "") + " " + (className || "")).trim(),
            style: {...nodeProps.style, ...style},
            key: childIndex
        }
    }

    /**
     * @param node to get the children from
     * @returns array of ReactNodes of ```node.children```
     */
    function mapNodeChildrenToReactNode(node: Element): ReactNode[] {
        return node.children.map((child, i) => {
            const childElement = child as Element;
            
            // case: only text as children
            if (child.type === "text")
                return child.data;

            return nodeToJSXElement(childElement, i);
        });
    }


    /**
     * @param node to check the tag name of
     * @returns true if ```node.name``` is included in ```mainTagNames``` (ignore case)
     */
    function isMainTagName(node: Element): boolean {
        if (!mainTagNames || !mainTagNames.length)
            return false;

        return includesIgnoreCaseTrim(mainTagNames, node.name);
    }

    return (
        <Conditional {...otherProps}>
            {/* InnerHTML */}
            {
                parse(
                    sanitize(dirtyHTML, sanitizeOptions || DEFAULT_HTML_SANTIZER_OPTIONS), 
                    parseOptions || defaultParserOptions
                )
            }

            {/* InnerNoteInputs */}
            {children}
        </Conditional>
    )
}
