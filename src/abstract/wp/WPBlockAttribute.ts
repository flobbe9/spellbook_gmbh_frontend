import WPBlock from './WPBlock';


/**
 * Class defining the "attrs" property of a {@link WPBlock}.
 * 
 * @since 0.0.1
 */
export default class WPBlockAttribute {

    align?: TextAlign;

    className?: string; // TODO: 
    
    height?: string;

    id?: number;
    
    linkDestination?: string; // TODO: make this a type?
    
    /** Estimates the size of the element (an image e.g.) */
    sizeSlug?: string; // TODO: make this a type?

    textAlign?: TextAlign;

    width?: "auto" | "<length>" | "<percentage>" | "min-content" | "max-content" | "fit-content" | "fit-content(<length-percentage>)";

}


export type TextAlign = "start" | "end" | "left" | "right" | "center" | "justify" | "match-parent";