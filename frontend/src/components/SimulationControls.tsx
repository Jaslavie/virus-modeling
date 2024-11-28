// create the simulation controls component for user interaction
import React from "react";
import { Slider, Typography, Paper, Box } from '@mui/material'
import { SimulationParams } from "../types/simulation";

// import the simulation parameters type from the simulation module
interface SimulationControlsProps {
    params: SimulationParams;
    // handle parameter changes by taking in the parameter key and the new value as arguments
    onParamChange: (param: keyof SimulationParams, value: number) => void;
}

export const SimulationControls: React.FC<SimulationControlsProps> = ({
    params,
    onParamChange,
}) => {
    return(
        <Paper sx={{padding: 2}}>
            <Typography variant="h6" gutterBottom>
                Simulation Controls
            </Typography>

            <Box sx={{mb: 2}}>
                <Typography>Population: {params.population}</Typography>
                <Slider
                    value={params.population} // set the value of slider to population params
                    onChange = {(_, value) => onParamChange("population", value as number)} // cast the value to a number
                    min={10}
                    max={1000}
                    step={10}
                />
            </Box>

            <Box sx={{mb: 2}}>
                <Typography>Infection Rate: {params.initial_infected}</Typography>
                <Slider
                    value={params.infection_rate} // set the value of slider to population params
                    onChange = {(_, value) => onParamChange("infection_rate", value as number)}
                    min={0}
                    max={1}
                    step={0.1}
                />
            </Box>

        </Paper>
    )

}