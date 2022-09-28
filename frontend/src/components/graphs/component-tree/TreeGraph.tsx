import React, { useEffect, useRef, useState } from 'react';
import Tree from 'react-d3-tree';
import { Toolbar } from '@mui/material';
import TreeComponent from './TreeComponent';
import { selectFilteredTree } from '../../../store/graphDataSlice';
import Box from '@mui/material/Box';
import '../../../style/component-graph.css';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import CenterFocusWeakIcon from '@mui/icons-material/CenterFocusWeak';
import Button from '@mui/material/Button';
import { useAppSelector } from '../../../hooks/hooks';
import { Point } from 'react-d3-tree/lib/types/common';

// maximum depth is set to be unrealistically high to show all components
const MAX_DEPTH = Number.MAX_SAFE_INTEGER as number;

export default function TreeGraph() {
  const treeSelector = useAppSelector((state) => selectFilteredTree(state));

  const [keyCount, setKeyCount] = useState<number>(0);

  const [initialDepth, setInitialDepth] = useState<number>(1);

  const [translate, setTranslate] = useState<Point>({
    x: 0,
    y: 0
  });

  const box = useRef<HTMLDivElement>();

  const forceReMount = () => {
    setKeyCount(keyCount + 1);
  };

  const centerGraph = () => {
    setTranslate({ x: box.current.offsetWidth / 2, y: box.current.offsetHeight / 10 });
  };

  const handleInitialDepthSwitch = (event) => {
    event.target.checked ? setInitialDepth(MAX_DEPTH) : setInitialDepth(1);
    forceReMount();
  };

  useEffect(() => {
    // center graph on re-render
    centerGraph();
  }, []);

  return (
    <React.Fragment>
      <Toolbar>
        <FormControlLabel
          control={<Switch color="primary" onChange={handleInitialDepthSwitch} />}
          label="Show All"
          labelPlacement="end"
        />
        <Button
          size="small"
          variant="outlined"
          onClick={forceReMount}
          startIcon={<CenterFocusWeakIcon />}>
          Center
        </Button>
      </Toolbar>
      <Box sx={{ width: '100%', height: '1000px' }} ref={box}>
        {Object.keys(treeSelector).length > 1 && (
          <Tree
            key={keyCount} // force tree graph to re-mount
            data={treeSelector} // tree graph data from global store
            pathFunc={'step'} // paths styled as steps
            translate={translate} // translate tree graph to given position
            orientation={'vertical'} // vertical graph
            renderCustomNodeElement={TreeComponent} // custom tree component element
            depthFactor={270} // minimum distance between parent and children components
            initialDepth={initialDepth} // control initial depth
            separation={{ siblings: 2, nonSiblings: 2 }} // minimum distance between components
            transitionDuration={0} // maximum performance
          />
        )}
      </Box>
    </React.Fragment>
  );
}
