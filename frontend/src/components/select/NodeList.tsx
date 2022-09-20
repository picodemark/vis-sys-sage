import * as React from 'react';
import { useState } from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { selectNodeList, setNodeID } from '../../store/graphDataSlice';
import { useAppDispatch, useAppSelector } from '../../hooks/hooks';

export default function NodeList() {
  const selector = useAppSelector((state) => selectNodeList(state));

  const [selectedNode, setSelectedNode] = useState<string>('all');

  const dispatch = useAppDispatch();

  const handleChange = (event: SelectChangeEvent) => {
    setSelectedNode(event.target.value);
    dispatch(setNodeID(event.target.value));
  };

  return (
    <FormControl size="small" sx={{ m: 1, minWidth: 120 }}>
      <InputLabel id="node-select">Nodes</InputLabel>
      <Select labelId="node-select" value={selectedNode} label="Nodes" onChange={handleChange}>
        <MenuItem value={'all'}>All Nodes</MenuItem>
        {selector.map((node, index) => (
          <MenuItem key={index} value={node.id}>
            ID: {node.id}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
