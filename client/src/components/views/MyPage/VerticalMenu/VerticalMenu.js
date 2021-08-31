import React from 'react';
import './VerticalMenu.css';
import Flag from './flag.svg';
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
                <li className="profile" key="0"><a href="/user/profile">Profile<span><img src={Flag} style={{width:'12px'}}/></span></a></li>
                <li className="history" key="1"><a href="/user/history">History<span><img src={Flag} style={{width:'12px'}}/></span></a></li>
                <li className="content" key="2"><a href="/user/mycontents">My Contents<span><img src={Flag} style={{width:'12px'}}/></span></a></li>
                <li className="review" key="3"><a href="/user/review">Review<span><img src={Flag} style={{width:'12px'}}/></span></a></li>
            </ul>
        </div>
    );
}

export default VerticalMenu;