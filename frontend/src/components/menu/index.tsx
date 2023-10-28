import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Breadcrumb, Layout, Menu, theme, Space, Table, Tag } from "antd";
import { UseAuth } from "../../managerState/useAuth";
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
const MenuB = () => {
  const { logout } = UseAuth((state: any) => state);
  const navigate = useNavigate();
  return (
    <>
      <div>
        <Menu
          theme="dark"
          defaultSelectedKeys={["1"]}
          mode="inline"
          // items={items}
          className="pt-14"
        >
          <Menu.Item
            key="1"
            icon={<DesktopOutlined />}
            onClick={() => navigate("/package")}
          >
            Photography Package
          </Menu.Item>
          <Menu.Item
            key="2"
            icon={<PieChartOutlined />}
            onClick={() => navigate("/employee")}
          >
            Employee
          </Menu.Item>
          <Menu.Item
            key="3"
            icon={<FileOutlined />}
            onClick={() => navigate("/order")}
          >
            Order
          </Menu.Item>
          <Menu.Item
            key="4"
            icon={<FileOutlined />}
            onClick={() => {
              navigate("/");
              logout();
            }}
          >
            Logout
          </Menu.Item>
        </Menu>
      </div>
    </>
  );
};
export default MenuB;
