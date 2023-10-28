import React, { useCallback, useEffect, useState } from "react";
// import { UseAuth } from "../../managerState/useAuth";
import axios from "axios";
import {
  Space,
  Table,
  Modal,
  Popconfirm,
  Button,
  Form,
  Input,
  Pagination,
  message,
  Select,
  InputNumber,
  Upload,
} from "antd";
import type { ColumnsType } from "antd/es/table";

import {
  FilterOutlined,
  UndoOutlined,
  FileAddOutlined,
  PlusOutlined,
} from "@ant-design/icons";

const { TextArea } = Input;

const { Option } = Select;
const URL_ENV = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:9000";

interface dataTypePackage {
  _id: string;
  package: string;
  price: number;
  discount: string;
  timeForPackage: string;
}
type formType = {
  package: string;
  timeForPackage: string;
  price: number;
  discount: number;
  description: string;
  active: boolean;
};

function Index() {
  console.log("reload page.....");
  /////////////STATE///////////////////////////////
  // const { auth } = UseAuth((state: any) => state);
  const [reload, setReload] = useState<number>(0);
  const [dataPackage, setDataPackage] = useState<Array<dataTypePackage>>([]);
  const [searchPackage, setSearchPackage] = useState<Array<dataTypePackage>>(
    []
  );
  const [file, setFile] = useState<any>(null);
  const [reloadPagination, setReloadPagination] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  // const [isModalOpen2, setIsModalOpen2] = useState<boolean>(false);
  const [isModalOpen3, setIsModalOpen3] = useState<boolean>(false);

  const [isOpenFilter, setIsIOpenFilter] = useState<boolean>(false);
  const [isOpenCreate, setIsOpenCreate] = useState<boolean>(false);
  const [fieldUpdate, setFieldupdate] = useState<string>();
  const [fieldDelete, setFieldDelete] = useState<string>();

  const [toPrice, setToPrice] = useState<number>(0);
  const [fromPrice, setFromPrice] = useState<number>(0);
  const [fromDiscount, setFromDiscont] = useState<number>(0);
  const [toDiscount, setToDiscount] = useState<number>(0);
  const [skip, setSkip] = useState<number>(0);
  //limmit để khi dùng chức năng lọc nó sẽ lọc toàn bộ DB chứ không chỉ riêng ở pagination hiện hành
  const [limit, setLimit] = useState<number>(10);
  // const [currentPage, setCurrentPage] = useState<number>(1);
  const [numberPage, setNumberPage] = useState<number>(0);

  const [updateForm] = Form.useForm();
  const [updateListImgForm] = Form.useForm();
  const [createForm] = Form.useForm();

  ////////////////////////////URL_QUERY//////////////////////

  const URL_FILTER =
    `${URL_ENV}/photographyPackage/querry?` +
    (toPrice ? `priceTo=${toPrice}&` : "priceTo=&") +
    (fromPrice ? `priceFrom=${fromPrice}&` : "priceFrom=&") +
    (toDiscount ? `discountTo=${toDiscount}&` : "discountTo=&") +
    (fromDiscount ? `discountFrom=${fromDiscount}&` : "discountFrom=&") +
    (limit ? `limit=${limit}&` : "limit=&") +
    (skip ? `skip=${skip}` : "skip=");

  //////////////////////////////////////////////////////
  useEffect(() => {
    console.log("useEffect!!!");
    console.log(URL_FILTER);
    const getPackage = async () => {
      const data = await axios.get(`${URL_FILTER}`);
      console.log("data: ", data?.data?.results);
      setDataPackage(data?.data?.results);
      setSearchPackage(data?.data?.results);
      console.log("DataPage: ", data?.data?.numberItems);
      setNumberPage(data?.data?.numberItems);
    };
    getPackage();
  }, [
    toPrice,
    fromPrice,
    toDiscount,
    fromDiscount,
    reload,
    skip,
    reloadPagination,
  ]);

  const confirm = (e: any) => {
    deletePackage();
    message.success("Delete success!");
  };

  const cancel = (e: any) => {
    console.log(e);
    message.error("Click on No");
  };
  const onChangePriceFrom = async (value: any) => {
    console.log("onChangePriceFrom", value);
    setFromPrice(value);
    setLimit(0);
  };
  const onChangePriceTo = async (value: any) => {
    console.log("onChangePriceTo", value);
    setToPrice(value);
    setLimit(0);
  };
  const onChangeDiscountFrom = async (value: any) => {
    console.log("onChangeDiscountFrom", value);
    setFromDiscont(value);
    setLimit(0);
  };
  const onChangeDiscountTo = async (value: any) => {
    console.log("onChangeDiscountTo", value);
    setToDiscount(value);
    setLimit(0);
  };

  const deleteFilter = () => {
    setFromDiscont(0);
    setFromPrice(0);
    setToDiscount(100);
    setToPrice(8000000);
    setLimit(10);
  };

  const slideCurrent = (value: number) => {
    //đamg xét với limmit=3 ở router
    console.log("page: ", value);
    setSkip(value * 10 - 10);
    // setCurrentPage(value);
    setReloadPagination((prev) => prev + 1);
  };
  ///////////////////////////

  const columns: ColumnsType<dataTypePackage> = [
    {
      title: () => (
        <>
          <span>Name</span>
          <Select
            style={{ width: 200 }}
            className="ml-3"
            placeholder="Chọn một tùy chọn"
            onChange={handleSelectChange}
          >
            <Option key="" value="">
              None...
            </Option>
            {searchPackage?.map((item: any) => {
              return (
                <>
                  <Option key={item.package} value={item._id}>
                    {item.package}
                  </Option>
                </>
              );
            })}
          </Select>
        </>
      ),
      dataIndex: "package",
      key: "package",
      render: (text) => (
        <>
          <a>{text}</a>
        </>
      ),
    },
    {
      title: () => {
        return (
          <>
            <span>Price</span>
          </>
        );
      },
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Discount",
      dataIndex: "discount",
      key: "discount",
    },
    {
      title: "Package time",
      dataIndex: "timeForPackage",
      key: "timeForPackage",
    },
    {
      title: () => (
        <>
          <span>Action</span>
          <Button className="ml-4" onClick={() => setIsIOpenFilter(true)}>
            <FilterOutlined />
          </Button>
          <Button className="ml-1" onClick={() => deleteFilter()}>
            <UndoOutlined />
          </Button>
          <Button className="ml-4" onClick={() => setIsOpenCreate(true)}>
            <FileAddOutlined />
          </Button>
        </>
      ),
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Popconfirm
            title="Delete the task"
            description="Are you sure to delete this task?"
            onConfirm={confirm}
            onCancel={cancel}
            okText="Yes"
            cancelText="No"
          >
            <Button
              danger
              onClick={() => {
                setFieldDelete(record._id);
              }}
            >
              Delete
            </Button>
          </Popconfirm>
          <Button
            onClick={() => {
              setIsModalOpen(true);
              setFieldupdate(record._id);
              // console.log(":", typeof record._id);
              updateForm.setFieldsValue(record);
            }}
          >
            Update
          </Button>
          <Button
            onClick={() => {
              setIsModalOpen3(true);
              setFieldupdate(record._id);
              // console.log(":", typeof record._id);
              updateListImgForm.setFieldsValue(record);
            }}
          >
            Update Images
          </Button>
        </Space>
      ),
    },
  ];

  ///////////////////////////
  // const showModal = () => {
  //   setIsModalOpen(true);
  // };

  const handleOk1 = () => {
    setIsModalOpen(false);
  };

  const handleCancel1 = () => {
    setIsModalOpen(false);
  };

  const handleOk2 = async () => {
    setIsIOpenFilter(false);
  };

  const handleCancel2 = async () => {
    setIsIOpenFilter(false);
  };

  const handleOk3 = () => {
    setIsOpenCreate(false);
  };

  const handleCancel3 = async () => {
    setIsOpenCreate(false);
  };

  const handleOk4 = () => {
    setIsModalOpen3(false);
  };

  const handleCancel4 = async () => {
    setIsModalOpen3(false);
  };

  const onFinishUpdate = useCallback(
    (value: any) => {
      console.log("valie: ", value);
      const updatePackage = async () => {
        await axios
          .patch(`${URL_ENV}/photographyPackage/${fieldUpdate}`, value)
          .then(async (result) => {
            console.log("results: ", result);
            //upload image
            ///////////////////////////////////update img file
            const formData = new FormData();
            formData.append("file", file);
            if (file && file.uid && file.type)
              await axios.post(
                `http://localhost:9000/upload/photographypackages/${result?.data?.results?._id}/image`,
                formData
              );

            //////
            updateForm.resetFields();
            // formData.resetFields();

            message.success("Update data success!!!");
          })
          .catch(() => {
            message.warning("Error!!");
          });
      };
      updatePackage();
      setReload((prev) => prev + 1);
      setFile("");
    },
    [reload, file, fieldUpdate, updateForm]
  );

  const onFinishUpdateImg = useCallback(
    (value: any) => {
      console.log("valie: ", value);
      const updatePackage = async () => {
        await axios
          .get(`${URL_ENV}/photographyPackage/${fieldUpdate}`)
          .then(async (result) => {
            console.log("results: ", result);

            ///////////////////////////////////update list img file
            const formData2 = new FormData();
            formData2.append("file", file);
            if (file && file.uid && file.type)
              await axios.post(
                `http://localhost:9000/upload/photographypackages/${result?.data?.results?._id}/images`,
                formData2
              );

            //////
            updateListImgForm.resetFields();
            // formData.resetFields();

            message.success("Update data success!!!");
          })
          .catch(() => {
            message.warning("Error!!");
          });
      };
      updatePackage();
      setReload((prev) => prev + 1);
      setFile("");
    },
    [reload]
  );

  const onFinishCreate = useCallback(
    async (value: any) => {
      console.log(value);
      await axios
        .post(`${URL_ENV}/photographyPackage`, value)
        .then(async (result) => {
          console.log("results: ", result);
          //upload image
          ///////////////////////////////////update img file
          const formData = new FormData();
          formData.append("file", file);
          console.log("formData:", formData);
          if (file && file.uid && file.type)
            await axios.post(
              `http://localhost:9000/upload/photographypackages/${result?.data?.results?._id}/image`,
              formData
            );

          ////////
          createForm.resetFields();
          message.success("Create new data success!!!");
        })
        .catch(() => {
          message.warning("Error!!");
        });
      setFile("");
    },
    [file]
  );

  const deletePackage = useCallback(async () => {
    await axios.delete(`${URL_ENV}/photographyPackage/${fieldDelete}`);

    setReload((prev) => prev + 1);
  }, [reload, fieldDelete]);

  const handleSelectChange = useCallback(
    async (value: string) => {
      // console.log("value: ", value);
      let dataPackage;
      if (value === "") {
        dataPackage = await axios.get(`${URL_ENV}/photographyPackage/${value}`);
        setDataPackage(dataPackage?.data?.results);
      } else {
        dataPackage = await axios.get(`${URL_ENV}/photographyPackage/${value}`);
        setDataPackage([dataPackage?.data?.results]);
      }
    },
    [dataPackage]
  );

  return (
    <>
      <Table pagination={false} columns={columns} dataSource={dataPackage} />
      {/* ////////////////////////// */}

      <Modal
        title="Basic Modal"
        open={isModalOpen3}
        onOk={handleOk4}
        onCancel={handleCancel4}
      >
        {/* /////////////Form Update data of  package photo/////// */}
        <Form
          form={updateListImgForm}
          name="updateListImgForm"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          // initialValues={{ remember: true }}
          onFinish={onFinishUpdateImg}
          // onFinishFailed={onFinishFailed}
          // autoComplete="off"
        >
          <Form.Item label="Ảnh" name="List_file">
            <Upload
              maxCount={12}
              multiple={true}
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

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button htmlType="submit">Submit</Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* ///////////////// */}

      <Modal
        title="Basic Modal"
        open={isModalOpen}
        onOk={handleOk1}
        onCancel={handleCancel1}
      >
        {/* /////////////Form Update data of  package photo/////// */}
        <Form
          form={updateForm}
          name="updateForm"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          onFinish={onFinishUpdate}
          // onFinishFailed={onFinishFailed}
          // autoComplete="off"
        >
          <Form.Item<formType>
            label="Package"
            name="package"
            rules={[{ required: true, message: "Please input the package!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<formType>
            label="Package Time"
            name="timeForPackage"
            rules={[
              { required: true, message: "Please input time for Packaga!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item<formType>
            label="Price"
            name="price"
            rules={[
              { required: true, message: "Please input price of package!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item<formType>
            label="Discount"
            name="discount"
            rules={[
              { required: true, message: "Please input discount of package!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item<formType>
            label="Active"
            name="active"
            rules={[
              { required: true, message: "Please input discount of package!" },
            ]}
          >
            <Select
              options={[
                { value: "true", label: "True" },
                { value: "false", label: "False" },
              ]}
            />
          </Form.Item>
          <Form.Item<formType>
            label="Description"
            name="description"
            rules={[
              {
                required: true,
                message: "Please input description of package!",
              },
            ]}
          >
            <TextArea rows={4} />
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

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button htmlType="submit">Submit</Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* /////////Form create///// */}
      {/* /////////////Form Create new data of  package photo/////// */}

      <Modal
        title="Create Modal"
        open={isOpenCreate}
        onOk={handleOk3}
        onCancel={handleCancel3}
      >
        <Form
          form={createForm}
          name="createForm"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          // initialValues={{ remember: true }}
          onFinish={onFinishCreate}
          // onFinishFailed={onFinishFailed}
          // autoComplete="off"
        >
          <Form.Item<formType>
            label="Package"
            name="package"
            rules={[{ required: true, message: "Please input the package!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<formType>
            label="Package Time"
            name="timeForPackage"
            rules={[
              { required: true, message: "Please input time for Packaga!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item<formType>
            label="Price"
            name="price"
            rules={[
              { required: true, message: "Please input price of package!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item<formType>
            label="Discount"
            name="discount"
            // initialValue={fieldUpdate.discount}
            rules={[
              { required: true, message: "Please input discount of package!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item<formType>
            label="Active"
            name="active"
            rules={[
              { required: true, message: "Please input discount of package!" },
            ]}
          >
            <Select
              options={[
                { value: "true", label: "True" },
                { value: "false", label: "False" },
              ]}
            />
          </Form.Item>
          <Form.Item<formType>
            label="Description"
            name="description"
            // initialValue={fieldUpdate.discount}
            rules={[
              {
                required: true,
                message: "Please input description of package!",
              },
            ]}
          >
            <TextArea rows={4} placeholder="Description..." />
          </Form.Item>
          <Form.Item label="Ảnh" name="file2" valuePropName="fileList">
            <Upload
              maxCount={1}
              listType="picture-card"
              action="/upload.do"
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
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button htmlType="submit">Submit</Button>
          </Form.Item>
        </Form>
      </Modal>
      {/* ///////////////// filter */}
      <Modal
        title="Modal filter"
        open={isOpenFilter}
        onOk={handleOk2}
        onCancel={handleCancel2}
      >
        <div className="mt-2">
          <span>Price</span>
          <InputNumber
            className="ml-14"
            min={100000}
            max={8000000}
            defaultValue={100000}
            onChange={onChangePriceFrom}
          />
          <span className="ml-3">To</span>
          <InputNumber
            className="ml-3"
            min={100000}
            max={8000000}
            defaultValue={8000000}
            onChange={onChangePriceTo}
          />
        </div>
        <div className="mt-2">
          <span>Discount</span>
          <InputNumber
            className="ml-8"
            min={0}
            max={100}
            defaultValue={0}
            onChange={onChangeDiscountFrom}
          />
          <span className="ml-3">To</span>
          <InputNumber
            className="ml-3"
            min={0}
            max={100}
            defaultValue={100}
            onChange={onChangeDiscountTo}
          />
        </div>
      </Modal>
      <Pagination
        defaultCurrent={1}
        onChange={(e) => slideCurrent(e)}
        total={numberPage}
      />
    </>
  );
}

export default Index;
