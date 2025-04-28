import { useCallback } from "react";
import ReactFlow, { addEdge, Background, Connection, Controls, useEdgesState, useNodesState } from "reactflow"
import "reactflow/dist/style.css"
import { buildRoadmapLayout } from "../utils/roadmap_layout_generator";
import { literatureRoadmap } from "../data/literatureRoadmap";
import { LayoutNodeType } from "../types/roadmap/roadmap.enums";
import { nodeTypes } from "../types/roadmap/roadmap.nodetypes";


const Roadmap = () => {
  const { nodes: initialNodes, edges: initialEdges } = buildRoadmapLayout(literatureRoadmap)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  const onConnect = useCallback(
    (connection: Connection) => {
      const sourceNode = nodes.find((n) => n.id === connection.source);
      const targetNode = nodes.find((n) => n.id === connection.target);
  
      if (!sourceNode || !targetNode) return
  
      if (sourceNode.type === LayoutNodeType.Objective && targetNode.type === LayoutNodeType.Objective) {
        const isAlreadyConnected = edges.some(
          (e) => e.source === connection.source && e.sourceHandle === 'bottom'
        );
  
        if (isAlreadyConnected) {
          console.warn('Already connected to another objective node.');
          return;
        }
      }
  
      setEdges((eds) => addEdge(connection, eds));
    },
    [edges, nodes, setEdges]
  )

  const isValidConnection = (connection: Connection) => {
    const sourceNode = nodes.find((n) => n.id === connection.source)
    const targetNode = nodes.find((n) => n.id === connection.target)
  
    if (!sourceNode || !targetNode) return false;
  
    if (sourceNode.type === LayoutNodeType.Objective && targetNode.type === LayoutNodeType.Objective) {
      return connection.sourceHandle === 'bottom' && connection.targetHandle === 'top'
    }
  
    if (sourceNode.type === LayoutNodeType.Objective && targetNode.type === LayoutNodeType.Task) {
      return (connection.sourceHandle === 'right' && connection.targetHandle === 'left') || (connection.sourceHandle === 'left' && connection.targetHandle === 'right')
    }
  
    return false
  }  

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <ReactFlow 
        nodes={nodes} 
        edges={edges} 
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        isValidConnection={isValidConnection}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  )
}

export default Roadmap
