import { BrowserRouter, Routes, Route } from "react-router-dom";
import StrategyList from "./StrategyList";
import StrategyDetail from "./StrategyDetail";
import Layout from "./Layout";
import StrategyProvider from "./StrategyProvider";
import TradeProvider from "./TradeProvider";
import StrategyForm from "./StrategyForm";
import TradeForm from "./TradeForm";

function App() {
    return (
        <div>

            <BrowserRouter>
                <StrategyProvider>
                    <TradeProvider>
                        <Routes>
                            <Route path="/" element={<Layout />}>
                                <Route index path="strategy/list" element={<StrategyList />} />
                                <Route path="strategy/create" element={<StrategyForm />} />
                                <Route path="strategy/edit/:id" element={<StrategyForm />} />
                                <Route path="strategy/detail/:id" element={<StrategyDetail />} />
                                <Route path="trade/create" element={<TradeForm />} />
                                <Route path="trade/edit/:id" element={<TradeForm />} />
                                <Route path="*" element={"not found"}  />
                            </Route>
                        </Routes>
                    </TradeProvider>
                </StrategyProvider>
            </BrowserRouter>

        </div>
    );
}

export default App;
