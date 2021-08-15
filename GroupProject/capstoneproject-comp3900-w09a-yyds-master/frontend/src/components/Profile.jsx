import React from 'react';
// import Skeleton from '@material-ui/lab/Skeleton';
import Avatar from '@material-ui/core/Avatar';
import { useStyles } from './Style';
import Container from '@material-ui/core/Container';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Input from '@material-ui/core/Input';
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FetchFunc from './fetchFunc';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import { TextPopup } from './TextPopup';
import axios from 'axios';

function update(nickName, gender, BOD, imgFile, firstName, lastName, token, setMsg, setTitlePop, setOpen) {

    var formData = new FormData();
    formData.append('profilePhoto', imgFile);
    formData.append('jsonData',new Blob ([JSON.stringify({
        firstName: firstName,
        lastName: lastName,
        nickName: nickName,
        birthdate: BOD,
        gender: gender,
        })], {type:"application/json"}));

    formData.forEach((value, key) => {
        console.log(`key ${key}: value ${value}`);
    })
    console.log(formData.get('uploadPhotos'))
    console.log(formData.get('jsonData'))
    axios.post(
        'http://localhost:8080/editProfile',
        formData,
        {
            headers: {
                "token": token, //Authorization
                "Content-Type": "multipart/form-data",
                "type": "formData"
            },                    
        }
    )
    .then(data => {
        console.log(`Success ` + data.status);
        setTitlePop('Error!');
        if (data.status === 200) {
            setMsg('Updated Successfully!');
            setTitlePop('Congratulation!');
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
        setOpen(true);
    })
    .catch(err => {
        console.log(err);
    })

}

function getInfo(setNickName, setBOD, setEmail, setAvatar, setGender, setFirst, setLast, token) {
    const result = FetchFunc('myProfile', 'GET', token, null);
    result.then(data => {
        if(data.status === 200) {
            data.json().then(res => {
                console.log(res);
                setNickName(res.userInfo.nickName);
                setBOD(res.userInfo.birthdate);
                console.log(res.userInfo.birthdate)
                setEmail(res.userInfo.email);
                if (res.userInfo.profilePhoto !== null) {
                    var url = res.userInfo.profilePhoto
                    setAvatar(url)
                    localStorage.setItem('avatar', url);
                }
                setGender(res.userInfo.gender)
                setFirst(res.userInfo.firstName)
                setLast(res.userInfo.lastName)
            })
        }
    })
    .catch(err => console.error('Caught error: ', err))
}

export default function Profile () {
    const [nickName, setNickName] = React.useState('X');
    const [BOD, setBOD] = React.useState('2000-01-01');
    const [email, setEmail] = React.useState('12345678@gmail.com');
    const [avatar, setAvatar] = React.useState('');
    const [imgFile, setImgFile] = React.useState('');
    const [gender, setGender] = React.useState(Number(-1));
    const [firstName, setFirst] = React.useState('');
    const [lastName, setLast] = React.useState('');
    const [open, setOpen] = React.useState(false);
    const [titlePop, setTitlePop] = React.useState('');
    const [msg, setMsg] = React.useState('');
    const token = localStorage.getItem('token');
    const classes = useStyles();
    React.useEffect(()=>{ 
        getInfo(setNickName, setBOD, setEmail, setAvatar, setGender, setFirst, setLast, token)
      },[])
    
    const handleChange = (event) => {
        setNickName(event.target.value);
    };
    const handleChangeFirstName = (event) => {
        setFirst(event.target.value);
    };
    const handleChangeLastName = (event) => {
        setLast(event.target.value);
    };
    const handleChangeImg = (event) => {
        // console.log(event.target.value)
        // var img = event.target.value;
        // var reader = new FileReader();
        var url = URL.createObjectURL(event.target.files[0])
        // var url = reader.readAsDataURL(event.target.value);
        console.log(url)
        // reader.onload = function(event) {
        //     this.setState({uploadedImage: event.target.value});
        // };
        // console.log(url.result)
        setImgFile(event.target.files[0])
        setAvatar(url);
    };

    return (
        <Container className={classes.paper} maxWidth="xs">
            <Avatar alt={nickName} className={classes.large} src={avatar} />
            <input
                accept="image/*"
                className={classes.input}
                id="upload-avatar"
                type="file"
                onChange={e => handleChangeImg(e)}
            />
            <label htmlFor="upload-avatar">
                <Button
                    style={{ marginBottom: 14 }}
                    variant="contained"
                    color="primary"
                    component="span"
                    endIcon={<PhotoCamera />}
                >
                    Upload
                </Button>
            </label>

            {/* <FormControl>
                <InputLabel htmlFor="component-simple">Nick Name</InputLabel>
                <Input fullWidth='true' value={nickName} onChange={e => handleChange(e)} />
            </FormControl> */}
            <h2>{email}</h2>
            {/* <div className={classes.form}>
            </div> */}
            <form className={classes.form_notop} noValidate>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="First Name"
                            // variant="filled"
                            style={{ margin: 8 }}
                            value={firstName}
                            fullWidth
                            margin="normal"
                            onChange={e => handleChangeFirstName(e)}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Last Name"
                            // variant="filled"
                            style={{ margin: 8 }}
                            value={lastName}
                            fullWidth
                            margin="normal"
                            onChange={e => handleChangeLastName(e)}
                        />
                    </Grid>
                </Grid>

                <Grid item xs={12} className={classes.form}>
                    <TextField
                        label="Nick Name"
                        // variant="filled"
                        style={{ margin: 8 }}
                        value={nickName}
                        fullWidth
                        margin="normal"
                        onChange={e => handleChange(e)}
                    />
                </Grid>
                
                <Grid item xs={12} className={classes.form}>
                    <TextField
                        id="date"
                        label="Birthday"
                        type="date"
                        style={{ marginLeft: 7, marginBottom: 4}}
                        fullWidth
                        value={BOD}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        onChange={(e) => setBOD(e.target.value)}
                    />
                </Grid>
                
                <FormControl fullWidth={true} style={{ marginLeft: 7, marginBottom: 4}}>
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
                
                <Button
                    name='signup'
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                    onClick={() => update(nickName, gender, BOD, imgFile, firstName, lastName, token, setMsg, setTitlePop, setOpen)}
                >
                Save
                </Button>
            </form>
            <TextPopup
                open={ open }
                setOpen={ setOpen }
                title={titlePop}
                msg={msg}
                newButton={false}
            />
        </Container>
    )
}