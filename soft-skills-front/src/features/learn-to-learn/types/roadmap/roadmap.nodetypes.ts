import ObjectiveNode from "../../components/roadmap-editor/ObjectiveNode";
import TaskNode from "../../components/roadmap-editor/TaskNode";
import { LayoutNodeType } from "./roadmap.enums";

export const nodeTypes = {
  [LayoutNodeType.Objective]: ObjectiveNode,
  [LayoutNodeType.Task]: TaskNode,
}
