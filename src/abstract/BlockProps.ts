import DefaultProps from "./DefaultProps";

/**
 * @since 0.0.1
 */
export default interface BlockProps extends DefaultProps {
    /** Tag names that component props will be passed to */
    mainTagNames?: (keyof HTMLElementTagNameMap)[]
}