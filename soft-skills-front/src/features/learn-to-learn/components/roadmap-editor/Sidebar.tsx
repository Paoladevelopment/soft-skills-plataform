import { Box, Typography, Paper } from '@mui/material';

const components = [
  { label: 'Title', type: 'title' },
  { label: 'Objective', type: 'objective' },
  { label: 'Task', type: 'task' },
];

const Sidebar = () => {
  const onDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    nodeType: string
  ) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <Box
      sx={{
        width: 220,
        padding: 2,
        borderRight: '1px solid #ddd',
        backgroundColor: '#f8f9fa',
      }}
    >
      <Typography variant="h6" gutterBottom fontWeight="bold">
        Components
      </Typography>

      <Typography variant="caption" color="text.secondary" display="block" mb={2}>
        Drag & drop onto the canvas
      </Typography>

      {components.map((item) => (
        <Paper
          key={item.type}
          variant="outlined"
          draggable
          onDragStart={(e) => onDragStart(e, item.type)}
          sx={{
            padding: 1.5,
            marginBottom: 1,
            textAlign: 'center',
            cursor: 'grab',
            fontWeight: 500,
            '&:hover': {
              backgroundColor: '#eaeaea',
            },
          }}
        >
          {item.label}
        </Paper>
      ))}
    </Box>
  );
};

export default Sidebar