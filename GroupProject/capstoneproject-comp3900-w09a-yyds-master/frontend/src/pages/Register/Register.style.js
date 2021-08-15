import { makeStyles } from '@material-ui/core/styles';

const myStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  backg: {
    background: 'rgba(255, 255, 255, 0.8)',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  marginBtm: {
    marginBottom: theme.spacing(2),
  },
}));

export { myStyles };
