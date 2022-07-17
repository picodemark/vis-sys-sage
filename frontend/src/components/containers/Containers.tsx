import * as React from 'react';
import TreeGraph from '../graphs/TreeGraph';
import Container from './Container';

export default function Containers() {
  return (
    <React.Fragment>
      <Container name={'Composition Tree'} display={<TreeGraph />} />
    </React.Fragment>
  );
}
