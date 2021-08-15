import { makeStyles } from '@material-ui/core/styles';

const myStyles = makeStyles((theme) => ({
    paper: {
      marginTop: theme.spacing(8),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
  }));
  
  export { myStyles };