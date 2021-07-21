import React from 'react';
import './Footer.css';

function Footer() {
    return (
        <div className="main-footer">
            <div className="container">
                <div className="row">
                    <div className="col">
                        <h4>Bringcon</h4>
                        <ul className="list-unstyled">
                            <li>브링콘</li>
                            <li>대표   남한솔</li>
                            <li>사업자등록번호   811-29-00871</li>
                            <li>주소   서울시 성북구 장월로 1마길 56 DAC 스타트업 인큐베이팅센터</li>
                            <li>이메일   contact@no-on.info</li>
                            <li>고객센터   ###-####-####</li>
                        </ul>
                    </div>
                </div>
                <hr/>
                <div className="row">
                        <p className="col-sm">
                            &copy; 2021 Bringcon | All rights reserved | Terms Of Service | Privacy
                        </p>
                    </div>
            </div>
        </div>
    );
}

export default Footer
