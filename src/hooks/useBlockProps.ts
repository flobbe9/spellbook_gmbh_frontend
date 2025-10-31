import type WpBlock from "@/abstracts/backendDefinitions/WpBlock";
import type { BlockProps } from "@/components/Block";
import { useDefaultProps } from "./useDefaultProps";
import { isBlank } from "@/helpers/utils";

/**
 * @type T type of the parsed `blockProps.wpBlock`
 * @param componentName see {@link useDefaultProps}
 * @param blockProps props of this component
 * @param parseWpBlock parse `blockProps.wpBlock` to `T` keeping only the content related properties
 * @returns `blockProps` and the parsed wp block
 * @since latest
 */
export function useBlockProps<T>(componentName: string, blockProps: BlockProps, parseWpBlock: (wpBlock: WpBlock, parentBlockName?: string) => T): BlockProps & { parsedWpBlock: T } {
    const defaultProps = useDefaultProps(componentName, blockProps);

    const wpBlockClassName = blockProps.wpBlock.attrs?.["className"] as string;
    if (!isBlank(wpBlockClassName))
        defaultProps.className += ` ${wpBlockClassName}`;

    return {
        ...blockProps,
        ...defaultProps,
        parsedWpBlock: parseWpBlock(blockProps.wpBlock, blockProps.parentBlockName)
    }
}