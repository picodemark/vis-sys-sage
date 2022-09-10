import { Graph } from 'react-d3-graph';
import * as React from 'react';
import { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';

import { selectDataPath } from '../../../store/graphDataSlice';

const initialConfig = {
  highlightDegree: 1,
  nodeHighlightBehavior: true,
  staticGraphWithDragAndDrop: true,
  node: {
    color: 'lightgreen',
    size: 200,
    highlightStrokeColor: 'blue'
  },
  link: {
    highlightColor: 'lightblue'
  }
};

export default function DataPathGraph() {
  const selector = useSelector((state) => selectDataPath(state));

  const [config, setConfig] = useState(initialConfig);

  const div = useCallback((node) => {
    if (node !== null) {
      config['width'] = node.getBoundingClientRect().width;
      setConfig(config);
    }
  }, []);

  return (
    <div id="" ref={div}>
      <Graph
        id="data-path-graph" // id is mandatory
        data={Object.assign({}, selector)}
        config={config}
      />
    </div>
  );
}
