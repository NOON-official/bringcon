import React, {Component} from 'react';
import BoardForm from './BoardForm';
import BoardDetail from './BoardDetail';
import { Route } from 'react-router-dom';
import $ from 'jquery';
import {} from 'jquery.cookie';

class BodyPage extends Component {
    render() {
        return (
            <div>
                <BoardForm/>
                <Route path="/board/detail" component={BoardDetail}></Route>
            </div>
            
        );
    } 
}

export default BodyPage;