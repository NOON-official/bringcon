import {
    LOGIN_USER,
    REGISTER_USER,
    AUTH_USER,
    LOGOUT_USER,
    ADD_TO_CART,
    GET_CART_ITEMS,
    REMOVE_CART_ITEM,
    ON_SUCCESS_BUY
} from '../_actions/types';


//리듀서는 2개의 인자를 전달받는 JavaScript 함수
//(현재의 state, action)
export default function (state = {}, action) {
    switch (action.type) {
        case REGISTER_USER:
            return { ...state, register: action.payload }
        case LOGIN_USER:
            return { ...state, loginSucces: action.payload }
        case AUTH_USER:
            return { ...state, userData: action.payload }
        case LOGOUT_USER:
            return { ...state }
        case ADD_TO_CART:
            return {
                ...state,
                userData: {
                    ...state.userData,
                    cart: action.payload
                }
            }
        case GET_CART_ITEMS:
            return { ...state, cartDetail: action.payload }
        case REMOVE_CART_ITEM:
            return {
                ...state, cartDetail: action.payload.productInfo,
                userData: {
                    ...state.userData,
                    cart: action.payload.cart
                }
            }
        case ON_SUCCESS_BUY:
            return {
                ...state, cartDetail: action.payload.cartDetail,
                userData: {
                    ...state.userData, cart: action.payload.cart
                }
            }

        //어떤 case도 통과되지 못하면 원래 존재했던 state를 반환    
        default:
            return state;
    }
}