import { Graph } from 'react-d3-graph';
import React, { useEffect, useMemo, useRef, useState } from 'react';

import Box from '@mui/material/Box';
import { MemoDataGraphComponent } from './DataPathComponent';
import { useAppDispatch, useAppSelector } from '../../../hooks/hooks';
import {
  selectComponentsInfo,
  selectDataPathLinkAttributes,
  selectFilteredDataPath,
  setHighlightedComponents
} from '../../../store/graphDataSlice';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DataPathTable from '../../tables/DataPathTable';
import DataPathText from './DataPathText';
import DraggablePaperComponent from '../../DraggablePaperComponent';

export default function DataPathGraph() {
  const filteredGraphDataSelector = useAppSelector((state) => selectFilteredDataPath(state));
  const componentsInfoSelector = useAppSelector((state) => selectComponentsInfo(state));
  const allLinkInfo = useAppSelector((state) => selectDataPathLinkAttributes(state));

  const dispatch = useAppDispatch();

  const [extraConfig, setExtraConfig] = useState({});

  const [keyCount, setKeyCount] = useState<number>(0);

  const [open, setOpen] = React.useState<boolean>(false);

  const [clickedLink, setClickedLink] = useState<Record<string, string>>({
    source: '',
    target: ''
  });

  const [orientation, setOrientation] = useState<'left' | 'right'>('right');

  const handleOrientationChange = () => {
    setOrientation(orientation === 'right' ? 'left' : 'right');
  };

  const openDialog = () => {
    setOpen(true);
  };

  const closeDialog = () => {
    setOpen(false);
  };

  const box = useRef<HTMLDivElement>();

  const setGraphWidth = () => {
    if (box?.current?.offsetWidth !== undefined) {
      setExtraConfig({ width: box.current.offsetWidth });
    }
  };

  const forceReMount = () => {
    setKeyCount(keyCount + 1);
  };

  const getLinkInfo = (source: string, target: string) => {
    return source in allLinkInfo && target in allLinkInfo[source]
      ? allLinkInfo[source][target]
      : [];
  };

  useEffect(() => {
    forceReMount();
    setGraphWidth();
    window.addEventListener('resize', setGraphWidth);
  }, []);

  // re-mount graph only when data from store changes
  useMemo(() => forceReMount(), [filteredGraphDataSelector]);

  const onClickLink = (source: string, target: string) => {
    dispatch(setHighlightedComponents([source, target]));

    setClickedLink({
      source: source,
      target: target
    });
    openDialog();
  };

  const config = {
    height: 1000, // height of rendered SVG
    highlightDegree: 1, // highlight only neighbouring links
    nodeHighlightBehavior: true, // highlight all nodes on mouse-over
    linkHighlightBehavior: true, // highlight all nodes on mouse-over
    d3: {
      gravity: -2300,
      linkLength: 350,
      linkStrength: 1,
      alphaTarget: 0.1,
      disableLinkForce: false
    },
    node: {
      renderLabel: false, // not render label
      size: 1200, // node size
      viewGenerator: (node) => (
        <MemoDataGraphComponent
          id={node.id}
          info={componentsInfoSelector[node.id]}
          linkInfo={getLinkInfo(node.id, node.id)}
        />
      )
    },
    link: {
      highlightColor: '#0065bd', // color when highlighted
      strokeWidth: 10 // link width
    },
    ...extraConfig
  };

  return (
    <React.Fragment>
      <Box sx={{ width: '100%', cursor: 'grab' }} ref={box}>
        <Graph
          key={keyCount} // force data-path graph to re-mount
          id="data-path-graph" // ID of data-path graph wrapper
          data={filteredGraphDataSelector} // data
          config={config} // config
          onClickLink={onClickLink} // call function on link click
        />
      </Box>
      <Dialog
        open={open}
        onClose={closeDialog}
        PaperComponent={DraggablePaperComponent}
        hideBackdrop={true}
        maxWidth="xl">
        <DialogTitle style={{ cursor: 'move' }}>Data-Paths of Two Components</DialogTitle>
        <DialogContent sx={{ padding: 0 }}>
          <Box display="flex" flexDirection="column" width="100%" minHeight="500">
            <Box onClick={handleOrientationChange}>
              <DataPathText
                sourceInfo={componentsInfoSelector[clickedLink.source]}
                targetInfo={componentsInfoSelector[clickedLink.target]}
                orientation={orientation}
              />
            </Box>
            <Box hidden={orientation !== 'right'} width={1000}>
              <DataPathTable linkInfo={getLinkInfo(clickedLink.source, clickedLink.target)} />
            </Box>
            <Box hidden={orientation !== 'left'} width={1000}>
              <DataPathTable linkInfo={getLinkInfo(clickedLink.target, clickedLink.source)} />
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
}
