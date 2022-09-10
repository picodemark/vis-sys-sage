import * as React from 'react';
import TreeGraph from '../graphs/component-tree/TreeGraph';
import Container from './Container';
import DataPathGraph from '../graphs/data-paths/DataPathGraph';

export default function Containers() {
  return (
    <React.Fragment>
      <Container name={'Composition Tree'} display={<TreeGraph />} />
      <Container name={'Data Paths'} display={<DataPathGraph />} />
    </React.Fragment>
  );
}
