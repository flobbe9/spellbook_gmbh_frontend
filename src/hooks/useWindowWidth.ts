import { getCssConstant, getCSSValueAsNumber } from "@/helpers/utils";
import { useAppContext } from "./context/useAppContext";

/**
 * @since 0.0.1
 */
export function useWindowWidth() {
    const { windowSize: [windowWidth, ]} = useAppContext();

    const tabletWidth = getCSSValueAsNumber(getCssConstant("tabletWidth"), 2);
    const tabletLandscapeWidth = getCSSValueAsNumber(getCssConstant("tabletLandscapeWidth"), 2);
    const desktopWidth = getCSSValueAsNumber(getCssConstant("desktopWidth"), 2);
    const desktopMonitorWidth = getCSSValueAsNumber(getCssConstant("desktopMonitorWidth"), 2);

    return {
        isMobileWidth: windowWidth < tabletWidth,
        isTabletWidth: windowWidth >= tabletWidth && windowWidth < tabletLandscapeWidth,
        isAtLeastTabletWidth: windowWidth >= tabletWidth,

        isTabletLandscapeWidth: windowWidth >= tabletLandscapeWidth && windowWidth < desktopWidth,
        isAtLeastTabletLandscapeWidth: windowWidth >= tabletLandscapeWidth,
        
        isDesktopWidth: windowWidth >= desktopWidth && windowWidth < desktopMonitorWidth,
        isAtLeastDesktopWidth: windowWidth >= desktopWidth,

        isDesktopMonitorWidth: windowWidth >= desktopMonitorWidth
    }
}