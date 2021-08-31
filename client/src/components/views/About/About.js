import React from 'react';
import HorizontalScroll from 'react-scroll-horizontal';
import Img1 from './page-1.png';
import Img2 from './page-2.png';
import Img3 from './page-3.png';
import Img4 from './page-4.png';
import './About.css';

function About(){
    return(
        <div id="body" style={{width: 'auto'}}>
            <HorizontalScroll>
               <div>
                   <img src={Img1} className="about-page"/>
               </div>
               <div>
                   <img src={Img2} className="about-page"/>
               </div>
               <div>
                   <img src={Img3} className="about-page"/>
               </div>
               <div>
                   <img src={Img4} className="about-page"/>
               </div>
            </HorizontalScroll>
        </div>
    )
}

export default About;