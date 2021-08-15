import React from 'react';
import { useHistory } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import { myStyles } from './Wait.style';

function handleClick(history) {
    history.push('./');
}


export default function Wait() {
    const css = myStyles();
    const history = useHistory();
    return (
        <Container component="main" maxWidth="xs">

            <div className={css.paper}>
                <h1>Welcome to YYDS recipe!</h1>

                <h1>Please Verify Your Email!</h1>

                <h2>Back to login in!</h2>
            </div>
            <Button variant="contained" color="primary" fullWidth onClick={() => handleClick(history)}>
                Back
            </Button>

        </Container>


    )



}