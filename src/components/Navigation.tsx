import type DefaultProps from "@/abstracts/props/DefaultProps";
import { useWpNavigationLinks } from "@/hooks/useWpNavigationLinks";
import { useWpNavigationMenus } from "@/hooks/useWpNavigationMenus";


export default function Navigation(props: DefaultProps<HTMLDivElement>) {

    const { data: navigationMenus } = useWpNavigationMenus();
    const { data: navigationLinks } = useWpNavigationLinks();

    return (
        <div>
            {navigationMenus?.map((navigationMenu, i) => <div key={i}>{navigationMenu.label}</div>)}
            {navigationLinks?.map((navigationMenu, i) => <div key={i}>{navigationMenu.label}</div>)}
        </div>
    )
}