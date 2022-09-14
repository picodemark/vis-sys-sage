import React from 'react';
import ComponentAvatar from '../ComponentAvatar';

export default function DataGraphComponent(props: any) {
  const { id } = props;

  return <ComponentAvatar id={id} clickable={true} />;
}
