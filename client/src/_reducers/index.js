import { combineReducers } from 'redux';
import user from './user_reducer';


//여러개의 Reducer들을 하나로 합쳐서,
//하나의 Reducer로 관리할 수 있게 만들어줌

//현재는 user하나만 있음!
const rootReducer = combineReducers({
    user,
});

export default rootReducer;