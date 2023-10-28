import { useState, useEffect } from "react";
import axios from "axios";
import { UseAuth } from "../managerState/useAuth";

import { BrowserRouter, Link, Routes, Route } from "react-router-dom";
import { Layout, theme } from "antd";

// import App from "../App";
import Login from "../components/login/index";
import PhotoPackage from "../components/photoPackage/index";
import Emolyee from "../components/employees/index";
import Order from "../components/order/index";
import MenuBar from "../components/menu/index";

const { Header, Content, Footer, Sider } = Layout;

function Router() {
  const { auth } = UseAuth((state: any) => state);

  const [collapsed, setCollapsed] = useState(false);
  console.log("auth: ", auth);
  console.log("authId: ", auth?.resultId);

  const account = localStorage.getItem("Account");
  console.log("account:", account);

  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <>
      <div>
        <BrowserRouter>
          {!account && (
            <Content>
              <Routes>
                <Route path="/" element={<Login />}></Route>
                {/* <Route path="*" element={<NotFoundPage />} /> */}
              </Routes>
            </Content>
          )}

          {/* ////////////////////////// */}
          {account && (
            <Layout style={{ minHeight: "100vh" }}>
              <Sider
                collapsible
                collapsed={collapsed}
                onCollapse={(value) => setCollapsed(value)}
              >
                <div className="demo-logo-vertical" />

                <MenuBar />
              </Sider>
              <Layout>
                <Header
                  style={{ color: "white", fontSize: "25px" }}
                  className="flex justify-between "
                >
                  <h1>MANAGEMENT</h1>
                  {account ? (
                    <>
                      <div className="flex ">
                        <span>
                          <h1>{auth?.payload?.firstName}</h1>
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <h1>Login</h1>
                    </>
                  )}
                </Header>
                <Header style={{ padding: 0, background: colorBgContainer }} />
                <Content style={{ margin: "0 16px" }}>
                  <Routes>
                    <Route path="/employee" element={<Emolyee />}></Route>
                    <Route path="/package" element={<PhotoPackage />}></Route>
                    <Route path="/order" element={<Order />}></Route>
                  </Routes>
                </Content>
                <Footer
                  style={{ textAlign: "center", background: "#001529" }}
                ></Footer>
              </Layout>
            </Layout>
          )}
        </BrowserRouter>
      </div>
    </>
    // <BrowserRouter>
    //   <Routes>
    //     <Route path="/" element={<MainPage />}></Route>
    //     <Route path="/login" element={<Login />}></Route>
    //     <Route path="/app" element={<App />}></Route>
    //   </Routes>

    // </BrowserRouter>
  );
}

export default Router;
