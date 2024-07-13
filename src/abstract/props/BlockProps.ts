import WPBlock from "../wp/WPBlock";
import DefaultProps, { getCleanDefaultProps } from "./DefaultProps";

/**
 * @since 0.0.1
 */
export default interface BlockProps extends DefaultProps {
    
    /** Block containing all content to display for this component */
    wpBlock: WPBlock
    /** Tag names that component props will be passed to. Default is ```["div"]``` */
    mainTagNames?: (keyof HTMLElementTagNameMap)[],
}


/**
 * @param defaultProps to clean up
 * @param componentName to prepend to id and className. Optional
 * @param componentNameAsId if true, the ```componentName``` will be prepended to id. Default is false
 * @returns ```getCleanDefaultProps()``` with "Block" appended to className.
 * @see {@link getCleanDefaultProps}
 */
export function getCleanBlockProps(defaultProps: DefaultProps, componentName?: string, componentNameAsId = false) {

    const cleanDefaultProps = getCleanDefaultProps(defaultProps, componentName, componentNameAsId);
    cleanDefaultProps.className += " WideBlock ";

    return cleanDefaultProps;
}