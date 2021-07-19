import React, { useState } from 'react'
import Dropzone from 'react-dropzone'
import { Typography, Button, Form, Input, Icon } from 'antd';
import Axios from 'axios';
import { useSelector } from 'react-redux';
import HashTag from '../../utils/Hashtag';

const { TextArea } = Input;
// const { Title } = Typography;

const Genres = [
    { key: 1, value: "영화 & 애니메이션" },
    { key: 2, value: "예능 프로그램" },
    { key: 3, value: "스포츠" },
    { key: 4, value: "동물" },
    { key: 5, value: "어린이" },
    { key: 6, value: "뉴스" },
    { key: 7, value: "드라마" }
]

function UploadProductPage(props) {
    const user = useSelector(state => state.user);
    const [Title, setTitle] = useState("")
    const [Description, setDescription] = useState("")
    const [Price, setPrice] = useState(0)
    const [Genre, setGenre] = useState(1)
    const [Images, setImages] = useState([])
    const [FilePath, setFilePath] = useState("")
    const [Duration, setDuration] = useState("")
    const [ThumbnailPath, setThumbnailPath] = useState("")


    const titleChangeHandler = (event) => {
        setTitle(event.currentTarget.value)
    }

    const descriptionChangeHandler = (event) => {
        setDescription(event.currentTarget.value)
    }

    const priceChangeHandler = (event) => {
        setPrice(event.currentTarget.value)
    }

    const genreChangeHandler = (event) => {
        setGenre(event.currentTarget.value)
    }

    const updateImages = (newImages) => {
        setImages(newImages)
    }

    const dropHandler = (files) => {

        let formData = new FormData();
        const config = {
            header: { 'content-type': 'multipart/form-data' }
        }
        formData.append("file", files[0])

        Axios.post('/api/product/image', formData, config)
            .then(response => {
                if (response.data.success) {

                    let variable = {
                        filePath: response.data.filePath,
                        fileName: response.data.fileName
                    }

                    setFilePath(response.data.filePath)

                    Axios.post('/api/product/thumbnail', variable)
                    .then(response => {
                        if(response.data.success) {
                            setDuration(response.data.fileDuration)
                            setThumbnailPath(response.data.filePath)
                            setImages([...Images, response.data.filePath])
                        } else {
                            alert('썸네일 생성에 실패했습니다.')
                        }
                    })

                } else {
                    alert('파일을 저장하는데 실패했습니다.')
                }
            })
    }

    const submitHandler = (event) => {
        event.preventDefault();

        if (!Title || !Description || !Price || !Genre || Images.length === 0) {
            return alert(" 모든 값을 넣어주셔야 합니다.")
        }


        //서버에 채운 값들을 request로 보낸다.

        const body = {
            //로그인 된 사람의 ID 
            writer: user.userData._id,
            title: Title,
            description: Description,
            price: Price,
            images: Images,
            genres: Genre,
            filePath: FilePath,
            duration: Duration,
            thumbnail: ThumbnailPath
        }

        Axios.post('/api/product', body)
            .then(response => {
                if (response.data.success) {
                    alert('상품 업로드에 성공 했습니다.')
                    props.history.push('/')
                } else {
                    alert('상품 업로드에 실패 했습니다.')
                }
            })
    }

    const deleteHandler = (image) => {
        const currentIndex = Images.indexOf(image);
        let newImages = [...Images]
        newImages.splice(currentIndex, 1)
        setImages(newImages)
    }


    return (
        <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h2> 동영상 업로드</h2>
            </div>

            <Form onSubmit={submitHandler}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    {/* DropZone */}
                    <Dropzone
                        onDrop={dropHandler} 
                        multiple={false}
                        maxSize={100000000}
                        refreshFunction={updateImages}
                    >
                    {({ getRootProps, getInputProps }) => (
                        <div
                            style={{
                                width: 300, height: 240, border: '1px solid lightgray',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}
                            {...getRootProps()}>
                            <input {...getInputProps()} />
                            <Icon type="plus" style={{ fontSize: '3rem' }} />
                        </div>
                    )}
                    </Dropzone>

                    <div style={{ display: 'flex', width: '350px', height: '240px', overflowX: 'scroll' }}>
                        {Images.map((image, index) => (
                            <div onClick={() => deleteHandler(image)} key={index}>
                                <img style={{ minWidth: '300px', width: '300px', height: '240px' }}
                                    src={`http://localhost:5000/${image}`}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <br />
                <br />
                <label>이름</label>
                <Input onChange={titleChangeHandler} value={Title} />
                <br />
                <br />
                <label>설명</label>
                <TextArea onChange={descriptionChangeHandler} value={Description} />
                <br />
                <br />
                <label>가격(원)</label>
                <Input type="number" onChange={priceChangeHandler} value={Price} />
                <br />
                <br />
                <select onChange={genreChangeHandler} value={Genre}>
                    {Genres.map(item => (
                        <option key={item.key} value={item.key}> {item.value}</option>
                    ))}
                </select>
                <br />
                <br />
                <HashTag></HashTag>
                <button type="submit">
                    확인
                </button>
            </Form>
        </div>
    )
}

export default UploadProductPage
