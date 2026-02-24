import axios from "axios";

const publicApi = axios.create({
  baseURL: "https://backend-express-nu.vercel.app/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

export default publicApi;
