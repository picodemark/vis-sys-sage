import React, { useEffect, useRef, useState } from 'react';
import Tree from 'react-d3-tree';
import { useSelector } from 'react-redux';
import { Toolbar } from '@mui/material';
import TreeComponent from './TreeComponent';
import { selectCurrentTree } from '../../../store/graphDataSlice';
import Box from '@mui/material/Box';
import '../../../style/component-graph.css';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import CenterFocusWeakIcon from '@mui/icons-material/CenterFocusWeak';
import Button from '@mui/material/Button';

const MAX_DEPTH = Number.MAX_SAFE_INTEGER;

export default function TreeGraph() {
  const selector = useSelector((state) => selectCurrentTree(state));

  const [count, setCount] = useState(0);
  const [initialDepth, setInitialDepth] = useState(1);
  const [translate, setTranslate] = useState({
    x: 0,
    y: 0
  });

  const box = useRef(null);

  const centerGraph = () => {
    setCount(count + 1);
  };

  const setPosition = () => {
    setTranslate({ x: box.current.offsetWidth / 2, y: box.current.offsetHeight / 10 });
  };

  const handleInitialDepthSwitch = (event) => {
    event.target.checked ? setInitialDepth(MAX_DEPTH) : setInitialDepth(1);
    setCount(count + 1);
  };

  useEffect(() => {
    setPosition();
  }, []);

  return (
    <React.Fragment>
      <Toolbar variant="dense">
        <FormControlLabel
          value="end"
          control={<Switch color="primary" onChange={handleInitialDepthSwitch} />}
          label="Show All"
          labelPlacement="end"
        />
        <Button
          onClick={centerGraph}
          size="small"
          variant="outlined"
          startIcon={<CenterFocusWeakIcon />}>
          Center
        </Button>
      </Toolbar>
      <Box sx={{ width: '100%', height: '1000px' }} ref={box}>
        {Object.keys(selector).length > 1 && (
          <Tree
            key={count}
            data={selector}
            pathFunc={'step'}
            translate={translate}
            orientation={'vertical'}
            renderCustomNodeElement={TreeComponent}
            depthFactor={270}
            initialDepth={initialDepth}
            separation={{ siblings: 2, nonSiblings: 2 }}
            transitionDuration={0}
          />
        )}
      </Box>
    </React.Fragment>
  );
}
