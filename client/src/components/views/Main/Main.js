import React from 'react';
import Footer from './Footer';
import MainPage from './MainPage';
import HorizontalScroll from 'react-scroll-horizontal';

function Main(){
    return (
        <div id = "horizontal-relative">
        <HorizontalScroll >
            <MainPage/>
            <Footer/> 
        </HorizontalScroll>
        </div>
    )
}

export default Main;