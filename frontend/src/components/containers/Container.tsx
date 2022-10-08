import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Box from '@mui/material/Box';

interface Props {
  name: string;
  content: React.ReactNode;
}

export default function Container(props: Props) {
  const { name, content } = props;

  return (
    <Box sx={{ margin: '1rem 3rem' }}>
      <Accordion defaultExpanded={true}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon color="secondary" />}
          sx={{ backgroundColor: 'primary.main' }}>
          <Typography color="secondary" fontWeight="bold">
            {name}
          </Typography>
        </AccordionSummary>
        <AccordionDetails style={{ padding: 0 }}>{content}</AccordionDetails>
      </Accordion>
    </Box>
  );
}
