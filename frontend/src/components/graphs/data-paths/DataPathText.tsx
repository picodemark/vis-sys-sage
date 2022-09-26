import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import EastIcon from '@mui/icons-material/East';
import WestIcon from '@mui/icons-material/West';
import Rotate90DegreesCcwIcon from '@mui/icons-material/Rotate90DegreesCcw';
import React from 'react';

interface Props {
  sourceInfo: Record<string, string>;
  targetInfo?: Record<string, string>;
  orientation: 'left' | 'right' | 'self';
}

export default function DataPathText(props: Props) {
  const { sourceInfo, targetInfo, orientation } = props;

  return (
    <Box
      display="flex"
      sx={{ cursor: orientation === 'self' ? 'default' : 'pointer' }}
      justifyContent="center"
      alignItems="center">
      <Box display="flex" flexDirection="column">
        <Typography variant="h5" sx={{ display: 'inline-block' }}>
          {sourceInfo.name}
        </Typography>
        <Typography variant="caption" sx={{ display: 'inline-block' }}>
          {'Node ID: ' + sourceInfo.nodeID + ', ' + 'Component ID: ' + sourceInfo.componentID}
        </Typography>
      </Box>
      {orientation === 'self' ? (
        <Box padding="0 1rem">
          <Rotate90DegreesCcwIcon color="primary" transform="rotate(-90deg)" />
        </Box>
      ) : (
        <React.Fragment>
          <Box padding="0 1rem">
            {orientation === 'right' ? <EastIcon color="primary" /> : <WestIcon color="primary" />}
          </Box>
          <Box display="flex" flexDirection="column">
            <Typography variant="h5" sx={{ display: 'inline-block' }}>
              {targetInfo.name}
            </Typography>
            <Typography variant="caption" sx={{ display: 'inline-block' }}>
              {'Node ID: ' + targetInfo.nodeID + ', ' + 'Component ID: ' + targetInfo.componentID}
            </Typography>
          </Box>
        </React.Fragment>
      )}
    </Box>
  );
}
