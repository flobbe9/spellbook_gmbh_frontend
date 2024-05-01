import React from "react";
import DefaultProps, { getCleanDefaultProps } from "../../abstract/DefaultProps";
import WPBlock from "../../abstract/wp/WPBlock";
import Sanitized from "../helpers/Sanitized";
import { getRandomString } from "../../utils/genericUtils";
import ParagraphBlock from "./ParagraphBlock";
import ImageBlock from "./ImageBlock";
import Columns from "./Columns";
import Column from "./Column";


interface Props extends DefaultProps {
    wpBlocks: WPBlock[]
}


// slider
// columns
// column


/**
 * 
 * @since 0.0.1
 */
export default function Block({wpBlocks, ...otherProps}: Props) {

    // TODO: pass these to outer div?
    const { id, className, style, children } = getCleanDefaultProps(otherProps, "Block");


    function renderBlocks(): JSX.Element[] {

        return wpBlocks.map(wpBlock => 
            getBlockByName(wpBlock))
    }
    
    
    /**
     * Get suitable component for given ```wpBlock```. If ```wpBlock.blockName``` is ```null``` return a ```<br />```.
     * 
     * Default is a simple ```<Sanitized />``` component which basically translates to a ```<div>```.
     * 
     * @param wpBlock to determine the right component for
     * @returns a suitable component for given wpBlock
     */
    function getBlockByName(wpBlock: WPBlock): JSX.Element {

        switch (wpBlock.blockName) {
            case "core/paragraph":
                return <ParagraphBlock 
                            key={getRandomString()}
                            wpBlock={wpBlock} 
                            mainTagNames={["p"]}
                        />

            case "core/heading":
                return <ParagraphBlock 
                            key={getRandomString()} 
                            wpBlock={wpBlock} 
                            mainTagNames={["h1", "h2", "h3", "h4", "h5", "h6"]}
                        />

            case "core/image":
                return <ImageBlock 
                            key={getRandomString()} 
                            wpBlock={wpBlock} 
                            mainTagNames={["img"]}
                        />;

            case "core/columns":
                return <Columns wpBlock={wpBlock} />

            case "core/column":
                return <Column wpBlock={wpBlock} />

            // ... TODO

            case null: 
                return <br key={getRandomString()} />;
        }

        return <Sanitized dirtyHTML={wpBlock.innerHTML}>
                    <Block wpBlocks={wpBlock.innerBlocks} />
                </Sanitized>
    }

    return (
        <>
            {renderBlocks()}

            {children}
        </>
    )
}