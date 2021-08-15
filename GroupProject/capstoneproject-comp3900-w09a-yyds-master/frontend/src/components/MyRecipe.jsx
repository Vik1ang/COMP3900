import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import RecipeCard from './RecipeCard';
import FetchFunc from './fetchFunc';
import { useStyles } from './Style';
import { grey } from '@material-ui/core/colors';

var timer = null;
// const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9];
// pageNum=1&pageSize=9&search=
function getRecipe(token, userId, setRecipes) {
    const result = FetchFunc('recipe/recipe_list?userId=' + userId, 'GET', token, null);
    result.then(data => {
        if (data.status === 200) {
            data.json().then(res => {
                const total = res.total
                for (var i = 0; i < total; i++) {
                    var info = {
                        recipeId: res.recipe_lists[i].recipeId,
                        intro: res.recipe_lists[i].introduction,
                        photo: res.recipe_lists[i].recipePhotos[0],
                        title: res.recipe_lists[i].title,
                    }
                    console.log(info)
                    setRecipes(ele => [...ele, info]);
                }
            })
        }
    })
    .catch(err => console.error('Caught error: ', err))
}

export default function MyRecipe() {

    const classes = useStyles();
    // const url = window.location.href.split('/')
    // const recipeId = url[url.length - 1]
    const [recipes, setRecipes] = React.useState([]);
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const [msg, setMsg] = React.useState('Loading...');
    const [sec, setSec] = React.useState(10);
    console.log(recipes.length)

    React.useEffect(() => {
        getRecipe(token, userId, setRecipes)
        timer = window.setInterval(() => {
            setSec(s => s - 1);
        }, 1000);
    }, [])

    React.useEffect(() => {
        if (sec <= 0) {
            clearInterval(timer);
            setMsg('You haven\'t upload any recipes')
        }
        if (recipes.length != 0) {
            clearInterval(timer);
        }
    }, [sec])


    return (
        <React.Fragment>
        <CssBaseline />
        <main>
            <Container className={classes.cardGrid} maxWidth="md">
            {recipes.length != 0 ? <Grid container spacing={4}>
                {recipes.map((recipe) => (
                    <RecipeCard recipeId={recipe.recipeId} intro={recipe.intro} title={recipe.title} photo={recipe.photo} />
                ))}
            </Grid> : <div className={classes.paper}>
                <h1 style = {{ color: grey[400] }}>{msg}</h1>
                </div>}
            </Container>
        </main>
        </React.Fragment>
    );
}
