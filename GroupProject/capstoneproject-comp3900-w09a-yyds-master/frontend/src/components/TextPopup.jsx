import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';

export function TextPopup ({ open = false, setOpen, title = 'Notification', msg, newButton, newButtonMsg, newButtonFun }) {
  const handleClose = () => setOpen(false);
  return (
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" fullWidth>
        <DialogTitle id="form-dialog-title">{title}</DialogTitle>
        <DialogContent>
          {msg}
          {title == 'Congratulation!' ? <CheckCircleOutlineIcon style={{ float: 'right', bottom: '70%', width: '40px', height: '40px' }} />
          : <ErrorOutlineIcon style={{ float: 'right', bottom: '70%', width: '40px', height: '40px' }} />}
        </DialogContent>
        <DialogActions>
          {newButton && <Button onClick={() => newButtonFun} color="primary">
            {newButtonMsg}
          </Button>}
          <Button onClick={() => handleClose()} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
  );
}
TextPopup.propTypes = {
  open: PropTypes.bool,
  newButton: PropTypes.bool,
  setOpen: PropTypes.func,
  title: PropTypes.string,
  msg: PropTypes.string,
  newButtonMsg: PropTypes.string,
  newButtonFun: PropTypes.func,
};
