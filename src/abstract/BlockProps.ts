import DefaultProps, { getCleanDefaultProps } from "./DefaultProps";

/**
 * @since 0.0.1
 */
export default interface BlockProps extends DefaultProps {
    /** Tag names that component props will be passed to. Default is ```["div"]``` */
    mainTagNames?: (keyof HTMLElementTagNameMap)[]
}


/**
 * @param blockProps to clean up
 * @param componentName to prepend to id and className. Optional
 * @param componentNameAsId if true, the ```componentName``` will be prepended to id. Default is false
 * @returns ```getCleanDefaultProps()``` with "Block" appended to className.
 * @see {@link getCleanDefaultProps}
 */
export function getCleanBlockProps(blockProps: BlockProps, componentName?: string, componentNameAsId = false) {

    const defaultProps = getCleanDefaultProps(blockProps, componentName, componentNameAsId);
    defaultProps.className += " WideBlock ";

    return defaultProps;
}