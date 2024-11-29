// count the number of infected and recovered nodes
import React, { memo } from "react";
import { Box, Paper, Typography } from "@mui/material";

interface SimulationCounterProps {
    susceptible: number;
    infected: number;
    recovered: number;
}

export const Counter: React.FC<SimulationCounterProps> = memo(({
    susceptible,
    infected,
    recovered
}) => {
    console.log("Counter rendering with:", { susceptible, infected, recovered });
    
    return(
        <Paper sx={{ padding: 2, margin: 2 }}>
            <Typography variant="h6" gutterBottom>
                Population Status
            </Typography>
            <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
                <Box>
                    <Typography color="primary">
                        Susceptible: {susceptible}
                    </Typography>
                </Box>
                <Box>
                    <Typography color="error">
                        Infected: {infected}
                    </Typography>
                </Box>
                <Box>
                    <Typography color="success.main">
                        Recovered: {recovered}
                    </Typography>
                </Box>
            </Box>
        </Paper>
    );
});