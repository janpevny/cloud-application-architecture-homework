import React, { useEffect } from 'react';
import { useStrategies } from './StrategyProvider';
import { Link } from 'react-router-dom';

function StrategyList() {
    const { strategies, fetchStrategies } = useStrategies();

    useEffect(() => {
        fetchStrategies();
    }, []);

    return (
        <div className="container mt-5">
            <h1 className="mb-3">Strategies</h1>
            <div className="list-group">
                {strategies.map((strategy) => (
                    <div key={strategy.id} className="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
                        {strategy.name}
                        <div>
                            <Link to={`/strategy/detail/${strategy.id}`} className="btn btn-primary me-2">
                                View
                            </Link>
                            <Link to={`/strategy/edit/${strategy.id}`} className="btn btn-secondary me-2">
                                Edit
                            </Link>

                        </div>
                    </div>
                ))}
            </div>

            <Link to={`/strategy/create`} className="btn btn-primary mt-4">
                New Strategy
            </Link>
        </div>
    );
}

export default StrategyList;