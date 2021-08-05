import React, {Component} from 'react';
import BoardForm from './BoardForm';
import {} from 'jquery.cookie';
import VerticalMenu from '../VerticalMenu/VerticalMenu';

class BodyPage extends Component {
    render() {
        return (
            <div>
                <VerticalMenu/>
                <BoardForm/>
            </div>
        );
    } 
}

export default BodyPage;
