import React, {Component} from 'react';
import BoardForm from './BoardForm';
import './css/BoardForm.css';
import {} from 'jquery.cookie';

class BodyPage extends Component {
    render() {
        return (
            <div id="body" style={{width: 'auto', backgroundColor:"#1C1C1C", minHeight: '90vh', overflow: 'auto'}}>
                <BoardForm/>
            </div>
        );
    } 
}

export default BodyPage;
