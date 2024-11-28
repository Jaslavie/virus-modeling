// store the network graph component
import React, { useEffect, useRef } from "react";
import { NetworkNode, NetworkEdge } from "../types/simulation";

interface NetworkGraphProps {
    nodes: NetworkNode[];
    edges: NetworkEdge[];
}

export const NetworkGraph: React.FC<NetworkGraphProps> = ({nodes, edges}) => {
    // create a reference to the canvas element 
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        // create a canvas element
        const canvas = canvasRef.current;
        if (!canvas) return;

        // get the 2D version of the canvas
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
    }, [nodes, edges]);

    // return the canvas element
    return <canvas ref={canvasRef} width={800} height={600} />;
};