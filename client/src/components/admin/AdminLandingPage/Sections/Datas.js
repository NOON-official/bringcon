const genres = [
    { key: 1, value: "Animals" },
    { key: 2, value: "Animations" },
    { key: 3, value: "Arts" },
    { key: 4, value: "Broadcasting" },
    { key: 5, value: "Business" },
    { key: 6, value: "Cartoon" },
    { key: 7, value: "Character" },
    { key: 8, value: "Land-marks" },
    { key: 9, value: "Music" },
    { key: 10, value: "Nature" },
    { key: 11, value: "Sports" },
    { key: 12, value: "Etc.." }
  ];

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
