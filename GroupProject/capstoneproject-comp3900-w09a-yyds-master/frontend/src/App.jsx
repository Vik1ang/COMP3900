import React from 'react';
// import style from './App.module.css';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import Register from './pages/Register/Register';
import Login from './pages/Login/Login'
import Home from './pages/Home/index'
import Footer from './components/footer';
import Wait from './pages/Wait/Wait';
import StyledHeader from './components/StyledHeader'

export default function App () {
  return <Router>
      {/* <StyledHeader /> */}
      <div className='container_backg'>
        <Switch>
          
          <Route path="/" exact>
            <div className='back-Img'>
              <Login />
            </div>
          </Route>

          <Route path="/home" >        
              <Home />       
          </Route>

          <Route path="/register" exact>
            <div className='back-Img'>
              <Register />
            </div>
          </Route>

          <Route path="/wait" exact>
            <Wait />
          </Route>

        </Switch>
        <Footer/>
      </div>
    </Router>;
}
