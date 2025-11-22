import { parseWpSliderBlock } from "@/abstracts/backendDefinitions/blocks/WpSliderBlock";
import { useBlockProps } from "@/hooks/useBlockProps";
import { useWindowWidth } from "@/hooks/useWindowWidth";
import { type JSX, useEffect, useRef, useState } from "react";
import { Carousel } from "react-bootstrap";
import type { BlockProps } from "../Block";
import ConditionalDiv from "../ConditionalDiv";
import Sanitized from "../Sanitized";
import { logDebug } from "@/helpers/logUtils";
import { useHasComponentMounted } from "@/hooks/useHasComponentMounted";
import SliderVideo from "../SliderVideo";

/**
 * @since latest
 */
export default function SliderBlock(props: BlockProps) {
    const componentName = "SliderBlock";
    const { children, wpBlock, parsedWpBlock, ...otherProps } = useBlockProps(componentName, props, parseWpSliderBlock);

    const { isMobileWidth } = useWindowWidth();

    const [slides, setSlides] = useState<JSX.Element[]>([]);

    useEffect(() => {
        setSlides(mapSlides());
    }, [wpBlock]);

    function mapSlides(): JSX.Element[] {
        if (!parsedWpBlock?.slides) 
            return [];

        return parsedWpBlock.slides
            .map(({type, ...slide}, i) => (
                <Carousel.Item key={i}>
                    {type === "image" &&
                        <div
                            className={`${componentName}-slide-image`}
                            style={{
                                backgroundImage: `url(${slide.image_url})`,
                            }}
                        ></div>
                    }

                    {type === "video" && 
                        <SliderVideo url={slide.video_url} className={`${componentName}-slide-video`} />
                    }

                    {type === "text" && 
                        <Sanitized dirtyHTML={slide.html} />
                    }
                </Carousel.Item>
            ));
    }

    return (
        <ConditionalDiv {...otherProps}>
            <Carousel interval={null} controls={!isMobileWidth}>
                {slides}
            </Carousel>
        </ConditionalDiv>
    )
}