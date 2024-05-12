import React, { useEffect, useState } from 'react';
import {useLocation, useNavigate, useParams} from 'react-router-dom';
import { useStrategies } from './StrategyProvider';
import { useTrades } from './TradeProvider';
import { Link } from 'react-router-dom';


function StrategyDetail() {
    const { id } = useParams();  // Get the ID from URL parameters
    const { getStrategy } = useStrategies();
    const { fetchTradesByStrategy } = useTrades();
    const [strategy, setStrategy] = useState(null);
    const [trades, setTrades] = useState([]);
    const [metrics, setMetrics] = useState({
        averageTrade: 0,
        winRate: 0,
        averageGain: 0,
        averageLoss: 0,
        profitFactor: 0,
        riskRewardRatio: 0,
        hasTrades: true
    });

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const loadData = async () => {
            const strategyData = await getStrategy(id);
            setStrategy(strategyData);
            const tradeData = await fetchTradesByStrategy(id);
            setTrades(tradeData);
            calculateMetrics(tradeData);
            console.log(metrics)
        };
        loadData();
    }, [id, getStrategy, fetchTradesByStrategy]);

    const calculateMetrics = (trades) => {
        const relevantTrades = trades.filter(trade => trade.profitLoss > 0 || trade.profitLoss < 0);
        if (relevantTrades.length === 0) {
            setMetrics({
                averageTrade: 0,
                winRate: 0,
                averageGain: 0,
                averageLoss: 0,
                profitFactor: 0,
                riskRewardRatio: 0,
                hasTrades: false  // Indicator to show or hide metrics display
            });
            return;
        }

        const profits = relevantTrades.filter(trade => trade.profitLoss > 0).map(trade => trade.profitLoss);
        const losses = relevantTrades.filter(trade => trade.profitLoss < 0).map(trade => -trade.profitLoss);
        const averageTrade = relevantTrades.reduce((acc, trade) => acc + trade.profitLoss, 0) / relevantTrades.length;
        const winRate = (profits.length / relevantTrades.length) * 100;
        const averageGain = profits.reduce((acc, profit) => acc + profit, 0) / (profits.length || 1);  // Avoid division by zero
        const averageLoss = losses.reduce((acc, loss) => acc + loss, 0) / (losses.length || 1);
        const totalProfit = profits.reduce((acc, profit) => acc + profit, 0);
        const totalLoss = losses.reduce((acc, loss) => acc + loss, 0);
        const profitFactor = totalLoss === 0 ? 'infinity' : totalProfit / totalLoss;
        const riskRewardRatio = averageGain === 0 ? 'infinity' : averageLoss / averageGain;

        setMetrics({
            averageTrade,
            winRate,
            averageGain,
            averageLoss,
            profitFactor,
            riskRewardRatio,
            hasTrades: true
        });
    };

    const handleAddTradeClick = () => {
        navigate(`/trade/create`, { state: { strategyId: id } }); // Pass strategy ID via state
    };

    if (!strategy) {
        return <div className="container mt-3">Loading strategy details...</div>;
    }

    return (
        <div className="container mt-3">
            <h1 className="mb-3">{strategy.name} - Strategy Details</h1>
            <p>Entry Strategy: {strategy.entryStrategy}</p>
            <p>Exit Strategy: {strategy.exitStrategy}</p>
            <div className="mt-4">
                <h2>Metrics</h2>
                {metrics.hasTrades ? (
                    <ul>
                        <li>Average Trade: {metrics.averageTrade.toFixed(2)}</li>
                        <li>Win Rate: {metrics.winRate.toFixed(2)}%</li>
                        <li>Average Gain: ${metrics.averageGain.toFixed(2)}</li>
                        <li>Average Loss: ${metrics.averageLoss.toFixed(2)}</li>
                        <li>Profit Factor: {metrics.profitFactor}</li>
                        <li>Risk/Reward Ratio: {metrics.riskRewardRatio}</li>
                    </ul>
                ) : (
                    <p>No relevant trades found for this strategy.</p>
                )}
            </div>
            <div className="mt-4">
                <h2>Trades for this Strategy</h2>
                <button className="btn btn-primary" onClick={handleAddTradeClick}>
                    Add Trade for this Strategy
                </button>
                {trades.length > 0 ? (
                    <div className="table-responsive">
                        <table className="table table-striped table-hover">
                            <thead>
                            <tr>
                                <th>Ticker</th>
                                <th>Trade Type</th>
                                <th>Amount</th>
                                <th>Entry DateTime</th>
                                <th>Exit DateTime</th>
                                <th>Profit/Loss</th>
                                <th>Notes</th>
                                <th></th>
                            </tr>
                            </thead>
                            <tbody>
                            {trades.map((trade) => (
                                <tr key={trade.id}>
                                    <td>{trade.ticker}</td>
                                    <td>{trade.tradeType}</td>
                                    <td>{trade.amount}</td>
                                    <td>{trade.entryDateTime}</td>
                                    <td>{trade.exitDateTime}</td>
                                    <td>{trade.profitLoss}</td>
                                    <td>{trade.notes}</td>
                                    <td>
                                        <Link to={`/trade/edit/${trade.id}`} className="btn btn-secondary btn-sm me-2">Edit</Link>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p>No trades found for this strategy.</p>
                )}
            </div>
        </div>
    );
}

export default StrategyDetail;