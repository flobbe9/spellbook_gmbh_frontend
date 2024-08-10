import { CSSProperties } from 'react';
import DefaultProps from './DefaultProps';


/**
 * Props for helper components. Extends {@link DefaultProps}.
 * 
 * @since 0.1.4
 */
export default interface HelperProps extends DefaultProps {

    title?: string,
    /** If false, this component will get passed ```display: none``` */
    rendered?: boolean,
    disabled?: boolean,
    /** Style for given event */
    _hover?: CSSProperties,
    /** Style for given event */
    _focus?: CSSProperties,
    /** Style for given event */
    _disabled?: CSSProperties
}