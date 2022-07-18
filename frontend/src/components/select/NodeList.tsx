import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

export default function NodeList() {
  const [age, setAge] = React.useState('');

  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value);
  };

  return (
    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
      <InputLabel id="node-select">Nodes</InputLabel>
      <Select
        labelId="node-select"
        id="node-select"
        value={age}
        label="Nodes"
        onChange={handleChange}>
        <MenuItem value={'test_id_1'}>Node (1)</MenuItem>
        <MenuItem value={'test_id_2'}>Node (2)</MenuItem>
        <MenuItem value={'test_id_3'}>Node (3)</MenuItem>
      </Select>
    </FormControl>
  );
}
