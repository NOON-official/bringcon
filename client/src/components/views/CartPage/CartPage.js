import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { getCartItems, removeCartItem, onSuccessBuy } from '../../../_actions/user_actions';
import UserCardBlock from './Sections/UserCardBlock';
import { Empty, Result, Col } from 'antd';
import Payment from '../../utils/Payment';
import './Sections/CartPage.css';

function CartPage(props) {
    const dispatch = useDispatch();

    const [Total, setTotal] = useState(0)
    const [ShowTotal, setShowTotal] = useState(false)
    const [ShowSuccess, setShowSuccess] = useState(false)
    const [PG, setPG] = useState('html5_inicis')
    const [PayMethod, setPayMethod] = useState('card')

    useEffect(() => {

        let cartItems = []
        //리덕스 User state안에 cart 안에 상품이 들어있는지 확인 
        if (props.user.userData && props.user.userData.cart) {
            if (props.user.userData.cart.length > 0) {
                props.user.userData.cart.forEach(item => {
                    cartItems.push(item.id)
                })
                dispatch(getCartItems(cartItems, props.user.userData.cart))
                    .then(response => { calculateTotal(response.payload) })
            }
        }
    }, [props.user.userData, dispatch])


    let calculateTotal = (cartDetail) => {
        let total = 0;

        cartDetail.map(item => {
            total += parseInt(item.price, 10) * item.quantity
        })

        setTotal(total)
        setShowTotal(true)

    }


    let removeFromCart = (productId) => {

        dispatch(removeCartItem(productId))
            .then(response => {

                if (response.payload.productInfo.length <= 0) {
                    setShowTotal(false)
                }

            })

    }

    const transactionSuccess = (data) => { //자식컴포넌트인 Payment에서 data값을 받아옴
        //onSuccessBuy라는 action 발생시킴!
        dispatch(onSuccessBuy({
            paymentData: data, //결제 성공시 Payment에서 전달해준 정보를 백엔드로 전달해줌
            cartDetail: props.user.cartDetail //리덕스 스토어 안에 있는 CartDetail 정보 전달해줌
        }))
            .then(response => { //백엔드에서 처리 끝나면
                if (response.payload.success) {
                    setShowTotal(false)
                    setShowSuccess(true)
                }
            })
    }

    //라디오버튼 옵션 변경
    const handleOptionChange = (changeEvent) => {
        setPayMethod(changeEvent.target.value)
    }


    return (
        <div style={{ width: 'auto', height: '100vh', backgroundColor: "#1C1C1C", margin: 'auto', overflow: 'hidden'}}>
            <div className="my-cart" style={{width: '1092px', margin:'auto', marginBottom: '16px', paddingTop: '50px'}}>장바구니</div>
            <div className="cart-page" style={{width: '1092px', height: '411px', overflow: 'auto', margin: 'auto'}}>
                {ShowTotal ?
                    <UserCardBlock products={props.user.cartDetail} removeItem={removeFromCart} />
                  : ShowSuccess ?
                    // 결제 성공하면 화면에 메시지 보여줌
                    <Result
                        status="success"
                        title="Successfully Purchased Items"
                    />
                    :
                    // 카트에 상품이 없는 경우
                    <>
                        <br />
                        <Empty description={false} />
                    </>
                } 
            </div>

            {/* ShowTotal이 있을 때만 총 금액과 결제 버튼을 보여줌
                즉 카트에 상품이 없으면 총 금액과 결제 버튼도 안보임 */}
            {ShowTotal &&
            <div style={{width: '1092px', marginLeft:'218px', marginBottom: '16px'}}>
                <Col style={{width: '700px', float: 'left'}}>
                    <div className="total-price" style={{width: '378px', marginBottom: '16px'}}>
                        <h2 className="number-price">총 {props.user.userData.cart.length}개의 상품 {Total}원</h2>
                    </div>
                </Col>
                <Col>
                    <form className="pay-form" style={{float:'right'}}>
                        <div className="form-check">
                            <label>
                            <input
                                type="radio"
                                name="react-tips"
                                value="card"
                                checked={PayMethod === "card"}
                                onChange={handleOptionChange}
                                className="form-check-input"
                            />
                            카드 결제</label>
                            <label>
                            <input
                                type="radio"
                                name="react-tips"
                                value="trans"
                                checked={PayMethod === "trans"}
                                onChange={handleOptionChange}
                                className="form-check-input"
                            />
                            실시간 계좌이체</label>
                            <label>
                            <input
                                type="radio"
                                name="react-tips"
                                value="phone"
                                checked={PayMethod === "phone"}
                                onChange={handleOptionChange}
                                className="form-check-input"
                            />
                            휴대폰 결제</label>           
                        </div>

                        <div className="form-group">
                            <Payment
                                pg={PG}
                                payMethod={PayMethod}
                                total={Total}
                                userData={props.user.userData}
                                onSuccess={transactionSuccess}
                                history={props.history}
                            />
                        </div>
                    </form>
                </Col>
            </div>
            }
        </div>
      ) 
}

export default CartPage;
