import React, {useState} from 'react';
import './VerticalMenu.css';
import Flag from './flag.png';
import $ from 'jquery';

export const VerticalMenu = () => {

    $(".component a").each(
        function(index){
            if(window.location.href === this.href){
                $(this).addClass("current");
            }
        }
    );

    return (
        <div className="component" style={{width: 168}}>
            <ul>
                <li className="profile" key="1"><a href="/user/mypage">프로필<span><img src={Flag} style={{width:'12px'}}/></span></a></li>
                <li className="history" key="2"><a href="/user/history">구매 내역<span><img src={Flag} style={{width:'12px'}}/></span></a></li>
                <li className="content" key="3"><a href="/user/mycontents">내 콘텐츠<span><img src={Flag} style={{width:'12px'}}/></span></a></li>
                <li className="review" key="5"><a href="/board">내 후기<span><img src={Flag} style={{width:'12px'}}/></span></a></li>
            </ul>
        </div>
    );
}

export default VerticalMenu;