import React from 'react';
import { useHistory } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { myStyles } from './Login.style';
import FetchFunc from '../../components/fetchFunc';
import StyledHeader from '../../components/StyledHeader'
import { TextPopup } from '../../components/TextPopup';

function signin(email, password, history, remember, setOpen, setMsg) {
  const payload = JSON.stringify({
    email: email,
    password: password
  });
  const result = FetchFunc('login', 'POST', null, payload);
  console.log(result)
  result.then((data) => {
    console.log(data);
    if (data.status === 200) {
      data.json().then(res => {
        if (remember) {
          localStorage.setItem('email', email)
        }
        console.log(res);
        localStorage.setItem('userId', res.userId);
        localStorage.setItem('token', res.token);
        localStorage.setItem('avatar', res.profilePhoto);
        history.push('./home')
      })
    } else if (data.status === 601) {
        setMsg('Email already exists!');
      } else if (data.status === 602) {
        setMsg('Email is not valid!');
      } else if (data.status === 603) {
        setMsg('Password is not valid!');
      } else if (data.status === 604) {
        setMsg('Email or password is incorrect!')
      } else if (data.status === 605) {
        setMsg('Please verify your Email!')
      } else if (data.status === 609) {
        setMsg('Some error happen!')
      } else if (data.status === 610) {
        setMsg('Recipe does not exist!')
      } else if (data.status === 611) {
        setMsg('User is not as subscriber!')
      } else if (data.status === 622) {
        setMsg('Following user does not exist!')
      } else if (data.status === 623) {
        setMsg('User ID is not found!')
      } else {
        setMsg('Input is incorrect!');
      }
      setOpen(true)
  })
  .catch(err => console.error('Caught error: ', err))

}

export default function SignIn() {
  // localStorage.clear()
  const classes = myStyles();
  const [email, setEmailInputs] = React.useState(localStorage.getItem('email'));
  const [passWord, setPasswordInputs] = React.useState('');
  const [msg, setMsg] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [remember, setRemember] = React.useState(false);
  const history = useHistory();

  const handleRemember = () => {
    setRemember(!remember)
  }


  return (
    // <div className={classes.size}>
    <React.Fragment>
      <CssBaseline />
      <StyledHeader/> 
      <main>
        <Container component="main" maxWidth="xs" className={ classes.backg }>
          {/* <img src='https://coolwallpapers.me/th700/3056229-cooking_delicious-food_dining_eat_food_fusion-cuisine_morning-bread_platter_restaurant.jpg'/> */ }
          <div className={ classes.paper }>
            <Avatar className={ classes.avatar }>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <form className={ classes.form } noValidate>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                value={email}
                autoComplete="email"
                autoFocus
                onChange={ (e) => setEmailInputs(e.target.value) }
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={ (e) => setPasswordInputs(e.target.value) }
              />
              <FormControlLabel
                control={ <Checkbox value="remember" color="primary" onClick={() => handleRemember()} /> }
                label="Remember me"
              />
              <Button
                fullWidth
                variant="contained"
                color="primary"
                className={ classes.submit }
                onClick={ () => signin(email, passWord, history, remember, setOpen, setMsg) }
              >
                Sign In
              </Button>
              <TextPopup
                open={ open }
                setOpen={ setOpen }
                title='Error'
                msg={msg}
                newButton={false}
              />

              <Grid container>
              <Link href="/home" variant="body4">
                    { "Jump it! I just want have a look!" }
                  </Link>
                <Grid item className={ classes.marginBtm }>
                  <Link href="/register" variant="body1">
                    { "                            Don't have an account? Sign Up" }
                  </Link>
                </Grid>
              </Grid>
            </form>
          </div>
        </Container>
      </main>
    </React.Fragment>
    // </div>
  );
}
