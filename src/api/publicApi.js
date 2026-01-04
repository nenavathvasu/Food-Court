import axios from "axios";

const publicApi = axios.create({
  baseURL: "https://backend-express-nu.vercel.app/",
  headers: {
    "Content-Type": "application/json",
  },
});

export default publicApi;
