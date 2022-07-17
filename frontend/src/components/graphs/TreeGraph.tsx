import { useEffect, useRef, useState } from 'react';
import Tree from 'react-d3-tree';
import React from 'react';
import { RawNodeDatum } from 'react-d3-tree/lib/types/common';
import { useSelector } from 'react-redux';
import { Toolbar, Typography } from '@mui/material';

const containerStyles = {
  width: '100%',
  height: '50rem'
};

export default function TreeGraph() {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const selector = useSelector((state) => state.treeData);
  console.log(selector);

  const [translate, setTranslate] = useState({
    x: 0,
    y: 0
  });

  const treeGraphRef = useRef();

  return (
    <React.Fragment>
      <Toolbar variant="dense" color="primary">
        <Typography variant="h6" color="inherit" component="div">
          Photos
        </Typography>
      </Toolbar>
      <div style={containerStyles} ref={treeGraphRef}>
        <Tree
          data={selector.value}
          pathFunc={'step'}
          translate={translate}
          orientation={'vertical'}
        />
      </div>
    </React.Fragment>
  );
}
