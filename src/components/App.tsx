import { BrowserRouter, Route, Routes } from "react-router-dom";
import Page from "./Page";
import Navigation from "./Navigation";

export default function App() {

    return (
        <BrowserRouter>
            <Navigation />
            
            <Routes>
                <Route path="/" Component={() => <Page />} />
                <Route path="/:slug" Component={() => <Page />} />
            </Routes>
        </BrowserRouter>
    )
}