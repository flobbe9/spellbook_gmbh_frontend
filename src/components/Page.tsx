import { WpPostType } from "@/abstracts/backendDefinitions/WpPostType";
import type { CustomResponseFormat } from "@/abstracts/CustomResponseFormat";
import type DefaultProps from "@/abstracts/props/DefaultProps";
import { getDefaultProps } from "@/abstracts/props/DefaultProps";
import ConditionalDiv from "@/components/ConditionalDiv";
import { useWpPage } from "@/hooks/useWpPage";
import { useState } from "react";
import { useParams } from "react-router-dom";
import _404 from "./_404";
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
    
    const { ...otherProps } = getDefaultProps("Page", props);

    function handleError(response: CustomResponseFormat): void {
        if (response.status === 404)
            set404(true);
    }

    if (is404)
        return <_404 />;

    return (
        <ConditionalDiv {...otherProps}>
            <Pending isPending={isPending} fitParent={false} />

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
        </ConditionalDiv>
    )
} 