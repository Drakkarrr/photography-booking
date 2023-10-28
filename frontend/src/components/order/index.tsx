import React, { useEffect, useState } from "react";
import axios from "axios";
import { Space, Table, Button, Modal } from "antd";
import type { ColumnsType } from "antd/es/table";

const URL_ENV = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:9000";
type Props = {};

interface listTableType {
  bookingPlace: string;
  createOrderDate: string;
  customerLastName: string;
  customerFirstName: string;
  package: string;
  status: string;
  _id: string;
  dateBooking: string[];
}

function Index({}: Props) {
  /////////////////////////////

  const columns: ColumnsType<listTableType> = [
    {
      title: "Customer name",
      dataIndex: "customerLastName",
      key: "customerLastName",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Photo Package",
      dataIndex: "package",
      key: "package",
    },
    {
      title: "Order day",
      dataIndex: "createOrderDate",
      key: "createOrderDate",
    },
    {
      title: "Status",
      key: "status",
      dataIndex: "status",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            onClick={() => {
              console.log(record);
              setPopupOreder(record);
              showModal();
            }}
          >
            Chi tiết
          </Button>
        </Space>
      ),
    },
  ];

  /////////////////////0
  const [listOrder, setListOrder] = useState<Array<listTableType>>([]);
  const [popupOreder, setPopupOreder] = useState<listTableType>();
  const [openPopup, setOpenpopup] = useState<boolean>(false);

  useEffect(() => {
    const getOrderLisst = async () => {
      const list = await axios.get(`${URL_ENV}/order`);
      console.log("list: ", list?.data?.results);
      setListOrder(list?.data?.results);
    };
    getOrderLisst();
  }, []);

  const showModal = () => {
    setOpenpopup(true);
  };

  const handleOk = () => {
    setOpenpopup(false);
  };

  const handleCancel = () => {
    setOpenpopup(false);
  };
  return (
    <>
      <Table columns={columns} dataSource={listOrder} />;{/* //// */}
      <Modal
        title="Chi tiết đơn hàng"
        open={openPopup}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>Customer's first name: {popupOreder?.customerFirstName}</p>
        <p>Customer's last name: {popupOreder?.customerLastName}</p>
        <p>Photo package : {popupOreder?.package}</p>
        <p>Date booking: {popupOreder?.dateBooking}</p>
        <p>Order status: {popupOreder?.status}</p>
        <p>Booking place: {popupOreder?.bookingPlace}</p>
        <p>Create order date: {popupOreder?.createOrderDate}</p>
      </Modal>
    </>
  );
}

export default Index;
