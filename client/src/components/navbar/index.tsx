import axios from "axios";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Style from "./navbarStyle.module.css";
import { Button, message } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import { userAuth } from "@/managerState/userAuth";
const URL_ENV = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:9000";
type Props = {};

function Page({}: Props) {
  const router = useRouter();
  const [turnOn, setTurnOn] = useState<boolean>(false);
  const [responsive, setResponsive] = useState<boolean>(false);
  const [user, setUser] = useState<any>();
  const { auth } = userAuth((state: any) => state);
  const { logout } = userAuth((state: any) => state);
  const E_URL = `http://localhost:9000/customer/${auth?.payload?._id}`;
  // console.log("auth: ", auth);
  useEffect(() => {
    if (auth?.payload?._id)
      axios.get(`${E_URL}`).then((res: any) => {
        // console.log(res);
        setUser(res?.data?.result?._id);
      });
    else {
      setUser(null);
    }
  }, [E_URL]);
  // console.log("user: ", user);
  const clickMenu = () => {
    // console.log(turnOn, responsive);
    if (turnOn) {
      setTurnOn(false);
    } else {
      setTurnOn(true);
    }
  };

  const handleNavigation = (path: any) => {
    router.push(path);
  };
  if (typeof window !== "undefined") {
    const token = window.localStorage.getItem("token");
    // console.log("token: ", token);
  }
  return (
    <>
      <div className={Style.nav}>
        <div className={Style.title}>Tiệm Ảnh</div>
        <Button
          className={Style.icon__menu}
          icon={<MenuOutlined />}
          onClick={clickMenu}
        ></Button>
        <ul className={turnOn ? Style.navbar_mobile : Style.navbar}>
          <li
            onClick={() => {
              handleNavigation("/");
            }}
          >
            Home
          </li>

          <li
            onClick={() => {
              if (auth) handleNavigation("/booking");
              else {
                message.warning("Vui lòng đăng nhập !!", 2.5);
                handleNavigation("/login");
              }
            }}
          >
            Liên hệ - Đặt lịch
          </li>
          <li>
            Các dịch vụ
            <ul className={Style.submenu1}>
              <li
                onClick={() => {
                  handleNavigation("/photoPackage/6481fd73d5638359880f4f58");
                }}
              >
                đơn/đôi
              </li>
              <li
                onClick={() => {
                  handleNavigation("/photoPackage/6485bfb05570ad344f1a9080");
                }}
              >
                Tiệc cưới
              </li>
              <li
                onClick={() => {
                  handleNavigation("/photoPackage/6485bff25570ad344f1a9082");
                }}
              >
                Sự kiện - hội nghị
              </li>
              <li
                onClick={() => {
                  handleNavigation("/photoPackage/6485c0365570ad344f1a9084");
                }}
              >
                Kỷ yếu tập thể
              </li>
              <li
                onClick={() => {
                  handleNavigation("/photoPackage/6485c07d5570ad344f1a9086");
                }}
              >
                Quảng cáo
              </li>
              <li
                onClick={() => {
                  handleNavigation("/photoPackage/6485c0fc5570ad344f1a9088");
                }}
              >
                Tour du lịch
              </li>
            </ul>
          </li>
          {user && (
            <>
              <li
                onClick={() => {
                  handleNavigation("/account");
                }}
              >
                Cá nhân
              </li>
              <li
                onClick={() => {
                  logout();
                  setUser(null);
                  handleNavigation("/login");
                }}
              >
                Đăng xuất
              </li>
            </>
          )}
          {user === null && (
            <>
              <li
                onClick={() => {
                  handleNavigation("/login");
                }}
              >
                Đăng nhập
              </li>
            </>
          )}
        </ul>
      </div>
    </>
  );
}

export default Page;
