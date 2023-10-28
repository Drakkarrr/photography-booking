import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import style from "./index.module.css";
import { Col, Row, Card, message } from "antd";
import "bootstrap/dist/css/bootstrap.min.css"; // Import bootstrap CSS
import { userAuth } from "../../../src/managerState/userAuth";
import { Button, DatePicker, Form, Input, Upload } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import router from "next/router";
const URL_ENV = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:9000";

type customertype = {
  firstname: string;
  lastname: string;
  phonenumber: string;
  address: string;
  email: string;
  birthday: string;
  imageUrl: string;
  password: string;
};

function Register({}: customertype) {
  const [file, setFile] = useState<any>(null);
  const API_URL = `${URL_ENV}/customer`;
  const [registerForm] = Form.useForm();

  const { login } = userAuth((state: any) => state);
  const { auth } = userAuth((state: any) => state);

  const handleCreate = async (value: any) => {
    // console.log("dang ky: ", value);
    const { email, password } = value;
    console.log(`${API_URL}`);
    await axios
      .post(`${API_URL}`, value)
      .then(async (response) => {
        const { _id } = response.data.result;
        const formData = new FormData();
        formData.append("file", file);
        if (file && file.uid && file.type)
          await axios
            .post(`${URL_ENV}/upload/customers/${_id}/image`, formData)
            .then((response) => {
              console.log(`${URL_ENV}/upload/customers/${_id}/image`);
            });

        //
        console.log(response);
        message.success("Đăng ký thành công !!", 1.5);
        login({ email, password });
      })
      .catch(() => {
        message.error("Email đã tồn tại!!");
        router.push("/register");
      });
  };

  return (
    <>
      <div className={style.container}>
        <Row>
          <Col span={14} push={10}>
            <div className={`${style.myInlineStyle}`}>
              <Card
                title="Sign Up"
                bordered={true}
                style={{ width: "100%", margin: "5% 0%" }}
              >
                <Form
                  className={`container ${style.form}`}
                  form={registerForm}
                  name="registerForm"
                  onFinish={handleCreate}
                  onFinishFailed={(res) => {
                    console.log("««««« res »»»»»", res);
                  }}
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 14 }}
                  layout="horizontal"
                >
                  <div className="row ">
                    <Form.Item
                      label="Họ"
                      name="firstName"
                      hasFeedback
                      rules={[{ required: true, message: "Enter first name" }]}
                      style={{
                        width: "calc(100% - 0px)",
                      }}
                    >
                      <Input placeholder="First name" />
                    </Form.Item>
                    <Form.Item
                      label="Tên"
                      name="lastName"
                      hasFeedback
                      rules={[{ required: true, message: "Enter last name" }]}
                    >
                      <Input placeholder="Last name" />
                    </Form.Item>

                    <Form.Item
                      hasFeedback
                      label="Email"
                      name="email"
                      rules={[
                        { required: true, message: "Please enter your email" },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      hasFeedback
                      label="Địa chỉ"
                      name="address"
                      rules={[
                        {
                          required: true,
                          message: "Please enter your Address",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
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
                      label="Số điện thoại"
                      name="phoneNumber"
                      rules={[
                        {
                          required: true,
                          message: "Please enter Phone number",
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>

                    {/* <Form.Item
                      hasFeedback
                      label="Ngày sinh"
                      name="birthday"
                      rules={[
                        { required: true, message: "Please enter Birthday" },
                      ]}
                    >
                      <DatePicker placement="bottomLeft" format="DD/MM/YYYY" />
                    </Form.Item> */}
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
                      Đăng ký
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
            </div>
          </Col>
          <Col span={10} pull={14} className={` ${style.column} `}>
            <div className={style.brand}>
              <div className={style.title}>JewelShop</div>
              <div className={style.slogan}>Nâng Tầm thời trang của bạn</div>
            </div>
          </Col>
        </Row>
      </div>
      {/* //responsive */}
      {/* <div className={style.container2}>
        <div className={`${style.myInlineStyle}`}>
          <Card
            title="Sign Up"
            bordered={true}
            style={{ width: "100%", margin: "5% 2%" }}
          >
            <Form
              initialValues={{ remember: true }}
              className={`container ${style.form}`}
              form={registerForm}
              name="registerForm"
              onFinish={handleCreate}
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 12 }}
              layout="horizontal"
              style={{ width: " 100%" }}
            >
              <div className={`row ${style.table}`}>
                <Form.Item
                  label="Họ"
                  name="firstName"
                  hasFeedback
                  rules={[{ required: true, message: "Enter first name" }]}
                  style={{
                    width: "calc(100% - 0px)",
                  }}
                >
                  <Input placeholder="First name" />
                </Form.Item>
                <Form.Item
                  label="Tên"
                  name="lastName"
                  hasFeedback
                  rules={[{ required: true, message: "Enter last name" }]}
                >
                  <Input placeholder="Last name" />
                </Form.Item>

                <Form.Item
                  hasFeedback
                  label="Email"
                  name="email"
                  rules={[
                    { required: true, message: "Please enter your email" },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  hasFeedback
                  label="Địa chỉ"
                  name="address"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your Address",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
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
                  label="Số điện thoại"
                  name="phoneNumber"
                  rules={[
                    {
                      required: true,
                      message: "Please enter Phone number",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  hasFeedback
                  label="Ngày sinh"
                  name="birthday"
                  rules={[{ required: true, message: "Please enter Birthday" }]}
                >
                  <DatePicker placement="bottomLeft" format="DD/MM/YYYY" />
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
                  Đăng ký
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </div>
      </div> */}
    </>
  );
}

export default Register;
