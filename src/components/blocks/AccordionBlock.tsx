import { parseWpAccordionBlock } from "@/abstracts/backendDefinitions/blocks/WpAccordionBlock";
import { useBlockProps } from "@/hooks/useBlockProps";
import { type JSX, useEffect, useState } from "react";
import { Accordion } from "react-bootstrap";
import type { BlockProps } from "../Block";
import ConditionalDiv from "../ConditionalDiv";
import Sanitized from "../Sanitized";

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
                        <Sanitized dirtyHTML={header} />    
                    </Accordion.Header>

                    <Accordion.Body>
                        <Sanitized dirtyHTML={body} />
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