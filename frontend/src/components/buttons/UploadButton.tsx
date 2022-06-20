import * as React from 'react';
import Button from '@mui/material/Button';
import axios from 'axios';
import { useRef, useState } from 'react';
import { useAppDispatch } from '../../app/hooks';
import { setTreeData } from '../../store/treeDataSlice';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function UploadButton() {
  const [open, setOpen] = useState(false);

  const inputFile = useRef(null);
  const dispatch = useAppDispatch();

  const onChange = (file) => {
    const formData = new FormData();
    formData.append('file', file.target.files[0]);
    axios
      .post('/data', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then(function (response: any) {
        setOpen(true);
        inputFile.current.value = null;
        dispatch(setTreeData(response.data));
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          Upload was successful!
        </Alert>
      </Snackbar>
      <input
        ref={inputFile}
        type="file"
        accept="text/xml"
        style={{ display: 'none' }}
        onChange={onChange}
      />
      <Button onClick={() => inputFile.current.click()}>Upload</Button>
    </React.Fragment>
  );
}
