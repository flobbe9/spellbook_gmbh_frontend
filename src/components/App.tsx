import { BrowserRouter, Route, Routes } from "react-router-dom";
import Page from "./Page";
import Navigation from "./Navigation";

/**
 * @since 0.0.1
 */
export default function App() {

    return (
        <BrowserRouter>
            <Navigation />

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