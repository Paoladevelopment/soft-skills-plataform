import RoadmapEditor from "../components/roadmap-editor/RoadmapEditor";


const NewRoadmap = () => {
  return (
    <RoadmapEditor
      nodes={[]}
      edges={[]}
      title="Untitled Roadmap"
      mode="new"
    />
  )
}

export default NewRoadmap
