const genres = [
    {
        "_id": 1,
        "name": "영화 & 애니메이션"
    },
    {
        "_id": 2,
        "name": "예능 프로그램"
    },
    {
        "_id": 3,
        "name": "스포츠"
    },
    {
        "_id": 4,
        "name": "동물"
    },
    {
        "_id": 5,
        "name": "어린이"
    },
    {
        "_id": 6,
        "name": "뉴스"
    },
    {
        "_id": 7,
        "name": "드라마"
    }

]

const price = [
    {
        "_id": 0,
        "name": "전체",
        "array": []
    },
    {
        "_id": 1,
        "name": "1만원 미만",
        "array": [0, 9900]
    },
    {
        "_id": 2,
        "name": "1-2만원대",
        "array": [10000, 29900]
    },
    {
        "_id": 3,
        "name": "3~4만원대",
        "array": [30000, 49900]
    },
    {
        "_id": 4,
        "name": "5만원 이상",
        "array": [50000, 10000000000]
    }
]




export {
    genres,
    price
}
