import React, {Component} from 'react';
import BoardForm from './BoardForm';
import './css/BoardForm.css';
import {} from 'jquery.cookie';

class BodyPage extends Component {
    render() {
        return (
            <div id="#body" style={{backgroundColor:"#1C1C1C", height: '90vh'}}>
                <BoardForm/>
            </div>
        );
    } 
}

export default BodyPage;
