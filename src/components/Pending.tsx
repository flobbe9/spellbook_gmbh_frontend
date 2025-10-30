import type DefaultProps from "@/abstracts/props/DefaultProps";
import Overlay from "./Overlay";
import { getCssConstant, getCSSValueAsNumber } from "@/helpers/utils";
import { getDefaultProps } from "@/abstracts/props/DefaultProps";

interface Props extends DefaultProps<HTMLDivElement> {
    /** @see Overlay */
    fitParent?: boolean,
    /** Applied to images, children get .5 less. Default is 2 (2rem, 1.5rem for children) */
    sizeRem?: number,
    isPending: boolean
}

/**
 * {@link Overlay} with a small animation and children as label.
 * @since latest
 */
export default function Pending({
    isPending,
    fitParent,
    sizeRem = 2,
    ...props
}: Props) {
    const componentName = "Pending";
    const { children, ...otherProps } = getDefaultProps(componentName, props);

    const rootFontSize = getCssConstant("fontSize");
    const rootFontSizeValue = getCSSValueAsNumber(rootFontSize, 2);

    const childrenSizeRem = sizeRem <= .5 ? sizeRem : sizeRem - .5;

    return (
        <Overlay 
            isOverlayVisible={isPending} 
            setOverlayVisible={() => {/** Not implemented */}}
            hideOnClick={false}
            hideOnEscape={false}
            fitParent={fitParent}
            {...otherProps}
        >
            <div className={`${componentName}-imageContainer`}>
                <img className={`${componentName}-dotImage ${componentName}-dotImage-1`} src={"/images/companyNameOTransparent.png"} height={rootFontSizeValue * sizeRem} />
                <img className={`${componentName}-dotImage ${componentName}-dotImage-2`} src={"/images/companyNameOTransparent.png"} height={rootFontSizeValue * sizeRem} />
                <img className={`${componentName}-dotImage ${componentName}-dotImage-3`} src={"/images/companyNameOTransparent.png"} height={rootFontSizeValue * sizeRem} />
            </div>
            
            <div className={`${componentName}-childrenContainer`} style={{fontSize: `${rootFontSizeValue * childrenSizeRem}px`}}>
                {children ?? <div>Lade...</div>}
            </div>
        </Overlay>
    )
}