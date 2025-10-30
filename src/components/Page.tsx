import { WpPostType } from "@/abstracts/backendDefinitions/WpPostType";
import type DefaultProps from "@/abstracts/props/DefaultProps";
import { useWpPage } from "@/hooks/useWpPage";
import { useParams } from "react-router-dom";
import ConditionalDiv from "@/components/ConditionalDiv";
import { getDefaultProps } from "@/abstracts/props/DefaultProps";
import Overlay from "./Overlay";
import Pending from "./Pending";

/**
 * @since latest
 */
export default function Page(props: DefaultProps<HTMLDivElement>) {
    const { slug } = useParams();
    
    const { data: wpPage, isPending } = useWpPage(slug ?? '', WpPostType.PAGE);
    
    const { ...otherProps } = getDefaultProps("Page", props);

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