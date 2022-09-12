import React, { useEffect, useRef, useState } from 'react';
import Tree from 'react-d3-tree';
import { useSelector } from 'react-redux';
import { Toolbar, Typography } from '@mui/material';
import TreeComponent from './TreeComponent';
import { selectCurrentTree } from '../../../store/graphDataSlice';
import Box from '@mui/material/Box';

export default function TreeGraph() {
  const selector = useSelector((state) => selectCurrentTree(state));

  const box = useRef(null);

  const [translate, setTranslate] = useState({
    x: 0,
    y: 0
  });

  const setPosition = () => {
    setTranslate({ x: box.current.offsetWidth / 2, y: box.current.offsetHeight / 10 });
  };

  useEffect(() => {
    setPosition();
    window.addEventListener('resize', setPosition);
  }, []);

  return (
    <React.Fragment>
      <Toolbar variant="dense">
        <Typography variant="h6" color="primary" component="div">
          Tree Config
        </Typography>
      </Toolbar>
      <Box sx={{ width: '100%', height: '600px' }} ref={box}>
        <Tree
          data={selector}
          pathFunc={'step'}
          translate={translate}
          orientation={'vertical'}
          renderCustomNodeElement={TreeComponent}
          depthFactor={450}
          initialDepth={1}
          separation={{ siblings: 3, nonSiblings: 3 }}
        />
      </Box>
    </React.Fragment>
  );
}
