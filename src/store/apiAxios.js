import router from '../router';
import axios from "axios";

export const get = async (url, name, params) => {
  return axios
    .create({
      responseType: "json",
      baseURL: url
    })
    .get(name, {
      params
    })
    .then(response => {
      return [null, response.data];
    })
    .catch(err => {
      if (window.location.origin.indexOf("http://localhost") === -1) {
        if (err.response.status === 403) {
          if (router.currentRoute.path === "/analysis") {
            window.close();
          }
          window.location.href = window.location.origin;
        }
      } else {
        return [err]
      }
    });
};
export const post = async (url, name, params) => {
  return axios
    .create({
      responseType: "json",
      baseURL: url
    })
    .post(name, params)
    .then(response => {
      return [null, response.data];
    })
    .catch(err => {
      if (window.location.origin.indexOf("http://localhost") === -1) {
        if (err.response.status === 403) {
          window.location.href = window.location.origin;
        }
      } else {
        return [err]
      }
    });
};

