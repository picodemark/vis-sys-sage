import React from 'react';

interface Props {
  direction: 'up' | 'down';
}

export default function TreeComponentArrow(props: Props) {
  const { direction } = props;

  return (
    <span
      style={{
        display: 'inline-block',
        width: '12px',
        height: '12px',
        borderTop: '2px solid #000',
        borderRight: '2px solid #000',
        transform: direction === 'up' ? 'rotate(-45deg)' : 'rotate(135deg)'
      }}></span>
  );
}
