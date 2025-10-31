import type DefaultProps from "@/abstracts/props/DefaultProps";
import { useDefaultProps } from "@/hooks/useDefaultProps";
import { useWpNavigationLinks } from "@/hooks/useWpNavigationLinks";
import { useWpNavigationMenus } from "@/hooks/useWpNavigationMenus";
import ConditionalDiv from "./ConditionalDiv";
import { Link } from "react-router-dom";

/**
 * @since latest
 */
export default function Navigation(props: DefaultProps<HTMLDivElement>) {
    const componentName = "Navigation";
    const { ...otherProps } = useDefaultProps(componentName, props);
    
    const { data: navigationMenus } = useWpNavigationMenus();
    const { data: navigationLinks } = useWpNavigationLinks();

    return (
        <ConditionalDiv {...otherProps}>
            {navigationMenus?.map(
                (navigationMenu, i) => (
                    <div key={i}>
                        <span>Menu: {navigationMenu.label} </span>
                        Items: {navigationMenu.items.map((navigationLink, i) => (
                            <Link key={i} to={navigationLink.url} target={navigationLink.linkAttributes.target}>{navigationLink.label}</Link>
                        ))}
                    </div>
                ))}
                
            <span>NavLinks:</span>
            {navigationLinks?.map((navigationLink, i) => (
                <Link key={i} to={navigationLink.url} target={navigationLink.linkAttributes.target}>{navigationLink.label}</Link>
            ))}
        </ConditionalDiv>
    )
}