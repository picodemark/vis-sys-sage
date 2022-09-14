import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useSelector } from 'react-redux';
import { selectNodeList } from '../../store/graphDataSlice';
import { useState } from 'react';
import { setNodeID } from '../../store/graphDataSlice';
import { useAppDispatch } from '../../app/hooks';

export default function NodeList() {
  const selector = useSelector((state) => selectNodeList(state));

  const [selectedNode, setSelectedNode] = useState('all');

  const dispatch = useAppDispatch();

  const handleChange = (event: SelectChangeEvent) => {
    setSelectedNode(event.target.value);
    dispatch(setNodeID(event.target.value));
  };

  return (
    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
      <InputLabel id="node-select">Nodes</InputLabel>
      <Select
        labelId="node-select"
        id="node-select"
        value={selectedNode}
        label="Nodes"
        onChange={handleChange}>
        <MenuItem value={'all'}>All Nodes</MenuItem>
        {selector.map((node, i) => (
          <MenuItem key={i} value={node.id}>
            ID: {node.id}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
