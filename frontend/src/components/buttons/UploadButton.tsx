import * as React from 'react';
import Button from '@mui/material/Button';
import axios from 'axios';
import { useRef, useState } from 'react';
import { useAppDispatch } from '../../app/hooks';
import { setGraphData } from '../../store/graphDataSlice';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import UploadIcon from '@mui/icons-material/Upload';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function UploadButton() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState('success');

  const inputFile = useRef(null);
  const dispatch = useAppDispatch();

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const onChange = async (file) => {
    const formData = new FormData();
    formData.append('file', file.target.files[0]);

    try {
      const { data } = await axios.post('/data', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // set status
      setOpen(true);
      setStatus('success');

      // update global graph data
      dispatch(setGraphData(data));

      // reset to allow to upload same file again
      inputFile.current.value = null;
    } catch (e) {
      if (axios.isAxiosError(e)) {
        console.log(e.message);
      } else {
        console.log(e);
      }
      setStatus('error');
    }
  };

  return (
    <React.Fragment>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        open={open}
        autoHideDuration={2000}
        onClose={handleClose}>
        <Alert onClose={handleClose} severity={status == 'success' ? 'success' : 'error'}>
          Upload was {status === 'success' && 'not'} successful!
        </Alert>
      </Snackbar>
      <input
        ref={inputFile}
        type="file"
        accept="text/xml"
        style={{ display: 'none' }}
        onClick={() => (inputFile.current.value = null)}
        onChange={onChange}
      />
      <Button
        onClick={() => inputFile.current.click()}
        variant="outlined"
        startIcon={<UploadIcon />}>
        Load
      </Button>
    </React.Fragment>
  );
}
