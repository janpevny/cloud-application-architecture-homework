import { BrowserRouter, Routes, Route } from "react-router-dom";
import StrategyList from "./StrategyList";
import StrategyDetail from "./StrategyDetail";
import Layout from "./Layout";
import Portfolio from "./Portfolio";

function App() {
    return (
        <div>

            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<Portfolio />} />
                        <Route path="strategy-list" element={<StrategyList />} />
                        <Route path="strategy-detail/:id" element={<StrategyDetail />} />
                        <Route path="*" element={"not found"}  />
                    </Route>
                </Routes>
            </BrowserRouter>

        </div>
    );
}

export default App;
