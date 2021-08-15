import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import { Carousel } from 'antd';
import FetchFunc from './fetchFunc';
import { useStyles } from './Style';
import { TextPopup } from './TextPopup';
import axios from 'axios';

function getRecipe(token, recipeId, setTitle, setTime, setIntro, setIngre, setMethod, setTags, setPhotos) {
    const result = FetchFunc('recipe/recipe_list?recipeId=' + recipeId, 'GET', token, null);
    result.then(data => {
        if (data.status === 200) {
            data.json().then(res => {
                const recipe = res.recipe_lists[0];
                setTitle(recipe.title);
                setTime(recipe.timeDuration);
                setIntro(recipe.introduction);
                setIngre(recipe.ingredients);
                setMethod(recipe.method);
                setTags(recipe.tags);
                setPhotos(recipe.recipePhotos);
            })
        }
    })
}

function updateRecipe(title, introduction, ingredients, method, timeDuration, fileList ,token, recipeId, tags, setMsg, setTitlePop, setOpen) {

    var formData = new FormData();
    if(fileList !== undefined){
        for(let i=0;i<fileList.length;i++){
            formData.append('uploadPhotos', fileList[i]);
        }
    }
    
    formData.append('jsonData',new Blob ([JSON.stringify({
        title: title,
        introduction: introduction,
        ingredients: ingredients,
        method: method,
        timeDuration: timeDuration,
        recipeId: recipeId,
        tags: tags,
        })], {type:"application/json"}));

    axios.post(
        'http://localhost:8080/recipe/update',
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
        console.log(`Success` + data.data);
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

export default function EditRecipe () {
    const url = window.location.href.split('/')
    const recipeId = url[url.length - 1]
    const token = localStorage.getItem('token')
    const classes = useStyles();
    const [title, setTitle] = React.useState('');
    const [time, setTime] = React.useState('');
    const [intro, setIntro] = React.useState('');
    const [method, setMethod] = React.useState('');
    const [ingre, setIngre] = React.useState('');
    const [tags, setTags] = React.useState([]);
    const [titlePop, setTitlePop] = React.useState('');
    const [msg, setMsg] = React.useState('');
    const [fileList, setFileList] = React.useState();
    const [photolist, setPhotos] = React.useState([]);
    const [open, setOpen] = React.useState(false);

    const handleTitle = (e) => {
        setTitle(e.target.value)
    }
    const handleTime = (e) => {
        setTime(e.target.value)
    }
    const handleIntro = (e) => {
        setIntro(e.target.value)
    }
    const handleIngre = (e) => {
        setIngre(e.target.value)
    }
    const handleMethod = (e) => {
        setMethod(e.target.value)
    }
    const handleUpload = (e) => {
        setFileList(e.target.files)
    }

    React.useEffect(() => {
        getRecipe(token, recipeId, setTitle, setTime, setIntro, setIngre, setMethod, setTags, setPhotos);
    }, [])

    return (
        <React.Fragment>
        <CssBaseline />
        <main className={classes.layout}>
          <Paper className={classes.paper2}>
            <Typography component="h1" variant="h4" align="center">
              Edit Recipe
            </Typography>
            <React.Fragment>
                <Grid container spacing={4}>
                    <Grid item xs = {12}>
                        <Carousel autoplay effect="fade" arrows={true} className={classes.paper3}>{
                            photolist.map((i)=>(
                                <div>       
                                    <img style={{ maxHeight: '150px', maxWidth: '150px', width: '100%', height: '100%', object_fit:'contain' }} src= {i} alt="" />
                                </div>
                                ))
                            }
                        </Carousel>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                    <TextField
                        required
                        label="Title"
                        value={title}
                        fullWidth
                        onChange={(e) => handleTitle(e)}
                    />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                    <TextField
                        required
                        value={time}
                        label="Time"
                        fullWidth
                        type='number'
                        InputProps={{
                            endAdornment: <InputAdornment position="end">Min(s)</InputAdornment>,
                        }}
                        onChange={(e) => handleTime(e)}
                    />
                    </Grid>
                    <Grid item xs={12}>
                    <TextField
                        required
                        label="Introduction"
                        fullWidth
                        multiline
                        value={intro}
                        rows={4}
                        variant="outlined"
                        onChange={(e) => handleIntro(e)}
                    />
                    </Grid>
                    <Grid item xs={12}>
                    <TextField
                        required
                        label="Method"
                        fullWidth
                        multiline
                        value={method}
                        rows={8}
                        variant="outlined"
                        onChange={(e) => handleMethod(e)}
                    />
                    </Grid>
                    <Grid item xs={12}>
                    <TextField
                        required
                        label="Ingredients"
                        fullWidth
                        multiline
                        value={ingre}
                        rows={4}
                        variant="outlined"
                        onChange={(e) => handleIngre(e)}
                    />
                    </Grid>
                </Grid>
            <React.Fragment>
                <input
                    accept="image/*"
                    className={classes.input}
                    id="upload-avatar"
                    type="file"
                    multiple
                    onChange={e => handleUpload(e)}
                />
                <label htmlFor="upload-avatar">
                    <Button
                        className={classes.button}
                        variant="contained"
                        color="primary"
                        component="span"
                        fullWidth
                        endIcon={<PhotoCamera />}
                    >
                        Upload
                    </Button>
                </label>
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    className={classes.button}
                    onClick = {() => updateRecipe(title, intro, ingre, method, time, fileList ,token, recipeId, tags, setMsg, setTitlePop, setOpen)}
                    >
                    Save
                </Button>
            </React.Fragment>
            <TextPopup
                open={ open }
                setOpen={ setOpen }
                title={titlePop}
                msg={msg}
                newButton={false}
            />
            </React.Fragment>
          </Paper>
        </main>
      </React.Fragment>
    )
}