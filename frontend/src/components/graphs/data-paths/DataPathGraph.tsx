import { Graph } from 'react-d3-graph';
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import Box from '@mui/material/Box';

import { selectDataPath } from '../../../store/graphDataSlice';
import DataGraphComponent from './DataGraphComponent';

export default function DataPathGraph() {
  const selector = useSelector((state) => selectDataPath(state));

  const [extraConfig, setExtraConfig] = useState({});

  const box = useRef(null);

  const setGraphWidth = () => {
    if (box?.current?.offsetWidth !== undefined) {
      setExtraConfig({ width: box.current.offsetWidth });
    }
  };

  useEffect(() => {
    setGraphWidth();
    window.addEventListener('resize', setGraphWidth);
  }, []);

  const config = {
    height: 500,
    highlightDegree: 1,
    nodeHighlightBehavior: true,
    d3: {
      gravity: -1000,
      linkLength: 150,
      linkStrength: 1,
      alphaTarget: 0.05
    },
    node: {
      renderLabel: false,
      color: 'lightgreen',
      size: 400,
      highlightStrokeColor: 'blue',
      viewGenerator: (node) => <DataGraphComponent {...node}></DataGraphComponent>
    },
    link: {
      highlightColor: 'red'
    },
    ...extraConfig
  };

  return (
    <Box sx={{ width: '100%' }} ref={box}>
      <Graph id="data-path-graph" data={Object.assign({}, selector)} config={config} />
    </Box>
  );
}
