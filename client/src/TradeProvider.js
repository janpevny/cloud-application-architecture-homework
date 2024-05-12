import React, { createContext, useContext, useState } from 'react';

const TradeContext = createContext(null);

// Custom hook for easy consumption of context
export const useTrades = () => useContext(TradeContext);

const TradeProvider = ({ children }) => {
    const [trades, setTrades] = useState([]);

    const backendUrl = 'http://localhost:8000/trade'

    // Fetch all trades
    const fetchTrades = async () => {
        try {
            const response = await fetch(`${backendUrl}/list`);
            const data = await response.json();
            setTrades(data);
        } catch (error) {
            console.error('Failed to fetch trades:', error);
        }
    };

    // Fetch trades by strategy
    const fetchTradesByStrategy = async (strategyId) => {
        try {
            const response = await fetch(`${backendUrl}/list-by-strategy?strategyId=${strategyId}`);
            const data = await response.json();
            return data;  // Return data for specific use-cases
        } catch (error) {
            console.error('Failed to fetch trades by strategy:', error);
        }
    };

    const getTrade = async (id) => {
        try {
            const response = await fetch(`${backendUrl}/get?id=${id}`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Failed to fetch trade:', error);
        }
    };

    // Create a trade
    const createTrade = async (trade) => {
        try {
            const response = await fetch(`${backendUrl}/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(trade),
            });
            if (response.ok) {
                return response;
            }
        } catch (error) {
            console.error('Failed to create trade:', error);
            return error;
        }
    };

    // Update a trade
    const updateTrade = async (id, trade) => {
        try {
            const response = await fetch(`${backendUrl}/update`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id, ...trade }),
            });
            if (response.ok) {
                return response;
            }
        } catch (error) {
            console.error('Failed to update trade:', error);
            return error;
        }
    };

    // Delete a trade
    const deleteTrade = async (id) => {
        try {
            const response = await fetch(`${backendUrl}/delete`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id }),
            });
            if (response.ok) {
                fetchTrades();  // Refresh the list
            }
        } catch (error) {
            console.error('Failed to delete trade:', error);
        }
    };

    return (
        <TradeContext.Provider value={{
            trades,
            getTrade,
            fetchTrades,
            fetchTradesByStrategy,
            createTrade,
            updateTrade,
            deleteTrade,
        }}>
            {children}
        </TradeContext.Provider>
    );
};

export default TradeProvider;
