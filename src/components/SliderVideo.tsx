import type DefaultProps from "@/abstracts/props/DefaultProps";
import { useDefaultProps } from "@/hooks/useDefaultProps";
import { useRef, useState, type HTMLAttributes } from "react";
import ConditionalDiv from "./ConditionalDiv";

interface Props extends DefaultProps {
    /** Video url */
    url: string,
    /**
     * Defaults are `autoPlay`, `muted`
     */
    videoProps?: HTMLAttributes<HTMLVideoElement>
}

/**
 * @since latest
 */
export default function SliderVideo({url, videoProps = {}, ...props}: Props) {
    const [isPlaying, setPlaying] = useState(true);

    const componentName = "SliderVideo";
    const videoRef = useRef<HTMLVideoElement>(null);

    const { ...otherProps } = useDefaultProps(componentName, props);

    function togglePausePlay(): void {
        if (videoRef.current.paused) {
            setPlaying(true);
            videoRef.current.play();

        } else {
            setPlaying(false);
            videoRef.current.pause();
        }
    }

    return (
        <ConditionalDiv {...otherProps}>
            <video ref={videoRef} autoPlay muted {...videoProps} src={url} />
            <button 
                className={`${componentName}-playButton`} 
                title={`${isPlaying ? "Pause" : "Play"}`}
                onClick={togglePausePlay}
            >
                {isPlaying ? <span>||</span> : <span>&#x25B6;</span>}
            </button>
        </ConditionalDiv>
    )
}