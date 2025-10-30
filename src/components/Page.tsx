import { WpPostType } from "@/abstracts/backendDefinitions/WpPostType";
import type DefaultProps from "@/abstracts/props/DefaultProps";
import { useWpPage } from "@/hooks/useWpPage";
import { useParams } from "react-router-dom";
import ConditionalDiv from "@/components/ConditionalDiv";
import { getDefaultProps } from "@/abstracts/props/DefaultProps";

/**
 * @since 0.0.1
 */
export default function Page(props: DefaultProps<HTMLDivElement>) {
    const { slug } = useParams();
    
    const { data: wpPage } = useWpPage(slug ?? '', WpPostType.PAGE);
    
    const { ...otherProps } = getDefaultProps("Page", props);

    return (
        <ConditionalDiv {...otherProps}>
            <h2>Page</h2>
            <div>{wpPage?.post_title}</div>
        </ConditionalDiv>
    )
} 