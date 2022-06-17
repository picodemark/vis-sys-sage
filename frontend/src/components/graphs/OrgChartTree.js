import { useEffect, useState } from 'react';
import Tree from 'react-d3-tree';

export default function OrgChartTree() {
  const [data, setData] = useState({});

  useEffect(() => {
    fetch('/data')
      .then((results) => results.json())
      .then((response) => {
        setData(response);
      });
  }, []);

  function test(data) {
    console.log(data);
  }

  return (
    <div id="treeWrapper" style={{ height: '50em' }}>
      <Tree onNodeClick={test} orientation={'vertical'} data={data} />
    </div>
  );
}
