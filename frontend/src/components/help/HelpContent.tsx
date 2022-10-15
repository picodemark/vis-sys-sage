import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

interface SectionHeadlineProps {
  name: string;
}

function SectionHeadline(props: SectionHeadlineProps) {
  const { name } = props;

  return (
    <Typography color="primary" fontSize={18} fontWeight={500}>
      {name}
    </Typography>
  );
}

export default function HelpContent() {
  return (
    <Box width={1200} fontFamily={'Roboto, Helvetica, Arial, sans-serif'}>
      <SectionHeadline name="General" />
      <p>Help text coming soon...</p>
      <SectionHeadline name="Component Tree" />
      <p>Help text coming soon...</p>
      <SectionHeadline name="Data-Path Graph" />
      <p>Help text coming soon...</p>
      <SectionHeadline name="Tables" />
      <p>Help text coming soon...</p>
    </Box>
  );
}
