import React from 'react';
import { useStyles } from './Style';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Input from '@material-ui/core/Input';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import FetchFunc from './fetchFunc';

function update(passWordOld, passWordNew, passWordConf, token) {
    console.log('old is ' + passWordOld + ' new is ' + passWordNew + ' confirm is ' + passWordConf)
    if (passWordNew !== passWordConf) {
        alert('make sure new password is same as confirmation')
    } else {
        const payload = JSON.stringify({
            oldPassword: passWordOld,
            newPassword: passWordNew,
        });
        const result = FetchFunc('editPassword', 'POST', token, payload);
        result.then(data => {
            if (data.status === 200) {
                alert('Success')
            }
        })
        .catch(err => console.error('Caught error: ', err))
    }
}

function getInfo(setEmail, token) {
    const result = FetchFunc('myProfile', 'GET', token, null);
    result.then(data => {
        if(data.status === 200) {
            data.json().then(res => {
                console.log(res);
                setEmail(res.userInfo.email);
            })
        }
    })
    .catch(err => console.error('Caught error: ', err))
}

export default function Profile () {
    const [email, setEmail] = React.useState('12345678@gmail.com');
    const [passWordOld, setPassWordOld] = React.useState('')
    const [passWordNew, setPassWordNew] = React.useState('')
    const [passWordConf, setPassWordConf] = React.useState('')
    const [showPasswordOld, setShowOld] = React.useState(false)
    const [showPasswordNew, setShowNew] = React.useState(false)
    const [showPasswordConf, setShowConf] = React.useState(false)
    const token = localStorage.getItem('token');
    const classes = useStyles();

    React.useEffect(() => {
        getInfo(setEmail, token)
    }, [])

    const handleShowPasswordOld = () => {
        setShowOld(!showPasswordOld);
    };
    const handleShowPasswordNew = () => {
        setShowNew(!showPasswordNew);
    };
    const handleShowPasswordConf = () => {
        setShowConf(!showPasswordConf);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
      };

    return (
        <Container className={classes.paper} maxWidth="xs">

            <h2>{email}</h2>

            <form className={classes.form} noValidate>
                {/* <Grid item xs={12} className={classes.form}>
                    <TextField
                        label="Old Password"
                        style={{ margin: 8 }}
                        value={passWordOld}
                        type={showPassword ? 'text' : 'password'}
                        fullWidth
                        margin="normal"
                        onChange={e => setPassWordOld(e.target.value)}
                        // endAdornment = {showPassword ? <Visibility /> : <VisibilityOff />}
                    />
                </Grid>
                
                <Grid item xs={12} className={classes.form}>
                    <TextField
                        label="New Password"
                        style={{ margin: 8 }}
                        value={passWordNew}
                        type={showPassword ? 'text' : 'password'}
                        fullWidth
                        margin="normal"
                        onChange={e => setPassWordNew(e.target.value)}
                    />
                </Grid>

                <Grid item xs={12} className={classes.form}>
                    <TextField
                        label="New Password"
                        style={{ margin: 8 }}
                        value={passWordConf}
                        type={showPassword ? 'text' : 'password'}
                        fullWidth
                        margin="normal"
                        onChange={e => setPassWordConf(e.target.value)}
                    />
                </Grid> */}
                
                <FormControl className={classes.form}>
                    <InputLabel htmlFor="standard-adornment-password">Old Password</InputLabel>
                    <Input
                        id="standard-adornment-password"
                        type={showPasswordOld ? 'text' : 'password'}
                        value={passWordOld}
                        onChange={e => setPassWordOld(e.target.value)}
                        endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleShowPasswordOld}
                            onMouseDown={handleMouseDownPassword}
                            >
                            {showPasswordOld ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                        </InputAdornment>
                        }
                    />
                </FormControl>

                <FormControl className={classes.form}>
                    <InputLabel htmlFor="standard-adornment-password">New Password</InputLabel>
                    <Input
                        id="standard-adornment-password"
                        type={showPasswordNew ? 'text' : 'password'}
                        value={passWordNew}
                        onChange={e => setPassWordNew(e.target.value)}
                        endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleShowPasswordNew}
                            onMouseDown={handleMouseDownPassword}
                            >
                            {showPasswordNew ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                        </InputAdornment>
                        }
                    />
                </FormControl>

                <FormControl className={classes.form}>
                    <InputLabel htmlFor="standard-adornment-password">Confirm</InputLabel>
                    <Input
                        id="standard-adornment-password"
                        type={showPasswordConf ? 'text' : 'password'}
                        value={passWordConf}
                        onChange={e => setPassWordConf(e.target.value)}
                        endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleShowPasswordConf}
                            onMouseDown={handleMouseDownPassword}
                            >
                            {showPasswordConf ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                        </InputAdornment>
                        }
                    />
                </FormControl>
                
                <Button
                    name='signup'
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.done}
                    onClick={() => update(passWordOld, passWordNew, passWordConf)}
                >
                Done
                </Button>
            </form>

        </Container>
    )
}