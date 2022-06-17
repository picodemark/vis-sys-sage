import { useEffect, useRef, useState } from 'react';
import { collapsibleTree } from '../../utils/tree-graph';

export default function TreeGraph() {
  const svg = useRef(null);

  useEffect(() => {
    fetch('/data')
      .then((results) => results.json())
      .then((response) => {
        collapsibleTree(response).then((loadedGraph) => {
          if (svg.current) {
            svg.current.appendChild(loadedGraph);
          }
        });
      });
  }, []);

  return <div id="treeWrapper" ref={svg}></div>;
}


