import { parseWpSliderBlock } from "@/abstracts/backendDefinitions/blocks/WpSliderBlock";
import { useBlockProps } from "@/hooks/useBlockProps";
import { type JSX, useEffect, useState } from "react";
import { Carousel } from "react-bootstrap";
import type { BlockProps } from "../Block";
import Conditional from "../Conditional";
import Sanitized from "../Sanitized";

/**
 * @since latest
 */
export default function SliderBlock(props: BlockProps) {
    const componentName = "SliderBlock";
    const { children, wpBlock, parsedWpBlock, ...otherProps } = useBlockProps(componentName, props, parseWpSliderBlock);

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
                        <img src={slide.image_url} alt="" />
                    }

                    {type === "video" && 
                        <img src={slide.video_url} alt="" />
                    }

                    {type === "text" && 
                        <Sanitized dirtyHTML={slide.html} />
                    }
                </Carousel.Item>
            ));
    }

    return (
        <Conditional {...otherProps}>
            <Carousel interval={null}>
                {slides}
            </Carousel>
        </Conditional>
    )
}