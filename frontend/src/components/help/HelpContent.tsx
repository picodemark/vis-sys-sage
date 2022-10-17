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
    <Box width={1200} fontFamily={'Roboto, Helvetica, Arial, sans-serif'} fontSize={14}>
      <p>
        Visit the corresponding <b>GitHub</b> repository for more information on implementation
        details or the setup process.
      </p>
      <SectionHeadline name="General" />
      <p>
        Multiple nodes of the HPC system can be selected in the multi-select drop-down list under
        the navigation bar. Trigger the filtering of both visualizations by clicking the button next
        to the drop-down.
      </p>
      <p>
        The upload of an HPC system state as a <b>XML</b> is possible when clicking on the upload
        button.
      </p>
      <p>
        A table containing all components of the loaded HPC system is shown when clicking on the
        components button. The attributes of a component are displayed in the table when clicking on
        an arrow in a particular row for a component with an existent value in the <b>Info</b>{' '}
        column. The displayed <b>ID</b> is the id of the component.
      </p>
      <p>
        Use the <b>zoom & drag</b> functionalities of your mouse resp. touchpad to interact the two
        visualizations.
      </p>
      <SectionHeadline name="Component Tree" />
      <p>
        The <b>Component Tree</b> can be centered by clicking on the button for centering. All
        components of the <b>Component Tree</b> are shown when clicking on the switch.
      </p>
      <p>
        Each component in the <b>Component Tree</b> has an avatar, which can be clicked to open a
        table with all attributes assigned to the component. The avatar is only clickable when the
        number of assigned attributes is displayed after an <b>INFO</b> keyword. A clickable arrow
        in the bottom right corner of the component is displayed if a component has children
        components.
      </p>
      <p>
        A component is highlighted in the <b>Component Tree</b> and the <b>Data-Path Graph</b> when
        clicking on a component in one of both visualizations.
      </p>
      <SectionHeadline name="Data-Path Graph" />
      <p>
        Links between components in the <b>Data-Path Graph</b> can be clicked to open a table
        showing the <b>Data-Paths</b> between two components.
      </p>
      <p>
        The direction of the <b>Data-Paths</b> is illustrated above the table. Click on the
        illustration to show all <b>Data-Paths</b> for the opposite direction.
      </p>
      <p>
        The keyword <b>SELF</b> is only present when self-referencing <b>Data-Paths</b> exist for a
        component. A table with self-referencing <b>Data-Paths</b> is displayed when clicking on the
        keyword.
      </p>
      <p>
        <b>Ordering of columns</b> can be changed in both tables by dragging the columns with the
        mouse.
      </p>
      <p>
        The number in the top right corner of the component is the id of the parent node in the HPC
        system and the number below is the id of the component.
      </p>
      <p>
        A table with attributes of a component is opened when the avatar of a component is
        clickable.
      </p>
    </Box>
  );
}
