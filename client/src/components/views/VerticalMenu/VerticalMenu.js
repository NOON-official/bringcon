import React, {useState} from 'react';
import './VerticalMenu.css';
import Flag from './flag.png';
import $ from 'jquery';

export const VerticalMenu = () => {

    $(".component a").each(
        function(index){
            if(window.location.href == this.href){
                $(this).addClass("current");
            }
        }
    );

    return (
        <div class="component" style={{width: 100}}>
            <ul>
                <li class="profile" key="1"><a href="/">프로필<span><img src={Flag} style={{width:'12px'}}/></span></a></li>
                <li class="history" key="2"><a href="/history">구매 내역<span><img src={Flag} style={{width:'12px'}}/></span></a></li>
                <li class="content" key="3"><a href="/">내 콘텐츠<span><img src={Flag} style={{width:'12px'}}/></span></a></li>
                <li class="like" key="4"><a href="/">찜한 상품<span><img src={Flag} style={{width:'12px'}}/></span></a></li>
                <li class="review" key="5"><a href="/board">내 후기<span><img src={Flag} style={{width:'12px'}}/></span></a></li>
            </ul>
        </div>
    );
}

export default VerticalMenu;