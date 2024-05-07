import { TextAlign } from '../CSSTypes';
import WPBlock from './WPBlock';


/**
 * Class defining the "attrs" property of a {@link WPBlock}.
 * 
 * @since 0.0.1
 */
export default class WPBlockAttribute {

    align?: TextAlign | "full";

    className?: string;

    data?: object;
    
    height?: string;

    id?: number;
    
    linkDestination?: string;
    
    sizeSlug?: string;

    textAlign?: TextAlign;

    verticalAlignment?: TextAlign | string;

    width?: string;
}


/**
 * Convert some wp "align" strings to valid css values.
 * 
 * @param align from wp to convert to {@link TextAlign}
 * @return ```TextAlign``` equivalent for given string or just given string
 */
export function parseWPAlignString(align: string | TextAlign): TextAlign {

    // might happen for "verticalAlign"
    if (align === "bottom") 
        return "end";
    
    return align as TextAlign;
}