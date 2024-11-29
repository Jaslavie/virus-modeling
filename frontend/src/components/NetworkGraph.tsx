// store the network graph component
import React, { useEffect, useRef, } from "react";
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
        console.log("NetworkGraph received:", { nodes, edges });
        
        // Guard against undefined/null/empty arrays
        if (!nodes?.length || !edges?.length) {
            console.log("No data to render yet");
            return;
        }

        const canvas = canvasRef.current;
        if (!canvas) {
            console.error("Canvas element not found");
            return;
        }

        // get the 2D version of the canvas
        const ctx = canvas.getContext("2d");
        if (!ctx) {
            console.error("Could not get 2D context");
            return;
        }

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw nodes
    nodes.forEach(node => {
        ctx.beginPath();
        ctx.arc(
            node.x * canvas.width, 
            node.y * canvas.height, 
            5, 
            0, 
            2 * Math.PI
        );
        ctx.fillStyle = node.state === 1 ? 'red' : 'blue';
        ctx.fill();
    });

    // Draw edges
    edges.forEach(edge => {
        const source = nodes.find(n => n.id === edge.source);
        const target = nodes.find(n => n.id === edge.target);
        if (source && target) {
            ctx.beginPath();
            ctx.moveTo(source.x * canvas.width, source.y * canvas.height);
            ctx.lineTo(target.x * canvas.width, target.y * canvas.height);
            ctx.strokeStyle = 'rgba(200, 200, 200, 0.2)';
            ctx.stroke();
        }
    });
    }, [nodes, edges]);
    

    // return the canvas element
    return <canvas 
        ref={canvasRef} 
        width={800} 
        height={600} 
        style={{ 
            background: 'black', 
            border: '1px solid #333',
            maxWidth: '100%'
        }} 
    />;
};