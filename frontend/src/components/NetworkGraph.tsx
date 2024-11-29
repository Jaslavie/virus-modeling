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
                    smooth: false  // Disable edge smoothing for better performance
                }
            };

            const data = {
                nodes: new DataSet(nodes),
                edges: new DataSet(edges)
            };

            networkInstanceRef.current = new Network(networkRef.current, data, options);
        } else {
            // Just update the data
            networkInstanceRef.current.setData({
                nodes: new DataSet(nodes),
                edges: new DataSet(edges)
            });
        }
    }, [nodes, edges]);

    return <div ref={networkRef} style={{ height: "500px" }} />;
});