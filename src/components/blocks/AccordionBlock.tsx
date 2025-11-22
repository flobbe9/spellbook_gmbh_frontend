import { parseWpAccordionBlock } from "@/abstracts/backendDefinitions/blocks/WpAccordionBlock";
import { useBlockProps } from "@/hooks/useBlockProps";
import { type JSX, useEffect, useState } from "react";
import { Accordion } from "react-bootstrap";
import type { BlockProps } from "../Block";
import ConditionalDiv from "../ConditionalDiv";
import Sanitized from "../Sanitized";
import TextBlock from "./TextBlock";

/**
 * @since latest
 * @see https://react-bootstrap.netlify.app/docs/components/accordion/ for accordion docs
 */
export default function AccordionBlock(props: BlockProps) {
    const componentName = "AccordionBlock";
    const { children, wpBlock, parsedWpBlock, ...otherProps } = useBlockProps(componentName, props, parseWpAccordionBlock);

    const [accordionItems, setAccordionItems] = useState<JSX.Element[]>([]);

    useEffect(() => {
        setAccordionItems(mapAccordionItems());
    }, [wpBlock]);

    function mapAccordionItems(): JSX.Element[] {
        if (!parsedWpBlock?.header_bodies)
            return [];

        return parsedWpBlock.header_bodies
            .map(({header, body}, i) => (
                <Accordion.Item eventKey={String(i)} key={i}>
                    <Accordion.Header as="div">
                        <TextBlock
                            wpBlock={{
                                attrs: {
                                    data: {
                                        text_rich_text: header
                                    }
                                },
                                blockName: null,
                                innerBlocks: [],
                                innerHTML: ''
                            }}
                        />  
                    </Accordion.Header>

                    <Accordion.Body>
                        <TextBlock 
                            wpBlock={{
                                attrs: {
                                    data: {
                                        text_rich_text: body
                                    }
                                },
                                blockName: null,
                                innerBlocks: [],
                                innerHTML: ''
                            }}
                        />
                    </Accordion.Body>
                </Accordion.Item>
            ));
    }

    return (
        <ConditionalDiv {...otherProps}>
            <Accordion>
                {accordionItems}
            </Accordion>

            <Sanitized dirtyHTML={wpBlock.innerHTML} />

            {children}
        </ConditionalDiv>
    )
}