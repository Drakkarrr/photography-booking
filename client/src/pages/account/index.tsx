import { useState, useEffect } from "react";
import {
  Collapse,
  Divider,
  Button,
  DatePicker,
  Form,
  Input,
  Upload,
  Spin,
  message,
} from "antd";
import axios from "axios";
import { axiosClient } from "../../libraries/axiosClient";
import { PlusOutlined } from "@ant-design/icons";
type Props = { data: any };
import { userAuth } from "@/managerState/userAuth";

import React from "react";
import { Space, Table, Tag } from "antd";

const { Column, ColumnGroup } = Table;

export default function index({ data }: Props) {
  // console.log("data: ", data);
  var { auth } = userAuth((state: any) => state);

  const [Form1] = Form.useForm();
  const [Form2] = Form.useForm();
  const [file, setFile] = useState<any>(null);
  const [reload, setReload] = useState<number>(0);
  const [WindowWidth, setWindowWidth] = useState<number>(0);
  const [dataUser, setDataUser] = useState({
    firstName: "",
    lastName: "",
    password: "",
    email: "",
    phoneNumber: "",
    address: "",
    imageUrl: "",
  });

  const [orderIn4, setOrderIn4] = useState<Array<any>>([
    {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      address: "",
      package: "",
      timeForPackage: "",
      price: 0,
      discount: 0,
      provinceBooking: "",
      districtBooking: "",
      roadBooking: "",
      sellPrice: 0,
    },
  ]);
  // console.log("auth123: ", auth);

  const initialValues = {
    firstName: dataUser.firstName,
    lastName: dataUser.lastName,
    email: dataUser.email,
    address: dataUser.address,
    phoneNumber: dataUser.phoneNumber,
    file: dataUser.imageUrl,
  };

  const columns = [
    {
      title: "Phone number",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Place booking",
      dataIndex: "bookingPlace",
      key: "bookingPlace",
    },
    {
      title: "Package",
      dataIndex: "package",
      key: "package",
    },
    {
      title: "Discount",
      dataIndex: "discount",
      key: "discount",
    },
    {
      title: "Total Price",
      dataIndex: "primePrice",
      key: "primePrice",
      render: (text: string, record: any) => {
        return parseFloat(text).toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        });
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Create day",
      dataIndex: "createOrderDate",
      key: "createOrderDate",
    },
    {
      title: "Action",
      dataIndex: "createOrderDate",
      key: "createOrderDate",
      render: (text: string, record: any) => (
        <a
          onClick={() => {
            handleDeleteOrder(record);
          }}
        >
          Delete
        </a>
      ),
    },
  ];

  const columns_mobile = [
    {
      title: "Place booking",
      dataIndex: "bookingPlace",
      key: "bookingPlace",
    },
    {
      title: "Package",
      dataIndex: "package",
      key: "package",
    },

    {
      title: "Total Price",
      dataIndex: "primePrice",
      key: "primePrice",
      render: (text: string, record: any) => {
        return parseFloat(text).toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        });
      },
    },
  ];

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    window.removeEventListener("resize", handleResize);
    return () => {};
  }, []);

  useEffect(() => {
    const getdata = async () => {
      console.log("call  getdata");
      await axiosClient
        .get(`http://localhost:9000/customer/${auth?.resultId}`)
        .then((response) => {
          // console.log("hkh:", response.data.result);
          setDataUser(response.data.result);
        });
    };
    const getdataOrder = async () => {
      console.log("call  getdataOrder");

      await axiosClient
        .get(`http://localhost:9000/order/OrderDetail/${auth.resultId}`)
        .then((response) => {
          // console.log("hkh:", response.data);
          setOrderIn4(response.data.results);
          // console.log("hkh2:", response.data.results);
        });
    };
    getdata();
    getdataOrder();
  }, [reload]);

  // console.log("stateuser: ", dataUser);

  const handleCreate = (value: any) => {
    console.log("value: ", value);
    const updateInfor = async (e: any) => {
      await axiosClient
        .patch(`http://localhost:9000/customer/${auth.resultId}`, e)
        .then(async (response) => {
          // console.log(response);
          // console.log("file: ", file);
          // console.log("auth.resultId: ", auth.resultId);
          ///////////////////////////////////update img file
          const formData = new FormData();
          formData.append("file", file);
          console.log(formData);
          if (file && file.uid && file.type)
            await axiosClient.post(
              `http://localhost:9000/upload/customers/${auth.resultId}/image`,
              formData
            );
        });
    };
    updateInfor(value);
  };

  const handleChangePassword = async (value: any) => {
    console.log(value);
    if (value.password === value.password2) {
      console.log("oke!!");
      const datachange = await axiosClient.patch(
        `http://localhost:9000/customer/${auth.resultId}`,
        value
      );
      if (datachange) {
        message.success("Thay đổi mật khẩu thành công!!");
        Form2.resetFields();
      }
    }
  };
  const handleDeleteOrder = async (value: any) => {
    setReload((prev) => prev + 1);
    await axiosClient
      .delete(`http://localhost:9000/order/${value._id}`)
      .then((result) => {
        message.success("Xóa đơn hẹn thành công!!");
      });
  };
  console.log("state", orderIn4);
  // console.log("state2", dataUser);
  return (
    <>
      <div style={{ padding: "100px 50px", background: "#3E3E3F" }}>
        <h1
          style={{
            color: "Black",
            display: "flex",
            justifyContent: "center",
          }}
        >
          Thông tin cá nhân
        </h1>
        <br />
        <div style={{ color: "Black" }}>
          <img
            src={`http://localhost:9000/${dataUser.imageUrl}`}
            alt=""
            style={{ height: "180px", width: "150px" }}
          />

          <br />
          <h2>{`${dataUser.firstName} ${dataUser.lastName}`}</h2>
        </div>
        <div>
          <Divider orientation="left">Đơn đặt lịch</Divider>
          {/* <Spin size="large" spinning={loading}> */}
          <Collapse
            size="large"
            items={[
              {
                key: "1",
                label: "Lịch hẹn chụp",
                children: (
                  <div>
                    {WindowWidth > 650 ? (
                      <Table columns={columns} dataSource={orderIn4}></Table>
                    ) : (
                      <Table
                        columns={columns_mobile}
                        dataSource={orderIn4}
                      ></Table>
                    )}
                  </div>
                ),
              },
            ]}
          />
          <Divider orientation="left">Quản lý thông tin cá nhân</Divider>
          <Collapse
            size="large"
            items={[
              {
                key: "1",
                label: "Sửa đổi thông tin cá nhân",
                children: (
                  <Form
                    form={Form1}
                    name="Form1"
                    onFinish={handleCreate}
                    onFinishFailed={(res) => {
                      console.log("««««« res »»»»»", res);
                    }}
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 14 }}
                    layout="horizontal"
                    initialValues={initialValues}
                  >
                    <div className="row ">
                      <Form.Item
                        label="Họ"
                        name="firstName"
                        hasFeedback
                        rules={[{ message: "Enter first name" }]}
                        style={{
                          width: "calc(100% - 0px)",
                        }}
                      >
                        <Input placeholder={dataUser.firstName} />
                      </Form.Item>
                      <Form.Item
                        label="Tên"
                        name="lastName"
                        hasFeedback
                        rules={[{ message: "Enter last name" }]}
                      >
                        <Input placeholder={dataUser.lastName} />
                      </Form.Item>

                      <Form.Item
                        hasFeedback
                        label="Email"
                        name="email"
                        rules={[
                          {
                            message: "Please enter your email",
                          },
                        ]}
                      >
                        <Input placeholder={dataUser.email} />
                      </Form.Item>
                      <Form.Item
                        hasFeedback
                        label="Địa chỉ"
                        name="address"
                        rules={[
                          {
                            message: "Please enter your Address",
                          },
                        ]}
                      >
                        <Input placeholder={dataUser.address} />
                      </Form.Item>

                      <Form.Item
                        hasFeedback
                        label="Số điện thoại"
                        name="phoneNumber"
                        rules={[
                          {
                            message: "Please enter Phone number",
                          },
                        ]}
                      >
                        <Input placeholder={dataUser.phoneNumber} />
                      </Form.Item>

                      <Form.Item label="Ảnh" name="file">
                        <Upload
                          maxCount={1}
                          listType="picture-card"
                          showUploadList={true}
                          beforeUpload={(file) => {
                            setFile(file);
                            return false;
                          }}
                          onRemove={() => {
                            setFile("");
                          }}
                        >
                          {!file ? (
                            <div>
                              <PlusOutlined />
                              <div style={{ marginTop: 8 }}>Upload</div>
                            </div>
                          ) : (
                            ""
                          )}
                        </Upload>
                      </Form.Item>
                    </div>

                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        className="login-form-button"
                      >
                        Thay đổi
                      </Button>
                    </Form.Item>
                  </Form>
                ),
              },
            ]}
          />
          <Divider orientation="left">Thay đổi mật khẩu</Divider>
          <Collapse
            size="large"
            items={[
              {
                key: "1",
                label: "Thay đổi mật khẩu",
                children: (
                  <Form
                    // className={`container ${style.form}`}
                    form={Form2}
                    name="Form2"
                    onFinish={handleChangePassword}
                    onFinishFailed={(res) => {
                      console.log("««««« res »»»»»", res);
                    }}
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 14 }}
                    layout="horizontal"
                  >
                    <div className="row ">
                      <Form.Item
                        hasFeedback
                        label="Mật khẩu"
                        name="password"
                        rules={[
                          {
                            required: true,
                            message: "Enter password",
                          },
                        ]}
                      >
                        <Input.Password />
                      </Form.Item>
                      <Form.Item
                        hasFeedback
                        label="Xác nhận mật khẩu"
                        name="password2"
                        rules={[
                          {
                            required: true,

                            message: "Enter password",
                          },
                        ]}
                      >
                        <Input.Password />
                      </Form.Item>
                    </div>

                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        className="login-form-button"
                      >
                        Thay đổi
                      </Button>
                    </Form.Item>
                  </Form>
                ),
              },
            ]}
          />
          {/* </Spin> */}
        </div>
      </div>
    </>
  );
}

// export async function getStaticProps() {
//   const { auth } = userAuth((state: any) => state);
//   const data = await axiosClient
//     .get(`http://localhost:9000/customer/${auth.resultId}`)
//     .then((response) => {
//       return response.data;
//     });

//   return {
//     props: {
//       data: data,
//     },
//   };
// }
