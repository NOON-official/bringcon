import React, {Component} from 'react';
import BoardForm from './BoardForm';
import './css/BoardForm.css';
import {} from 'jquery.cookie';
import mobile from '../Main/mobile.png';

class BodyPage extends Component {
    render() {
        return (
            <div>
                <div id="small-body">
                    <img src={mobile} className="mobile"/>
                </div>
                <div id="body" style={{width: 'auto', backgroundColor:"#1C1C1C", minHeight: '90vh', overflow: 'auto'}}>
                    <BoardForm/>
                </div>
            </div>
        );
    } 
}

export default BodyPage;
