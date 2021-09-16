import React from 'react';
import HorizontalScroll from 'react-scroll-horizontal';
import Img1 from './page-1.png';
import Img2 from './page-2.png';
import Img3 from './page-3.png';
import Img4 from './page-4.png';
import Img5 from './page-5.png';
import mobile from '../Main/mobile.png';
import './About.css';

function About(){
    return(
        <div>
             <div id="small-body">
                <img src={mobile} className="mobile"/>
            </div>
            <div id="body" style={{width: 'auto'}}>
                <HorizontalScroll reverseScroll={true}>
                    <div>
                        <img src={Img1} className="about-page"/>
                    </div>
                    <div>
                        <img src={Img2} className="about-page" style={{position: 'relative'}}/>
                        <div className="welcome-text">
                                <div id="explain"> 현재 유튜브의 저작권 대처에는 어떤 문제점이 있을까요? </div>
                                <div id="explain"> 이런 문제를 해결하기 위해 브링콘이 왔습니다! </div>
                                <button className="copyright-button" onClick={() => window.open('https://support.google.com/youtube/answer/2814000?hl=ko#zipp', '_blank')}>
                                    유튜브 저작권 개정안 확인하기
                                </button>
                        </div>
                    </div>
                    <div>
                        <img src={Img3} className="about-page"/>
                    </div>
                    <div>
                        <img src={Img4} className="about-page"/>
                    </div>
                    <div>
                        <img src={Img5} className="about-page"/>
                    </div>
                </HorizontalScroll>
            </div>
        </div>
    )
}

export default About;