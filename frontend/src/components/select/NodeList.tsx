import * as React from 'react';
import { useMemo } from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import { useAppDispatch, useAppSelector } from 'hooks/hooks';
import { selectNodeList, setNodeIDs } from 'store/graphDataSlice';
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material';

const SELECT_WIDTH = 150;

const MenuProps = {
  PaperProps: {
    style: {
      width: SELECT_WIDTH,
      maxHeight: '40vh'
    }
  }
};

export default function NodeList() {
  const nodeListSelector = useAppSelector((state) => selectNodeList(state));

  const dispatch = useAppDispatch();

  const [nodes, setNodes] = React.useState<string[]>([]);

  useMemo(() => setNodes(nodeListSelector.map((node) => node.id)), [nodeListSelector]);

  const theme = useTheme();

  const handleChange = (event: SelectChangeEvent<typeof nodes>) => {
    const {
      target: { value }
    } = event;

    if (nodes.indexOf('all') === -1 && value.indexOf('all') > -1) {
      setNodes(nodeListSelector.map((node) => node.id));
    } else if (nodes.indexOf('all') > -1 && value.indexOf('all') === -1) {
      setNodes([]);
    } else if (value.indexOf('all') > -1) {
      setNodes(
        typeof value === 'string' ? value.split(',') : value.filter((item) => item !== 'all')
      );
    } else {
      setNodes(typeof value === 'string' ? value.split(',') : value);
    }
  };

  const handeFilterNodes = () => {
    dispatch(setNodeIDs(nodes));
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" paddingRight="1rem">
      <FormControl size="small" sx={{ m: 1, width: SELECT_WIDTH }}>
        <InputLabel id="node-multi-select">Nodes</InputLabel>
        <Select
          labelId="node-multi-select"
          multiple
          value={nodes}
          onChange={handleChange}
          input={<OutlinedInput label="Nodes" />}
          renderValue={(selected) =>
            selected.indexOf('all') > -1 ? 'All Nodes' : selected.join(', ')
          }
          MenuProps={MenuProps}>
          {nodeListSelector.map((node) => (
            <MenuItem key={node.id} value={node.id}>
              <Checkbox
                size="small"
                checked={nodes.indexOf(node.id) > -1 || nodes.indexOf('all') > -1}
                sx={{
                  '&.Mui-checked': {
                    color:
                      node.id === 'all' ? theme.palette.secondary.light : theme.palette.primary.main
                  }
                }}
              />
              <ListItemText
                primaryTypographyProps={{ fontSize: '14px' }}
                primary={node.id === 'all' ? 'All Nodes' : 'ID: ' + node.id}
              />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Tooltip title="Filter Nodes">
        <IconButton onClick={handeFilterNodes}>
          <TuneOutlinedIcon color="primary" />
        </IconButton>
      </Tooltip>
    </Box>
  );
}
