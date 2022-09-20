import { Graph } from 'react-d3-graph';
import React, { useEffect, useMemo, useRef, useState } from 'react';

import Box from '@mui/material/Box';
import { MemoDataGraphComponent } from './DataPathComponent';
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks';
import { selectFilteredDataPath, setClickedComponents } from '../../../store/graphDataSlice';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import NewDataPathTable from '../../tables/NewDataPathTable';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

export default function DataPathGraph() {
  const filteredGraphDataSelector = useAppSelector((state) => selectFilteredDataPath(state));

  const dispatch = useAppDispatch();

  const [extraConfig, setExtraConfig] = useState({});

  const [keyCount, setKeyCount] = useState<number>(0);

  const [open, setOpen] = React.useState<boolean>(false);

  const [link, setLink] = useState<Record<string, string>>({
    source: '',
    target: ''
  });

  const [value, setValue] = React.useState<number>(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const openDialog = () => {
    setOpen(true);
  };

  const closeDialog = () => {
    setOpen(false);
  };

  const box = useRef<HTMLDivElement>();

  const setGraphWidth = () => {
    if (box?.current?.offsetWidth !== undefined) {
      setExtraConfig({ width: box.current.offsetWidth });
    }
  };

  const forceReMount = () => {
    setKeyCount(keyCount + 1);
  };

  useEffect(() => {
    forceReMount();
    setGraphWidth();
    window.addEventListener('resize', setGraphWidth);
  }, []);

  // re-mount graph only when data from store changes
  useMemo(() => forceReMount(), [filteredGraphDataSelector]);

  const onClickLink = (source: string, target: string) => {
    dispatch(setClickedComponents([source, target]));
    setLink({
      source: source,
      target: target
    });
    openDialog();
  };

  const config = {
    height: 1000, // height of rendered SVG
    highlightDegree: 1, // highlight only neighbouring links
    nodeHighlightBehavior: true, // highlight all nodes on mouse-over
    linkHighlightBehavior: true, // highlight all nodes on mouse-over
    d3: {
      gravity: -2300,
      linkLength: 350,
      linkStrength: 1,
      alphaTarget: 0.1,
      disableLinkForce: false
    },
    node: {
      renderLabel: false, // not render label
      size: 1200, // node size
      viewGenerator: (node) => (
        <MemoDataGraphComponent id={node.id} info={node.info}></MemoDataGraphComponent>
      )
    },
    link: {
      highlightColor: '#0065bd', // color when highlighted
      strokeWidth: 10 // link width
    },
    ...extraConfig
  };

  return (
    <React.Fragment>
      <Box sx={{ width: '100%', cursor: 'grab' }} ref={box}>
        <Graph
          key={keyCount} // force data-path graph to re-mount
          id="data-path-graph" // ID of data-path graph wrapper
          data={filteredGraphDataSelector} // data
          config={config} // config
          onClickLink={onClickLink} // call function on link click
        />
      </Box>
      <Dialog open={open} onClose={closeDialog} maxWidth="xl">
        <DialogTitle style={{ cursor: 'move' }}>
          {'Data-Paths between :' + link.source + ' and ' + link.target}{' '}
        </DialogTitle>
        <DialogContent sx={{ padding: 0 }}>
          <Box display={'flex'} flexDirection={'column'} width={'100%'} minHeight={500}>
            <Box sx={{ width: '100%' }}>
              <Tabs value={value} onChange={handleChange} centered>
                <Tab label="From To" />
                <Tab label="From To" />
              </Tabs>
            </Box>
            <Box hidden={value !== 0} width={1000}>
              {value === 0 && <NewDataPathTable source={link.source} target={link.target} />}
            </Box>
            <Box hidden={value !== 1} width={1000}>
              {value === 1 && <NewDataPathTable source={link.target} target={link.source} />}
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}
