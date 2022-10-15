import * as React from 'react';
import TreeGraph from '../graphs/component-tree/TreeGraph';
import Container from './Container';
import DataPathGraph from '../graphs/data-paths/DataPathGraph';

export default function Containers() {
  return (
    <React.Fragment>
      <Container name={'Component Tree'} content={<TreeGraph />} />
      <Container name={'Data-Path Graph'} content={<DataPathGraph />} />
    </React.Fragment>
  );
}
