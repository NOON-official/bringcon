import React, {Component} from 'react';
import Slider from 'react-slick';
import styled from 'styled-components';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Container = styled.div`
  overflow:hidden;
  margin-bottom: 50px;
`;

const StyledSlider = styled(Slider) `
    .slick-slide div {
        outline: none;
    }
`;

const ImageContainer = styled.div `
    margin: 0 16px;
`;

const Image = styled.img `
    max-width: 100%;
    max-height: 100%;
`;

const imgUrl = require('./image2.jpg');

const items = [
    {id: 1, url: imgUrl},
    {id: 2, url: imgUrl},
    {id: 3, url: imgUrl},
    {id: 4, url: imgUrl},
    {id: 5, url: imgUrl}
];

class MainSlider extends Component {
    render() {
        const settings = {
            dots: true,
            infinite: true,
            speed: 500,
            slideToShow: 1,
            slideToScroll: 1,
            arrows: true,
            centerMode: true,
        };
        return (
            <Container>
                <StyledSlider {...settings}>
                    {items.map(item => {
                        return  (
                            <div key={item.id}>
                                <ImageContainer>
                                    <Image src={item.url}/>
                                </ImageContainer>
                            </div>
                        );
                    })}
                </StyledSlider>
            </Container>
        );
    }
}

export default MainSlider;
