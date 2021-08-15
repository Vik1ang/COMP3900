import React, { Component } from 'react'
import { NavLink as Link } from 'react-router-dom'


const Footer = () => {
    

        
        return (
        <div>
            {/*footer in every pages*/}
            <footer className="footer-basic">
                <div className="social"><a href="/#"><i className="icon ion-social-instagram"></i></a><a href="/#"><i className="icon ion-social-snapchat"></i></a><a href="/#"><i className="icon ion-social-twitter"></i></a><a href="/#"><i className="icon ion-social-facebook"></i></a></div>
                <ul className="list-inline">
                    <li className="list-inline-item"><Link to="/home">Back to Home</Link></li>
                    <li className="list-inline-item"><Link to="/home/help">Need help?</Link></li>

                </ul>
                <p className="copyright">China - YYDS © 2021</p>
            </footer>
        </div>                       
        )
    
}

export default  Footer