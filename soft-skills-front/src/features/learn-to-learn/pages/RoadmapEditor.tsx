import { Box } from '@mui/material'
import { useEffect, useRef, useCallback, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import ReactFlow, {
  Background,
  Controls,
  Connection,
  Edge,
  EdgeChange,
  NodeChange,
  useReactFlow,
  ReactFlowProvider,
  applyNodeChanges,
  applyEdgeChanges,
  Node,
} from 'reactflow'

import 'reactflow/dist/style.css'

import Sidebar from '../components/roadmap-editor/Sidebar'
import Topbar from '../components/roadmap-editor/Topbar'
import { nodeTypes } from '../types/roadmap/roadmap.nodetypes'
import { LayoutNodeType, RoadmapVisibility } from '../types/roadmap/roadmap.enums'
import { useRoadmapStore } from '../store/useRoadmapStore'
import { createNode } from '../utils/roadmap/node-utils'
import { LayoutEdge, LayoutNode } from '../types/roadmap/roadmap.models'
import { hasIncomingConnectionFromObjective, hasOutgoingConnectionToObjective } from '../utils/roadmap/roadmap_graph_helpers'
import SidebarEditor from '../components/roadmap-editor/SidebarEditor'
import RoadmapForm from '../components/roadmap/RoadmapForm'
import UpdateSharingSettingsModal from '../components/roadmap/UpdateSharingSettingsModal'

const RoadmapEditorContent = () => {
  const {
    editorNodes,
    editorEdges,
    selectedRoadmap,
    setSelectedNodeId,
    getRoadmapById,
    addEditorNode,
    addEditorEdge,
    updateRoadmapAfterConnection,
    updateRoadmapMetadata
  } = useRoadmapStore()

  const navigate = useNavigate()
  const { roadmapId } = useParams()
  const { screenToFlowPosition } = useReactFlow()
  const reactFlowWrapper = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (roadmapId) getRoadmapById(roadmapId, true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roadmapId])

  const [isEditMetaOpen, setEditMetaOpen] = useState(false)
  const [isSharingSettingsOpen, setSharingSettingsOpen] = useState(false)

  const handleOpenEditMeta = () => setEditMetaOpen(true)
  const handleCloseEditMeta = () => setEditMetaOpen(false)
  
  const handleOpenSharingSettings = () => setSharingSettingsOpen(true)
  const handleCloseSharingSettings = () => setSharingSettingsOpen(false)

  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    setSelectedNodeId(node.id)
  }, [setSelectedNodeId])  

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null)
  }, [setSelectedNodeId])  

  const onDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    const type = event.dataTransfer.getData('application/reactflow') as LayoutNodeType
    if (!type) return
  
    const position = screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    })
  
    const newNode = createNode(type, position)
    addEditorNode(newNode)
  }, [screenToFlowPosition, addEditorNode])

  const isValidConnection = useCallback((connection: Connection) => {
    const source = editorNodes.find(n => n.id === connection.source)
    const target = editorNodes.find(n => n.id === connection.target)
    if (!source || !target) return false
  
    const isObjectiveToObjective =
      source.type === LayoutNodeType.Objective && target.type === LayoutNodeType.Objective
  
    if (isObjectiveToObjective) {
      if (
        hasOutgoingConnectionToObjective(source.id, editorEdges, editorNodes) ||
        hasIncomingConnectionFromObjective(target.id, editorEdges, editorNodes)
      ) {
        return false
      }
  
      return connection.sourceHandle === 'bottom' && connection.targetHandle === 'top'
    }
  
    if (source.type === LayoutNodeType.Objective && target.type === LayoutNodeType.Task) {
      return (
        ['left', 'right'].includes(connection.sourceHandle || '') &&
        ['left', 'right'].includes(connection.targetHandle || '')
      )
    }
  
    return false
  }, [editorNodes, editorEdges])  

  const onConnect = useCallback((connection: Connection) => {
    if (connection.source && connection.target && isValidConnection(connection)) {
      const id = `${connection.source}-${connection.target}`
      const edge: Edge = {
        id,
        source: connection.source,
        target: connection.target,
        sourceHandle: connection.sourceHandle ?? undefined,
        targetHandle: connection.targetHandle ?? undefined,
      }

      addEditorEdge(edge as LayoutEdge)
      updateRoadmapAfterConnection(connection)
    }
  }, [addEditorEdge, isValidConnection, updateRoadmapAfterConnection])

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      const { editorNodes, setEditorNodes } = useRoadmapStore.getState()
      const updatedNodes = applyNodeChanges(changes, editorNodes) as LayoutNode[]
      setEditorNodes(updatedNodes)
    },
    []
  )

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      const { editorEdges, setEditorEdges } = useRoadmapStore.getState()
      const updatedEdges = applyEdgeChanges(changes, editorEdges) as LayoutEdge[]
      setEditorEdges(updatedEdges)
    },
    []
  )

  const handleUpdateRoadmapMetadata = (title: string, description: string) => {
    if (!selectedRoadmap) return

    updateRoadmapMetadata(selectedRoadmap.roadmapId, {
      title,
      description,
      visibility: selectedRoadmap.visibility,
    })

    handleCloseEditMeta()
  }

  const handleUpdateVisibility = async (newVisibility: RoadmapVisibility) => {
    if (!selectedRoadmap) return

    console.log(newVisibility)
    await updateRoadmapMetadata(selectedRoadmap.roadmapId, {
      title: selectedRoadmap.title,
      description: selectedRoadmap.description || '',
      visibility: newVisibility,
    })

    handleCloseSharingSettings()
  }

  const handleBackToRoadmapDetail = async () => {
    if (!selectedRoadmap) return

    navigate(`/learn/roadmaps/${selectedRoadmap.roadmapId}`)
  }

  return (
    <Box display="flex" flexDirection="column" height="100vh">
      <Topbar
        title={selectedRoadmap?.title || 'Untitled Roadmap'}
        description={selectedRoadmap?.description}
        visibility={selectedRoadmap?.visibility ?? RoadmapVisibility.Private}
        onEditMetaClick={handleOpenEditMeta}
        onClickSharing={handleOpenSharingSettings}
        onBackClick={handleBackToRoadmapDetail}
      />

      <Box display="flex" flexGrow={1} overflow="hidden">
        <Sidebar />

        <Box
          flexGrow={1}
          position="relative"
          ref={reactFlowWrapper}
          onDrop={onDrop}
          onDragOver={e => e.preventDefault()}
        >
          <ReactFlow
            fitView
            nodeTypes={nodeTypes}
            nodes={editorNodes}
            edges={editorEdges}
            onConnect={onConnect}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            isValidConnection={isValidConnection}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
          >
            <Background />
            <Controls />
          </ReactFlow>
        </Box>

        <SidebarEditor />

        {selectedRoadmap && (
          <RoadmapForm
            open={isEditMetaOpen}
            onClose={handleCloseEditMeta}
            mode="edit"
            initialValues={{
              title: selectedRoadmap.title,
              description: selectedRoadmap.description || '',
            }}
            onSubmit={handleUpdateRoadmapMetadata}
          />
        )}

        {selectedRoadmap && (
          <UpdateSharingSettingsModal
            open={isSharingSettingsOpen}
            visibility={selectedRoadmap.visibility}
            onClose={handleCloseSharingSettings}
            onSubmit={handleUpdateVisibility}
          />
        )}
      </Box>
    </Box>
  )
}

const RoadmapEditor = () => (
  <ReactFlowProvider>
    <RoadmapEditorContent />
  </ReactFlowProvider>
)

export default RoadmapEditor