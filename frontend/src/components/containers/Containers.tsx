import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TreeGraph from '../graphs/TreeGraph';

const divStyle = {
  marginTop: '40px'
};

export default function Containers() {
  return (
    <div style={divStyle}>
      <Accordion defaultExpanded={true}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
          className="containerHeader">
          <Typography>Composition Tree</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TreeGraph></TreeGraph>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
