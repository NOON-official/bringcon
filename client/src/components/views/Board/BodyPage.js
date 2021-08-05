import React, {Component} from 'react';
import BoardForm from './BoardForm';
import {} from 'jquery.cookie';

class BodyPage extends Component {
    render() {
        return (
            <div>
                <BoardForm/>
            </div>
        );
    } 
}

export default BodyPage;