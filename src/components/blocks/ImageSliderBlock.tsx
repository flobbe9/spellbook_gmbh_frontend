import React, { useContext, useEffect, useRef, useState } from "react";
import "../../assets/styles/ImageSliderBlock.css";
import { getCleanDefaultProps } from "../../abstract/props/DefaultProps";
import Flex from "../helpers/Flex";
import { getCssConstant, getCSSValueAsNumber, getRandomString, isBlank, log } from "../../helpers/genericUtils";
import BlockProps, { getCleanBlockProps } from "../../abstract/props/BlockProps";
import WPBlock from "../../abstract/wp/WPBlock";
import { stringToNumber } from '../../helpers/genericUtils';
import { JQueryEasing, Overflow } from "../../abstract/CSSTypes";
import { isImageSliderEmpty, mapDataToSliderImages, WPSliderImage } from "../../abstract/wp/WPSliderImage";
import ImageLink from "../helpers/ImageLink";
import { AppContext } from "../App";


interface Props extends BlockProps {
    wpBlock: WPBlock,
    /** Height of component and thus each image in the slider. Default is ```200px```. Use pixels as unit! */
    height?: string,
    /** Time that one sliding animation takes to finish in ms. Default is 300 */
    duration?: number,
    /** Animation style (jQuery). Default is ```easeOutQuad``` */
    easing?: JQueryEasing,
    /** Amount to slide on one click. Default is 500 (using ```left | right``` css props). */
    slideAmount?: number,
    /** MarginRight applied to each single slider image (except the last). Default is 0 */
    imageMarginRight?: string
}


/**
 * @since 0.0.1
 */
export default function ImageSliderBlock({mainTagNames,
                                        wpBlock,
                                        height = "200px",
                                        duration = 300,
                                        easing = "easeOutQuad",
                                        slideAmount = 500,
                                        imageMarginRight,
                                        ...otherProps
                                    }: Props) {

    const { id, className, style, children } = getCleanBlockProps(otherProps, "ImageSliderBlock");
    const { data = {} } = wpBlock.attrs;

    /** className="ImageSliderBlock" */
    const imageSliderBlockRef = useRef(null);
    /** className="imageContainer" */
    const imageContainerRef = useRef(null);

    const [isSliding, setIsSliding] = useState(false);
    const [isRightArrowDisabled, setIsRightArrowDisabled] = useState(false);
    const [isLeftArrowDisabled, setIsLeftArrowDisabled] = useState(true);

    const { getDeviceWidth } = useContext(AppContext);
    const { isMobileWidth, isTabletWidth } = getDeviceWidth();


    useEffect(() => {
        setTimeout(() => {
            // disable slider if images aren't wider than container
            // wait shortly for images to render on page
            setIsRightArrowDisabled(getOverflowWidth() <= 0);
        }, 100)

    }, [data]);

    
    /**
     * Map ```<ImageLink />``` components from ```data``` object.
     * 
     * @returns array with images to put into slider
     */
    function mapImages(): JSX.Element[] {

        return mapDataToSliderImages(data).map((wpSliderImage, i) => {
            if (!wpSliderImage)
                return<></>;

            const { image, link, open_in_new_tab } = wpSliderImage as WPSliderImage;

            return <ImageLink
                        src={image} 
                        key={getRandomString()}
                        height={getCSSValueAsNumber(height, 2)}
                        style={{
                            // dont give last image in slider a margin
                            marginRight: i === image.length - 1 ? undefined : imageMarginRight
                        }}
                        link={link}
                        linkTarget={open_in_new_tab ? "_blank" : undefined}
                        index={i}
                    />
        });
    }


    function handleRightArrowClick(event): void {

        if (isRightArrowDisabled || isSliding)
            return;

        const overflowWidth = getOverflowWidth();
        let moveLeftAmount = slideAmount;

        // handle disabled
        if (overflowWidth <= moveLeftAmount) {
            moveLeftAmount = overflowWidth;
            setIsRightArrowDisabled(true);
        }
        setIsLeftArrowDisabled(false);

        slide(moveLeftAmount, "right");
    }


    function handleLeftArrowClick(event): void {

        if (isLeftArrowDisabled || isSliding)
            return;

        const sliderContainer = $(imageContainerRef.current!);
        const left = Math.abs(getCSSValueAsNumber(sliderContainer.css("left"), 0));
        let moveRightAmount = slideAmount;

        // handle disabled
        if (left <= moveRightAmount) {
            moveRightAmount = left;
            setIsLeftArrowDisabled(true);
        }
        setIsRightArrowDisabled(false);

        slide(moveRightAmount, "left");
    }


    /**
     * @returns the width of the imageContainer that is not visible inside the imageSliderBlock flex. Return 0 if no slider is present
     */
    function getOverflowWidth(): number {
        
        const imageSliderBlock = $(imageSliderBlockRef.current!);
        const imageContainer = $(imageContainerRef.current!);

        if (!imageSliderBlock || !imageContainer)
            return 0;

        // most outer flex
        const imageSliderBlockWidth = getCSSValueAsNumber(imageSliderBlock.css("width"), 2);
        // flex container
        const imageContainerWidth = getCSSValueAsNumber(imageContainer.css("width"), 2);
        const imageContainerLeft = stringToNumber(imageContainer.css("left"));

        return imageContainerWidth - imageSliderBlockWidth - Math.abs(imageContainerLeft);
    }


    /**
     * @param amount to slide (using ```left``` and ```right``` css props)
     * @param direction to slide to. Sliding to the right will show more images on the right side
     * @param onComplete callback to execute after animation has finished
     */
    function slide(amount: number, direction: "right" | "left", onComplete?: () => any): void {

        setIsSliding(true);

        const sliderContainer = $(imageContainerRef.current!);
        const right = getCSSValueAsNumber(sliderContainer.css("right"), 0);

        sliderContainer.animate(
            {
                "left": undefined, 
                "right": direction === "right" ? right + amount : right - amount
            }, 
            duration,
            easing,
            () => {
                if (onComplete)
                    onComplete();

                setIsSliding(false);
            }
        );
    }


    function getContainerCssOverflow(): Overflow {

        return isMobileWidth || isTabletWidth ? "auto" : "hidden";
    }


    return (
        <div 
            id={id} 
            className={className + (wpBlock.attrs.className || "") + (isImageSliderEmpty(data) ? " hidden" : "")}
            style={{
                ...style,
            }}
            ref={imageSliderBlockRef}
        >
            <Flex 
                className={"imageSliderBlockContainer " + (data["full_width"] && "fullWidth")}
                style={{
                    height: height,
                    overflowX: getContainerCssOverflow()
                }}
                verticalAlign="center"
            >
                {/* Images */}
                <Flex 
                    className="imageContainer" 
                    ref={imageContainerRef}
                    flexWrap="nowrap"
                >
                    {mapImages()}
                </Flex>

                {/* Arrow left */}
                <Flex 
                    className={"leftArrowContainer " + (isLeftArrowDisabled ? "disabled" : "enabled")} 
                    verticalAlign="center"
                    onClick={handleLeftArrowClick}
                    rendered={!isMobileWidth && !isTabletWidth}
                >
                    <i className={"fa-solid fa-chevron-down leftArrow textCenter " + (isLeftArrowDisabled ? "disabled" : "enabled")}></i>
                </Flex>

                {/* Arrow right */}
                <Flex 
                    className={"rightArrowContainer " + (isRightArrowDisabled ? "disabled" : "enabled")} 
                    verticalAlign="center"
                    onClick={handleRightArrowClick}
                    rendered={!isMobileWidth && !isTabletWidth}
                >
                    <i className={"fa-solid fa-chevron-down rightArrow textCenter " + (isRightArrowDisabled ? "disabled" : "enabled")}></i>
                </Flex>
            </Flex>

            {children}
        </div>
    )
}