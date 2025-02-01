import { Box, Typography } from '@mui/material';

export default function NoDataMessage() {
  return (
    <Box sx={{ 
      height: 400, 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: 'background.paper',
      borderRadius: 2
    }}>
      <Typography variant="h6" color="text.secondary">
        No data to display
      </Typography>
    </Box>
  );
}