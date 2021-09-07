import React from 'react';
import { Redirect } from 'react-router-dom';
import SearchFeature from '../LandingPage/Sections/SearchFeature';
import './Main.css';
import ufo from '../LoginPage/sections/ufo.svg';

function MainPage(){
    
    const submitSearchTerm = (newSearchTerm) => {
        return ( <Redirect to={{
            pathname: '/contents',
            state: { SearchTerm: newSearchTerm }
        }}/> );
    }
    
    return(
        <div id="body" style={{width: '100vw'}}>
            <div className="main-info">
                <h2>광활한 콘텐츠의 우주에 오신 것을 환영합니다.<br/>
                    저는 당신의 콘텐츠 여행을 돕는 가이드, BRINGCON입니다.</h2>
                <SearchFeature refreshFunction={submitSearchTerm} style={{width: '500px'}}/>
            </div>
            <div className="decorations">
                <img src={ufo} className="ufo"/>
            </div>
        </div>
    )
}

export default MainPage;
