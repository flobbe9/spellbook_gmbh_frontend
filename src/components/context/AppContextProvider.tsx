import { createContext, useEffect, useState, type ReactNode } from "react";

/**
 * Only define global stuff in here.
 * 
 * @since latest
 */
export default function AppContextProvider({children}: {children: ReactNode}) {
    const [windowSize, setWindowSize] = useState<[number, number]>([0, 0]);
    
    const context = {
        windowSize
    };

    useEffect(() => {
        window.addEventListener("resize", handleWindowResize)

        return () => {
            window.removeEventListener("resize", handleWindowResize);
        }
    }, []);

    function handleWindowResize(): void {
        setWindowSize([window.outerWidth, window.outerHeight]);
    }

    return (
        <AppContext.Provider value={context}>
            {children}
        </AppContext.Provider>
    );
}

export const AppContext = createContext({
    windowSize: [0, 0] as [number, number]
})