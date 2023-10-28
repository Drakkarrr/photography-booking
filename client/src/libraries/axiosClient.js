"use client";
import axios from "axios";
import jwtDecode from "jwt-decode";
// import { API_URL } from "../constants/URLS";
// API_URL = "http://localhost:9000";
const axiosClient = axios.create({
  baseURL: "http://localhost:9000",
  headers: {
    "Content-Type": "application/json", //chỉ định mặc định kiểu dữ liệu được gửi đi là json
    // "Content-Type": "multipart/form-data",
  },
});
// trong interceptors có 2 loại, một là request, 2 là response
//Request interceptors: Được sử dụng để can thiệp vào quá trình gửi yêu cầu. Bạn có thể đăng ký nhiều interceptor trước khi yêu cầu được gửi đi.
//Response interceptors: Được sử dụng để can thiệp vào quá trình nhận phản hồi từ máy chủ. Bạn có thể đăng ký nhiều interceptor sau khi nhận được phản hồi.

//có cái này ta không phải thêm passport.authenticate("jwt", { session: false }), ở các method này ở các router

//interceptors đây là middleware, tất cả các resonse đều qua interceptors

//qua page employee thì nó call api nên nó phải có interceptors.request, trước khi bên employee request thì nó chui vào hàm này
// REQUEST

// Request interceptor
axiosClient.interceptors.request.use(
  //lục token trong localstorage ra, kiểm tra
  //Nếu có, chúng ta thêm token vào header Authorization trong config. Sau đó, chúng ta trả về config. Nếu có lỗi,
  // chúng ta sẽ sử dụng Promise.reject(error) để trả về lỗi đó.

  (config) => {
    if (config.data instanceof FormData) {
      //chỉ định kiểu dữ liệu được gửi đi là FormData nếu nó có kieẻu FormData
      config.headers["Content-Type"] = "multipart/form-data";
    }
    console.log("run");
    // Kiểm tra nếu đang chạy trên phía client (trình duyệt)
    if (typeof window !== "undefined") {
      const token = window.localStorage.getItem("token");
      // console.log("zzzz: ", token);
      if (token) {
        // console.log("xyz");
        config.headers["Authorization"] = "Bearer " + token;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// RESPONSE

axiosClient.interceptors.response.use(
  async (response) => {
    // const { token, refreshToken } = response.data;
    // console.log("dataToken: ", response.data);
    // // LOGIN
    // // lưu token vào localStorage
    // if (token) {
    //   window.localStorage.setItem("token", token);
    // }
    // //lưu refreshToken vào localStorage
    // if (refreshToken) {
    //   window.localStorage.setItem("refreshToken", refreshToken);
    // }
    return response;
  },
  //trong trường hợp có lỗi
  async (error) => {
    console.log("lõi");
    // console.log(error?.response?.status);
    if (error?.response?.status !== 401) {
      return Promise.reject(error);
    }

    const originalConfig = error.config;
    // console.log(originalConfig);

    if (error?.response?.status === 401 && !originalConfig.sent) {
      console.log("Error 🚀", error);
      originalConfig.sent = true;
      try {
        // Trường hợp không có token thì chuyển sang trang LOGIN
        if (typeof window !== "undefined") {
          const token = window.localStorage.getItem("token");
          const refreshToken = window.localStorage.getItem("refreshToken");
          if (!token || !refreshToken) {
            window.location.href = "/login";
            return Promise.reject(error);
          }
          // Giải mã phần Payload của refreshToken để kiểm tra thời hạn hết hạn
          const refreshTokenPayload = jwtDecode(refreshToken);
          const refreshTokenExpiration = refreshTokenPayload.exp * 1000; // Thời gian hết hạn trong milliseconds
          if (Date.now() > refreshTokenExpiration) {
            console.log("Refresh token expired. Please log in again.");
            window.location.href = "/login";
            return Promise.reject(error);
          }

          if (refreshToken) {
            const response = await axiosClient.post("/customer/refresh-token", {
              refreshToken: refreshToken,
            });

            const { token } = response.data;
            window.localStorage.setItem("token", token);

            originalConfig.headers = {
              ...originalConfig.headers,
              authorization: `Bearer ${token}`,
            };

            return axiosClient(originalConfig);
          } else {
            console.log("het han!");
            // logout();
            window.location.href = "/login";
            return Promise.reject(error);
          }
        }
      } catch (err) {
        return Promise.reject(err);
      }
    }
  }
);

export { axiosClient };
