import { WpPostType } from "@/abstracts/backendDefinitions/WpPostType";
import type { CustomResponseFormat } from "@/abstracts/CustomResponseFormat";
import type DefaultProps from "@/abstracts/props/DefaultProps";
import ConditionalDiv from "@/components/ConditionalDiv";
import { useDefaultProps } from "@/hooks/useDefaultProps";
import { useWpPage } from "@/hooks/useWpPage";
import { useEffect, useState, type JSX } from "react";
import { useParams } from "react-router-dom";
import _404 from "./_404";
import Block from "./Block";
import Pending from "./Pending";

/**
 * Handle all wordpress pages in here, as well as 404 page if `slug` is invalid.
 * 
 * @since latest
 */
export default function Page(props: DefaultProps<HTMLDivElement>) {
    const { slug } = useParams();
    
    const { data: wpPage, isPending } = useWpPage(slug ?? '', WpPostType.PAGE, {onError: handleError});

    /** Should be `true` if `slug` could not be found */
    const [is404, set404] = useState(false);
    const [blocks, setBlocks] = useState<JSX.Element[]>([])

    const { ...otherProps } = useDefaultProps("Page", props);

    useEffect(() => {
        setBlocks(mapBlocks());
    }, [wpPage])

    function mapBlocks(): JSX.Element[] {
        return wpPage?.blocks?.map((wpBlock, i) => 
            <Block key={i} wpBlock={wpBlock} blockDimensionProps={{mode: null}} />)
    }

    function handleError(response: CustomResponseFormat): void {
        if (response.status === 404)
            set404(true);
    }

    if (is404)
        return <_404 />;

    return (
        <ConditionalDiv {...otherProps}>
            <Pending isPending={isPending} />

            {blocks}
{/* 
            <BlockDimensions mode="margin-auto">
                <div style={{fontSize: "2em", fontWeight: 300}}>Thin</div>
                <div style={{fontSize: "2em", fontWeight: 400}}>Regular</div>

                <div style={{fontSize: "2em", fontWeight: 500}}>Medium</div>
                <div style={{fontSize: "2em", fontWeight: 600}}>SemiBold</div>
                <div style={{fontSize: "2em", fontWeight: 700}}>Bold</div>

                <h1>h1</h1>
                <h2>h2</h2>
                <h3>h3</h3>
                <h4>h4</h4>
                <h5>h5</h5>
                <h6>h6</h6>

                <p>p</p>
            </BlockDimensions> */}
        </ConditionalDiv>
    )
} 