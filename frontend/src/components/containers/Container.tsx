import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const divStyle = {
  marginTop: '40px'
};

type ContainerProps = {
  name: string;
  display: any;
};

export default function Container({ name, display }: ContainerProps) {
  return (
    <div style={divStyle}>
      <Accordion defaultExpanded={true}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
          className="containerHeader">
          <Typography>{name}</Typography>
        </AccordionSummary>
        <AccordionDetails>{display}</AccordionDetails>
      </Accordion>
    </div>
  );
}
