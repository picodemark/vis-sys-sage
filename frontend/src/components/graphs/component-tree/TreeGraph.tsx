import { useRef, useState } from 'react';
import Tree from 'react-d3-tree';
import React from 'react';
import { useSelector } from 'react-redux';
import { Toolbar, Typography } from '@mui/material';
import TreeNode from './TreeNode';
import { selectCurrentTree } from '../../../store/graphDataSlice';

const containerStyles = {
  width: '100%',
  height: '50rem'
};

export default function TreeGraph() {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const selector = useSelector((state) => selectCurrentTree(state));

  const [translate, setTranslate] = useState({
    x: 0,
    y: 0
  });

  const treeGraphRef = useRef();

  return (
    <React.Fragment>
      <Toolbar variant="dense" color="primary">
        <Typography variant="h6" color="inherit" component="div">
          Tree Config
        </Typography>
      </Toolbar>
      <div style={containerStyles} ref={treeGraphRef}>
        <Tree
          data={selector}
          pathFunc={'step'}
          translate={translate}
          orientation={'vertical'}
          renderCustomNodeElement={TreeNode}
          depthFactor={500}
          initialDepth={1}
          separation={{ siblings: 5, nonSiblings: 5 }}
        />
      </div>
    </React.Fragment>
  );
}
