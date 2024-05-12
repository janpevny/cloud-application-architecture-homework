import React, { useState, useEffect } from 'react';
import {useParams, useNavigate, useLocation} from 'react-router-dom';
import { useTrades } from './TradeProvider';
import { useStrategies } from './StrategyProvider'; // Import the hook to use strategies

function TradeForm() {
    const { id } = useParams(); // Determines if we are in create or edit mode
    const { createTrade, updateTrade, getTrade } = useTrades();
    const { strategies, fetchStrategies } = useStrategies();
    const navigate = useNavigate();
    const location = useLocation();

    const [trade, setTrade] = useState({
        ticker: '',
        tradeType: '',
        amount: '',
        entryDateTime: '',
        entryPrice: '',
        exitDateTime: '',
        exitPrice: '',
        notes: '',
        strategyId: ''
    });
    const [error, setError] = useState('');

    useEffect(() => {
        fetchStrategies();
        if (id) {
            const fetchTrade = async () => {
                const data = await getTrade(id);
                if (data) setTrade({
                    ...data
                });
            };
            fetchTrade();
        }

        setTrade({ ...trade, strategyId: trade.strategyId || location.state?.strategyId || '' });
    }, [id, getTrade]);

    const handleChange = (event) => {
        let { name, value } = event.target;
        const isNumberField = ['amount', 'entryPrice', 'exitPrice', 'profitLoss'].includes(name);

        // if (['entryDateTime', 'exitDateTime'].includes(name)) {
        //     value = new Date(value).toISOString().slice(0, 19);
        // }

        setTrade(prev => ({
            ...prev,
            [name]: isNumberField ? parseFloat(value) || 0 : value  // Convert to float only if it's a number field
        }));
    };


    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(''); // Reset error state on new submission

        try {
            let response;
            if (id) {
                response = await updateTrade(id, trade);
            } else {
                response = await createTrade(trade);
            }
            console.log(response);
            if (!response.ok) {
                const errorData = await response.json();
                setError(errorData.message || 'An error occurred while saving the trade.'); // Set error message from response
            } else {
                navigate(`/strategy/detail/${trade.strategyId}`);
            }
        } catch (error) {
            console.log(error);
            setError('Network error or server is unreachable.'); // Generic error if fetch fails
        }
    };

    return (
        <div className="container mt-3">
            <h2>{id ? 'Edit Trade' : 'Create Trade'}</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="ticker" className="form-label">Ticker</label>
                    <input type="text" className="form-control" id="ticker" name="ticker" required minLength="1" value={trade.ticker} onChange={handleChange} />
                </div>
                <div className="mb-3">
                    <label htmlFor="strategyId" className="form-label">Strategy</label>
                    <select className="form-control" id="strategyId" name="strategyId" required value={trade.strategyId} onChange={handleChange}>
                        <option value="">Select Strategy</option>
                        {strategies.map(strategy => (
                            <option key={strategy.id} value={strategy.id}>
                                {strategy.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <label htmlFor="tradeType" className="form-label">Trade Type</label>
                    <select className="form-control" id="tradeType" name="tradeType" required value={trade.tradeType} onChange={handleChange}>
                        <option value="">Select Type</option>
                        <option value="long">Long</option>
                        <option value="short">Short</option>
                    </select>
                </div>
                <div className="mb-3">
                    <label htmlFor="amount" className="form-label">Amount</label>
                    <input type="number" className="form-control" id="amount" name="amount" required value={trade.amount} onChange={handleChange} />
                </div>
                <div className="mb-3">
                    <label htmlFor="entryDateTime" className="form-label">Entry Date Time</label>
                    <input type="datetime-local" className="form-control" id="entryDateTime" name="entryDateTime" required value={trade.entryDateTime} onChange={handleChange} />
                </div>
                <div className="mb-3">
                    <label htmlFor="entryPrice" className="form-label">Entry Price</label>
                    <input type="number" className="form-control" id="entryPrice" name="entryPrice" value={trade.entryPrice} onChange={handleChange} />
                </div>
                <div className="mb-3">
                    <label htmlFor="exitDateTime" className="form-label">Exit Date Time</label>
                    <input type="datetime-local" className="form-control" id="exitDateTime" name="exitDateTime" value={trade.exitDateTime} onChange={handleChange} />
                </div>
                <div className="mb-3">
                    <label htmlFor="exitPrice" className="form-label">Exit Price</label>
                    <input type="number" className="form-control" id="exitPrice" name="exitPrice" value={trade.exitPrice} onChange={handleChange} />
                </div>
                <div className="mb-3">
                    <label htmlFor="profitLoss" className="form-label">Profit/Loss (read only)</label>
                    <input type="number" className="form-control" id="profitLoss" name="profitLoss" readOnly value={trade.profitLoss} onChange={handleChange} />
                </div>
                <div className="mb-3">
                    <label htmlFor="notes" className="form-label">Notes</label>
                    <textarea className="form-control" id="notes" name="notes" rows="3" value={trade.notes} onChange={handleChange}></textarea>
                </div>
                <button type="submit" className="btn btn-primary">{id ? 'Update Trade' : 'Create Trade'}</button>
            </form>
        </div>
    );
};

export default TradeForm;
