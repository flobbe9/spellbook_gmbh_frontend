import type DefaultProps from "@/abstracts/props/DefaultProps";
import { useDefaultProps } from "@/hooks/useDefaultProps";
import { forwardRef, useEffect, useImperativeHandle, useRef, type Ref } from "react";
import ConditionalDiv from "./ConditionalDiv";
import { animateAndCommit, fadeIn, fadeOut, getCssConstant } from "@/helpers/utils";
import type { CustomKeyframeAnimationOptions } from "@/abstracts/CustomKeyframeAnimationOptions";


interface Props extends DefaultProps<HTMLDivElement> {
    /** Default is ```true``` */
    hideOnClick?: boolean,

    /** Default is ```false``` */
    hideOnEscape?: boolean,

    isOverlayVisible: boolean,
    setOverlayVisible: (isVisible: boolean) => void,

    /** Indicates whether the overlay should only cover the it's parent. Will only work if parent has a relative position. Default is ```true``` */
    fitParent?: boolean,

    /** The duration in millis that the overlay fades in. Default is 200 */
    fadeInDuration?: number,
    /** The duration in millis that the overlay fades out. Default is 200 */
    fadeOutDuration?: number
}


/**
 * Opacity 0 by default.
 * 
 * @since latest
 */
export default forwardRef(function Overlay(
    {
        hideOnClick = true,
        hideOnEscape = false,
        isOverlayVisible,
        setOverlayVisible,
        fitParent = true,
        fadeInDuration = 200,
        fadeOutDuration = 200,
        onClick,
        onKeyDown,
        ...props
    }: Props,
    ref: Ref<HTMLDivElement>
) {
    const componentName = "Overlay";
    const { style, children, ...otherProps } = useDefaultProps(componentName, props);

    const componentRef = useRef<HTMLDivElement>(null);
    const backgroundRef = useRef<HTMLDivElement>(null);
    const childrenRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => componentRef.current!, []);

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        }
    }, [hideOnEscape]);

    useEffect(() => {
        handleStateChange(isOverlayVisible);

    }, [isOverlayVisible]);

    function hideOverlay(): void {
        const background = backgroundRef.current!;
        const children = childrenRef.current!;

        // hide children
        children.style.opacity = "0";

        const options = {
            duration: fadeOutDuration, 
            easing: "ease-out", 
        };

        fadeOut(background, {...options, onComplete: () => componentRef.current!.style.zIndex = "-1"});
        fadeOut(children, options);
    }

    function showOverlay(): void {
        const background = backgroundRef.current!;
        const children = childrenRef.current!;

        const options: CustomKeyframeAnimationOptions = { 
            duration: fadeInDuration,
            easing: "ease-in",
            displayVisible: "flex"
        }

        componentRef.current!.style.zIndex = getCssConstant("overlayZIndex");
        animateAndCommit(
            background,
            { opacity: 0.5 },
            options
        );

        fadeIn(children, options);
    }

    function handleStateChange(isOverlayVisible: boolean): void {
        if (isOverlayVisible)
            showOverlay();

        else
            hideOverlay();
    }

    function handleClick(event): void {
        if (hideOnClick)
            hideOverlay();

        if (onClick)
            onClick(event);
    }

    function handleKeyDown(event: KeyboardEvent): void {
        const keyName = event.key;

        if (keyName === "Escape")
            handleEscape(event);
    }

    function handleEscape(_event: KeyboardEvent): void {
        if (hideOnEscape)
            hideOverlay();
    }
    
    return (
        <ConditionalDiv
            style={{
                ...style,
                position: fitParent ? "absolute" : "fixed"
            }}
            ref={componentRef}
            onClick={handleClick}
            {...otherProps}
        >
            <div className={`${componentName}-background`} ref={backgroundRef}></div>
            <div 
                className={`${componentName}-childrenContainer d-flex justify-content-center align-items-center`}
                ref={childrenRef}
            >
                {children}
            </div>
        </ConditionalDiv>
    )
})