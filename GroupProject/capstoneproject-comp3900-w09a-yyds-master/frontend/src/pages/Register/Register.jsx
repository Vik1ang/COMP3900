import React from 'react';
import { useHistory } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { myStyles } from './Register.style';
import FetchFunc from '../../components/fetchFunc';
import { TextPopup } from '../../components/TextPopup';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import StyledHeader from '../../components/StyledHeader'

function signup (firstName, lastName, gender, nickName, birthDate, email, password, history, setMsg, setOpen) {
  // console.log('incomplete' + email + password);
  const payload = JSON.stringify({
    firstName: firstName,
    lastName: lastName,
    gender: gender,
    nickName: nickName,
    birthdate: birthDate,
    email: email,
    password: password
  });
  console.log(payload)
  const result = FetchFunc('register', 'POST', null, payload);
  result.then(data => {
    console.log(data.status);
    if (data.status === 200) {
      console.log(data);
      history.push('./wait')
    } else if (data.status === 600 || data.status === 666) {
      setMsg('Input is incorrect!');
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
    }
    setOpen(true)
  })
}

export default function Register () {
  const [firstName, setFirstNameInputs] = React.useState('');
  const [lastName, setLastNameInputs] = React.useState('');
  const [nickName, setNickNameInputs] = React.useState('');
  const [gender, setGender] = React.useState(Number(-1));
  const [birthDate, setBOD] = React.useState('2000-01-01');
  const [emailInputs, setEmailInputs] = React.useState('');
  const [passWord, setPasswordInputs] = React.useState('');
  const [msg, setMsg] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const history = useHistory();
  const classes = myStyles();

  // const handleChange = (event) => {
  //   setGender(event.target.value);
  // };

  // console.log(emailInputs)
  // const firstname = document.getElementById('firstName');
  // const lastname = document.getElementById('lastName');
  // const email = document.getElementById('email');
  // const password = document.getElementById('password');

  return (
    <React.Fragment>
      <CssBaseline />
      <main>
      <StyledHeader/>
        <Container component="main" maxWidth="xs" className={classes.backg}>
          <CssBaseline />
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign up
            </Typography>
            <form className={classes.form} noValidate>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    autoComplete="fname"
                    name="firstName"
                    variant="outlined"
                    required
                    fullWidth
                    id="firstName"
                    label="First Name"
                    autoFocus
                    onChange={(e) => setFirstNameInputs(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="lastName"
                    label="Last Name"
                    name="lastName"
                    autoComplete="lname"
                    onChange={(e) => setLastNameInputs(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    onChange={(e) => setEmailInputs(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    onChange={(e) => setPasswordInputs(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    id="date"
                    label="Birthday"
                    type="date"
                    defaultValue="2000-01-01"
                    className={classes.textField}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={(e) => setBOD(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    autoComplete="nname"
                    name="nickName"
                    variant="outlined"
                    required
                    fullWidth
                    id="nickName"
                    label="Nick Name"
                    autoFocus
                    onChange={(e) => setNickNameInputs(e.target.value)}
                  />
                </Grid>
                <FormControl fullWidth={true} variant='outlined' className={classes.formControl}>
                  <InputLabel>Gender</InputLabel>
                  <Select
                    label="Gender"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                  >
                    <MenuItem value={Number(-1)}>
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value={Number(0)}>Male</MenuItem>
                    <MenuItem value={Number(1)}>Female</MenuItem>
                  </Select>
                </FormControl>
                {/* </Grid> */}
                {/* <Grid item xs={12}>
                  <FormControlLabel
                    control={<Checkbox value="allowExtraEmails" color="primary" />}
                    label="I want to receive inspiration, marketing promotions and updates via email."
                  />
                </Grid> */}
              </Grid>
              <Button
                // type="submit"
                name='signup'
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                disabled={emailInputs == '' || passWord == '' || firstName == '' || lastName == '' || nickName == ''}
                onClick={() => signup(firstName, lastName, gender, nickName, birthDate, emailInputs, passWord, history, setMsg, setOpen)}
              >
                Sign Up
              </Button>
              <TextPopup
                open={ open }
                setOpen={ setOpen }
                title='Error'
                msg={msg}
                newButton={false}
              />
              <Grid container justify="flex-end">
                <Grid item className={classes.marginBtm}>
                  <Link href="/" variant="body2">
                    Already have an account? Sign in
                  </Link>
                </Grid>
              </Grid>
            </form>
          </div>
        </Container>
      </main>
    </React.Fragment>
  );
}
