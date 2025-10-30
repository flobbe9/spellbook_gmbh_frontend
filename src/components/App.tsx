import { BrowserRouter, Route, Routes } from "react-router-dom";
import Page from "./Page";

/**
 * @since latest
 */
export default function App() {

    return (
        <BrowserRouter>
            {/* <Navigation /> */}

            <main>
                <Routes>
                    <Route path="/" Component={() => <Page />} />
                    <Route path="/:slug" Component={() => <Page />} />
                </Routes>
            </main>

            {/* Footer */}
        </BrowserRouter>
    )
}