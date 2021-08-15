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
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  size: {
    height: '100%',
    width: '100%',
    backgroundImage: `url(${'https://i.pinimg.com/originals/d3/6d/46/d36d462db827833805497d9ea78a1343.jpg'})`,
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
  },
  backg: {
    background: 'rgba(255, 255, 255, 0.8)',
  },
  marginBtm: {
    marginBottom: theme.spacing(2),
  },
  pop: {
    position: 'fixed',
    width: '30%',
    height: '15%',
    overflow: 'auto',
    margin: 'auto',
  },
}));

export { myStyles };
