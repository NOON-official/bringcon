const genres = [
  { _id: 1, name: "Animals" },
  { _id: 2, name: "Animations" },
  { _id: 3, name: "Arts" },
  { _id: 4, name: "Broadcasting" },
  { _id: 5, name: "Business" },
  { _id: 6, name: "Cartoon" },
  { _id: 7, name: "Character" },
  { _id: 8, name: "Land-marks" },
  { _id: 9, name: "Music" },
  { _id: 10, name: "Nature" },
  { _id: 11, name: "Sports" },
  { _id: 12, name: "Etc" }
];

const price = [
  {
    _id: 0,
    name: "전체",
    array: [],
  },
  {
    _id: 1,
    name: "1만원 미만",
    array: [0, 9900],
  },
  {
    _id: 2,
    name: "1-2만원대",
    array: [10000, 29900],
  },
  {
    _id: 3,
    name: "3~4만원대",
    array: [30000, 49900],
  },
  {
    _id: 4,
    name: "5만원 이상",
    array: [50000, 10000000000],
  },
];

export { genres, price };
