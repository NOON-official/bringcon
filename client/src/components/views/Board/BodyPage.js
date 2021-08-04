import React, {Component} from 'react';
import BoardForm from './BoardForm';
import BoardDetail from './BoardDetail';
import { Route } from 'react-router-dom';
import $ from 'jquery';
import {} from 'jquery.cookie';
import VerticalMenu from '../VerticalMenu/VerticalMenu';

class BodyPage extends Component {
    render() {
        return (
            <div>
                <VerticalMenu/>
                <BoardForm/>
                <Route path="/board/detail" component={BoardDetail}></Route>
            </div>
            
        );
    } 
}

export default BodyPage;
