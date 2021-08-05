import React from 'react'
import axios from "axios";
import VerticalMenu from '../VerticalMenu/VerticalMenu';

function HistoryPage(props) {
    const handleClick = (item) => {
        const data = {product_id: item}
        //다운로드 할 product id를 백엔드로 보내줌
        axios.post('/api/product/download', data)
        .then(response => {
            if (response.data.success) {
                window.location.href = response.data.url;
                alert("파일이 다운로드되었습니다.")
            } else {
                alert("다운로드에 실패하였습니다.")
            }
        })
    }

    return (
        <div style={{ width: '80%', margin: '3rem auto' }}>
            <VerticalMenu/>
            <div style={{ textAlign: 'center' }}>
                <h1>History</h1>
            </div>
            <br />

            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Payment Id</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Date of Purchase</th>
                        <th>Download</th>
                    </tr>
                </thead>

                <tbody>

                    {/* userData와 history가 있으면 */}
                    {props.user.userData && props.user.userData.history &&
                        props.user.userData.history.map((item, index) => (
                            <tr key={index}>
                                <td>{item.name}</td>
                                <td>{item.merchantUid}</td>
                                <td>{item.price}</td>
                                <td>{item.quantity}</td>
                                <td>{item.dateOfPurchase}</td>
                                <td><button onClick={e => { e.preventDefault(); handleClick(item.id)} }>click here :)</button></td>
                            </tr>
                        ))}


                </tbody>
            </table>
        </div>
    )
}

export default HistoryPage

