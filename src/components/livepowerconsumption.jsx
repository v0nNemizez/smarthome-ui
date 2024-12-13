import React from "react";
import { useSubscription } from "@apollo/client";
import { LIVE_MEASUREMENT_SUBSCRIPTION } from "../queries";

const LiveMeasurement = ({ homeId }) => {
    const { data, loading, error } = useSubscription(LIVE_MEASUREMENT_SUBSCRIPTION, {
        variables: { homeId },
    });

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    // Check if data and liveMeasurement are not null
    if (!data || !data.liveMeasurement) {
        return <p>No data available</p>;
    }

    const {power, accumulatedConsumption, accumulatedCost, currency, minPower, averagePower, maxPower } = data.liveMeasurement;

    return (
        <div>
            <p>Power: {power}</p>
            <p>Accumulated Consumption: {accumulatedConsumption}</p>
            <p>Accumulated Cost: {accumulatedCost.toLocaleString('nb-NO', { style: 'currency', currency })}</p>
            <p>Min Power: {minPower}</p>
            <p>Average Power: {averagePower}</p>
            <p>Max Power: {maxPower}</p>
        </div>
    );
};

export default LiveMeasurement;