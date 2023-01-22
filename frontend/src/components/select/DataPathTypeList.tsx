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
import { selectDataPathTypes, setFilteredTypes } from 'store/graphDataSlice';
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
      maxHeight: '30vh'
    }
  }
};

export default function DataPathTypeList() {
  const dataPathTypeSelector = useAppSelector((state) => selectDataPathTypes(state));

  const dispatch = useAppDispatch();

  const [dataPathTypes, setDataPathTypes] = React.useState<string[]>([]);

  useMemo(
    () => setDataPathTypes(dataPathTypeSelector.map((type) => type.name)),
    [dataPathTypeSelector]
  );

  const theme = useTheme();

  const handleChange = (event: SelectChangeEvent<typeof dataPathTypes>) => {
    const {
      target: { value }
    } = event;

    if (dataPathTypes.indexOf('all') === -1 && value.indexOf('all') > -1) {
      setDataPathTypes(dataPathTypeSelector.map((path) => path.name));
    } else if (dataPathTypes.indexOf('all') > -1 && value.indexOf('all') === -1) {
      setDataPathTypes([]);
    } else if (value.indexOf('all') > -1) {
      setDataPathTypes(
        typeof value === 'string' ? value.split(',') : value.filter((item) => item !== 'all')
      );
    } else {
      setDataPathTypes(typeof value === 'string' ? value.split(',') : value);
    }
  };

  const handleFilterDataPathTypes = () => {
    dispatch(setFilteredTypes(dataPathTypes));
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" paddingRight="1rem">
      <FormControl size="small" sx={{ m: 1, width: SELECT_WIDTH }}>
        <InputLabel id="node-select">Types</InputLabel>
        <Select
          labelId="node-select"
          multiple
          value={dataPathTypes}
          onChange={handleChange}
          input={<OutlinedInput label="Types" />}
          renderValue={(selected) =>
            selected.indexOf('all') > -1 ? 'All Types' : selected.join(', ')
          }
          MenuProps={MenuProps}>
          {dataPathTypeSelector.map((type) => (
            <MenuItem key={type.name} value={type.name}>
              <Checkbox
                size="small"
                checked={dataPathTypes.indexOf(type.name) > -1 || dataPathTypes.indexOf('all') > -1}
                sx={{
                  '&.Mui-checked': {
                    color:
                      type.name === 'all'
                        ? theme.palette.secondary.light
                        : theme.palette.primary.main
                  }
                }}
              />
              <ListItemText
                primaryTypographyProps={{ fontSize: '14px' }}
                primary={type.name === 'all' ? 'All Types' : type.name}
              />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Tooltip title="Filter Types">
        <IconButton onClick={handleFilterDataPathTypes}>
          <TuneOutlinedIcon color="primary" />
        </IconButton>
      </Tooltip>
    </Box>
  );
}
