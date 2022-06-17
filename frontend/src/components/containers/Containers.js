import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import OrgChartTree from '../graphs/OrgChartTree';
import TreeGraph from '../graphs/TreeGraph';
import CenteredTree from '../graphs/CenteredTree';

const divStyle = {
  marginTop: '40px'
};

export default function Containers() {
  return (
    <div style={divStyle}>
      <Accordion defaultExpanded={true}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
          className="containerHeader">
          <Typography>Tree Representation of Hardware Topology | Version 1</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <CenteredTree></CenteredTree>
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded={true}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
          className="containerHeader">
          <Typography>Tree Representation of Hardware Topology | Version 2</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <OrgChartTree></OrgChartTree>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
