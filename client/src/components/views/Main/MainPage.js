import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import SearchFeature from '../LandingPage/Sections/SearchFeature';
import './Main.css';
import ufo from '../LoginPage/sections/ufo.svg';

function MainPage(){
    
    const [ Entered, setEntered ] = useState(0);
    const [ newSearchTerm, setnewSearchTerm ] = useState("");
    
    const submitSearchTerm = (searchTerm) => {
        //console.log(newSearchTerm);
        setEntered(1);
        setnewSearchTerm(searchTerm);
    }
    
    return(
        <div id="body" style={{width: '100vw'}}>
            <Helmet>
                <title>BRINGCON</title>
                < meta name="google-site-verification" content="7n5xoSLEUqYqdIAzcqRHF0y5c4Q-A-FFJC4_BsDC9TQ" /> 
            </Helmet>
            <div className="main-info">
                <h2>광활한 콘텐츠의 우주에 오신 것을 환영합니다.<br/>
                    저는 당신의 콘텐츠 여행을 돕는 가이드, BRINGCON입니다.</h2>
                <SearchFeature refreshFunction={submitSearchTerm} style={{width: '500px'}}/>
            </div>
            <div className="decorations">
                <img src={ufo} className="ufo"/>
            </div>
            { Entered === 1 && <Redirect to={{ pathname: '/contents', search: `?q=${newSearchTerm}`}}/> }
        </div>
    )
}

export default MainPage;
