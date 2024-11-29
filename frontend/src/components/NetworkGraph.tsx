// store the network graph component
import React, { useEffect, useRef, memo } from "react";
import { Network, DataSet } from "vis-network/standalone/esm/vis-network";
import { NetworkNode, NetworkEdge } from "../types/simulation";

interface NetworkGraphProps {
    nodes: NetworkNode[];
    edges: NetworkEdge[];
}

export const NetworkGraph = memo(({ nodes, edges }: NetworkGraphProps) => {
    const networkRef = useRef<HTMLDivElement>(null);
    const networkInstanceRef = useRef<Network | null>(null);

    useEffect(() => {
        if (!networkRef.current) return;

        // Create the network only once
        if (!networkInstanceRef.current) {
            const options = {
                physics: {
                    enabled: true,
                    stabilization: {
                        iterations: 50  // Reduce iterations
                    },
                    barnesHut: {
                        gravitationalConstant: -2000,
                        centralGravity: 0.3,
                        springLength: 95,
                        springConstant: 0.04,
                        damping: 0.09
                    }
                },
                edges: {
                    smooth: false
                },
                nodes: {
                    shape: 'dot',
                    size: 10,
                }
            };

            // Transform nodes to include color based on state
            const coloredNodes = nodes.map(node => ({
                ...node,
                color: {
                    background: node.state === 0 ? '#2B7CE9' : // blue for susceptible
                                node.state === 1 ? '#FF0000' : // red for infected
                                '#808080',                     // gray for recovered
                    border: node.state === 0 ? '#2B7CE9' :    // matching border colors
                           node.state === 1 ? '#FF0000' : 
                           '#808080',
                }
            }));

            const data = {
                nodes: new DataSet(coloredNodes),
                edges: new DataSet(edges)
            };

            networkInstanceRef.current = new Network(networkRef.current, data, options);
        } else {
            // Update existing network with new colored nodes
            const coloredNodes = nodes.map(node => ({
                ...node,
                color: {
                    background: node.state === 0 ? '#2B7CE9' : // blue for susceptible
                                node.state === 1 ? '#FF0000' : // red for infected
                                '#808080',                     // gray for recovered
                    border: node.state === 0 ? '#2B7CE9' :    // matching border colors
                        node.state === 1 ? '#FF0000' : 
                        '#808080',
                }
            }));

            networkInstanceRef.current.setData({
                nodes: new DataSet(coloredNodes),
                edges: new DataSet(edges)
            });
        }
    }, [nodes, edges]);

    return <div ref={networkRef} style={{ height: "500px" }} />;
});