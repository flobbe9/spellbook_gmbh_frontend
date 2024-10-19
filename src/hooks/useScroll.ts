import { useEffect } from "react";


/**
 * Scrolls to given position on render. Default is 0, 0 on first render only.
 * 
 * @param x horizontal coordinate to scroll to. Default is 0
 * @param y vertical coordinate to scroll to. Default is 0
 * @param states to trigger this hook on
 * @since latest
 */
export default function useScroll(x = 0, y = 0, ...states) {

    useEffect(() => {
        window.scroll(x, y);

    }, [...states]);
}