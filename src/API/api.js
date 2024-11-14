import axios from "axios";

export const API = axios.create({
  baseURL: "https://donggukseoul.com",

  headers: {
    "Content-Type": "application/json"
  },
  withCredentials: true
});

export default API;