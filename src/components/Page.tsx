import { WpPostType } from "@/abstracts/backendDefinitions/WpPostType";
import type DefaultProps from "@/abstracts/props/DefaultProps";
import { useWpPage } from "@/hooks/useWpPage";
import { useParams } from "react-router-dom";
import ConditionalDiv from "@/components/ConditionalDiv";
import { getDefaultProps } from "@/abstracts/props/DefaultProps";
import Overlay from "./Overlay";

/**
 * @since 0.0.1
 */
export default function Page(props: DefaultProps<HTMLDivElement>) {
    const { slug } = useParams();
    
    const { data: wpPage, isPending } = useWpPage(slug ?? '', WpPostType.PAGE);
    
    const { ...otherProps } = getDefaultProps("Page", props);

    return (
        <ConditionalDiv {...otherProps}>
            <Overlay 
                isOverlayVisible={isPending} 
                setOverlayVisible={() => {/** Not implemented */}} 
                hideOnClick={false}
                hideOnEscape={false}
                fitParent={false}
            >
                Loading...
            </Overlay>

            <h2>Page</h2>
            <div>{wpPage?.post_title}</div>
        </ConditionalDiv>
    )
} 