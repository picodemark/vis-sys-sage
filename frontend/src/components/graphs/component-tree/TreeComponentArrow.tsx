import React from 'react';

interface Props {
  direction: 'up' | 'down';
}

export default function TreeComponentArrow(props: Props) {
  const { direction } = props;

  const solidTransparentBorder = '10px solid transparent';
  const solidBlackBorder = '10px solid black';

  return (
    <div
      style={{
        width: '0px',
        height: '0px',
        margin: 'auto',
        borderLeft: solidTransparentBorder,
        borderTop: direction === 'down' ? solidBlackBorder : 'unset',
        borderRight: solidTransparentBorder,
        borderBottom: direction === 'up' ? solidBlackBorder : 'unset'
      }}
    />
  );
}
