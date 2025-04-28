import { CSSProperties } from "react"
import { Handle, HandleProps } from "reactflow"

interface CustomHandleProps extends HandleProps {
  style?: CSSProperties;
}

export default function CustomHandle(props: CustomHandleProps) {
  return (
    <Handle
      style={{
        width: 8,
        height: 8,
        background: "#ccc",
        ...(props.style || {}) 
      }}
      {...props}
    />
  )
}