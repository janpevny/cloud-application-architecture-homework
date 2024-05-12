import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStrategies } from './StrategyProvider';

const StrategyForm = () => {
    const { id } = useParams(); // This will be undefined for create and defined for edit
    const { createStrategy, updateStrategy, getStrategy } = useStrategies();
    const [strategy, setStrategy] = useState({
        name: '',
        entryStrategy: '',
        exitStrategy: ''
    });
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            const fetchStrategy = async () => {
                const data = await getStrategy(id);
                if (data) setStrategy(data);
            };
            fetchStrategy();
        }
    }, [id, getStrategy]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setStrategy(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (id) {
            await updateStrategy(id, strategy);
        } else {
            await createStrategy(strategy);
        }
        navigate('/strategy/list'); // Redirect to strategy list after submit
    };

    return (
        <div className="container mt-3">
            <h2>{id ? 'Edit Strategy' : 'Create Strategy'}</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input
                        type="text"
                        className="form-control"
                        id="name"
                        name="name"
                        value={strategy.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="entryStrategy" className="form-label">Entry Strategy</label>
                    <input
                        type="text"
                        className="form-control"
                        id="entryStrategy"
                        name="entryStrategy"
                        value={strategy.entryStrategy}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="exitStrategy" className="form-label">Exit Strategy</label>
                    <input
                        type="text"
                        className="form-control"
                        id="exitStrategy"
                        name="exitStrategy"
                        value={strategy.exitStrategy}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit" className="btn btn-primary">
                    {id ? 'Update Strategy' : 'Create Strategy'}
                </button>
            </form>
        </div>
    );
};

export default StrategyForm;
