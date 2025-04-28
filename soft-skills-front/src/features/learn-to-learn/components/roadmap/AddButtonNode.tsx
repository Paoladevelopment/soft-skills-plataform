import { Box, IconButton } from '@mui/material';
import { Handle, NodeProps, Position } from 'reactflow';
import AddIcon from '@mui/icons-material/Add';

const AddButtonNode = ({ data }: NodeProps<{ onClick: () => void }>) => {
  return (
    <Box
      sx={{
        border: '1px dashed #aaa',
        backgroundColor: '#f9f9f9',
        width: 50,
        height: 50,
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Handle type="target" position={Position.Top} id="top" />
      <Handle type="source" position={Position.Bottom} id="bottom" />
      <IconButton onClick={data.onClick} color="primary" size="small">
        <AddIcon />
      </IconButton>
    </Box>
  );
};

export default AddButtonNode
