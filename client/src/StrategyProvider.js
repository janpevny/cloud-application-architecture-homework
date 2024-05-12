import React, { createContext, useContext, useState } from 'react';

const StrategyContext = createContext(null);

// Custom hook for easy consumption of context
export const useStrategies = () => useContext(StrategyContext);

const StrategyProvider = ({ children }) => {
    const [strategies, setStrategies] = useState([]);

    const backendUrl = 'http://localhost:8000/strategy'

    // Fetch all strategies
    const fetchStrategies = async () => {
        try {
            const response = await fetch(`${backendUrl}/list`);
            const data = await response.json();
            setStrategies(data);
        } catch (error) {
            console.error('Failed to fetch strategies:', error);
        }
    };

    // Fetch a single strategy
    const getStrategy = async (id) => {
        try {
            const response = await fetch(`${backendUrl}/get?id=${id}`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Failed to fetch strategy:', error);
        }
    };

    // Create a strategy
    const createStrategy = async (strategy) => {
        try {
            const response = await fetch(`${backendUrl}/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(strategy),
            });
            if (response.ok) {
                fetchStrategies();  // Refresh the list
            }
        } catch (error) {
            console.error('Failed to create strategy:', error);
        }
    };

    // Update a strategy
    const updateStrategy = async (id, strategy) => {
        try {
            const response = await fetch(`${backendUrl}/update`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id, ...strategy }),
            });
            if (response.ok) {
                fetchStrategies();  // Refresh the list
            }
        } catch (error) {
            console.error('Failed to update strategy:', error);
        }
    };

    // Delete a strategy
    const deleteStrategy = async (id) => {
        try {
            const response = await fetch(`${backendUrl}/delete`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id }),
            });
            if (response.ok) {
                fetchStrategies();  // Refresh the list
            }
        } catch (error) {
            console.error('Failed to delete strategy:', error);
        }
    };

    return (
        <StrategyContext.Provider value={{
            strategies,
            fetchStrategies,
            getStrategy,
            createStrategy,
            updateStrategy,
            deleteStrategy,
        }}>
            {children}
        </StrategyContext.Provider>
    );
};

export default StrategyProvider;
