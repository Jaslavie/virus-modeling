// store the network graph component
import React, { useEffect, useRef } from "react";
import { Network, DataSet } from "vis-network/standalone/esm/vis-network";
import { NetworkNode, NetworkEdge } from "../types/simulation";

interface NetworkGraphProps {
    nodes: NetworkNode[];
    edges: NetworkEdge[];
}

export const NetworkGraph: React.FC<NetworkGraphProps> = ({nodes, edges}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const networkRef = useRef<Network | null>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // Convert to vis-network format
        const visNodes = new DataSet(nodes.map(node => ({
            id: node.id,
            color: node.state === 1 ? 'red' : 
                node.state === 2 ? 'green' : 'blue',
            x: node.x * 1000,
            y: node.y * 1000
        })));

        const visEdges = new DataSet(edges.map(edge => ({
            from: edge.source,
            to: edge.target
        })));

        const options = {
            physics: {
                enabled: true,
                stabilization: false
            },
            nodes: {
                size: 10,
                borderWidth: 2
            },
            edges: {
                width: 1,
                color: { opacity: 0.2 }
            }
        };

        // Create network
        networkRef.current = new Network(
            containerRef.current,
            { 
                nodes: visNodes, 
                edges: visEdges 
            },
            options
        );

        return () => {
            if (networkRef.current) {
                networkRef.current.destroy();
                networkRef.current = null;
            }
        };
    }, [nodes, edges]);

    return (
        <div 
            ref={containerRef} 
            style={{ 
                height: '600px', 
                width: '100%',
                background: 'black',
                border: '1px solid #333'
            }} 
        />
    );
};