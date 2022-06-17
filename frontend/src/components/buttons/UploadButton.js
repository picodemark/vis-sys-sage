import * as React from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';

const Input = styled('input')({
  display: 'none'
});

export default function UploadButton(props) {
  // eslint-disable-next-line react/prop-types
  const { color = 'inherit' } = props;

  return (
    <label htmlFor="contained-button-file">
      <Input accept="image/*" id="contained-button-file" multiple type="file" />
      <Button color={color}>Upload</Button>
    </label>
  );
}
