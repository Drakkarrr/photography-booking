/////////////////////////////////////////////////////////////////

import { create } from "zustand";
import axios from "axios";
import { devtools } from "zustand/middleware";
import { persist, createJSONStorage } from "zustand/middleware";
import { useNavigate } from "react-router-dom";
const URL_ENV = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:9000";
interface isLogin {
  email: string;
  password: string;
}

export const UseAuth = create(
  devtools(
    persist(
      (set: any, get: any) => {
        return {
          auth: null,
          Login: async ({ email, password }: isLogin) => {
            console.log(email, password);
            try {
              console.log("here!", email, password);
              const loginEmployee = await axios.post(
                `${URL_ENV}/employee/login`,
                {
                  EmployeeEmail: email,
                  password: password,
                }
              );
              if (!loginEmployee) {
                console.log("failure");
              }
              console.log("tk: ", loginEmployee.data);
              const employeeUser = await axios.patch(
                `${URL_ENV}/employee/loginToken/${loginEmployee.data.resultId}`,
                {
                  refreshToken: loginEmployee.data.refreshToken,
                }
              );
              window.localStorage.setItem(
                "Account",
                loginEmployee.data.resultId
              );
              window.localStorage.setItem("token", loginEmployee.data.token);
              window.localStorage.setItem(
                "refreshToken",
                loginEmployee.data.refreshToken
              );
              set({ auth: loginEmployee.data }, false, {
                type: "auth/login-success",
              });

              if (loginEmployee.data.payload._id) {
              }
            } catch (err) {
              console.log("looix");
              alert("Incorrect password");
            }
          },
          logout: async () => {
            const auth: any = get().auth;
            localStorage.clear();
            await axios.patch(
              `${URL_ENV}/employee/loginToken/${auth.payload._id}`,
              {
                refreshToken: "",
              }
            );
            return set({ auth: null }, false, { type: "auth/logout-success" });
          },
        };
      },
      {
        name: "shopWeb-storage",
        storage: createJSONStorage(() => localStorage),
      }
    )
  )
);
