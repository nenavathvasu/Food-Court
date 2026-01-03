import axios from "axios";

const publicApi = axios.create({
  baseURL: "https://food-court-i2gj.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default publicApi;
