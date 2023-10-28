// thử nghiệm login authorization
//nên nhớ chỉ sử dụng middleware axiosClient trong component chứ không sử dụng trong getStaticProps hay các medthod tương tự
import axios from "axios";
import React, { useEffect, useState } from "react";

import { axiosClient } from "../../libraries/axiosClient";
import { userAuth } from "@/managerState/userAuth";
type Props = {
  data: any;
};

function index({ data }: Props) {
  // var tokena: any;
  // if (typeof window !== "undefined") {
  //   tokena = window.localStorage.getItem("token");
  //   console.log("ahihi: ", tokena);
  // }
  const { auth } = userAuth((state: any) => state);
  console.log("data: ", auth);

  const [user, setUser] = useState<any>();
  const [refresh, setRefresh] = useState<number>(0);

  // useEffect(() => {
  //   const data = async () => {
  //     try {
  //       const response = await axios
  //         .get("http://localhost:9000/customer", {
  //           headers: {
  //             // Authorization: `Bearer ${auth?.token}`,
  //             //có thể lấy từ auth mà cug có thể lấy từ localStorage
  //             Authorization: `Bearer ${tokena}`,
  //           },
  //         })
  //         .then((res) => {
  //           //Object.values để chuyển object thành array
  //           const newdata = Object.values(res.data.result);
  //           setUser(newdata);
  //           return res;
  //         });
  //     } catch (error) {
  //       console.error(error);
  //       return null; // hoặc trả về một giá trị mặc định khác trong trường hợp lỗi
  //     }
  //   };
  //   data();
  // }, [refresh]);

  ///////////////////thử dùng middleware axiosClient

  useEffect(() => {
    const getData = async () => {
      try {
        var token;
        if (typeof window !== "undefined") {
          token = window.localStorage.getItem("token");
        }
        //nếu cần phân quyền thì truyền query cái field roles, nếu đúng thì
        const response = await axiosClient.get(`/customer?roles=${"admin"}`);
        if (response) {
          const newdata = Object.values(response.data.result);
          setUser(newdata);
        }
      } catch (Error) {
        console.error(Error);
        return null;
      }
    };
    getData();
  }, [refresh]);

  // console.log("authToken: ", auth?.token);
  console.log("check: ", user);

  return (
    <>
      {/* {user === null && (
        <>
          <div style={{ margin: "300px 100px" }}>không có quyền truy cập</div>
        </>
      )} */}

      {user && (
        <>
          <div style={{ margin: "300px 100px" }}>hello customer</div>
          <div
            style={{
              background: "none",
              width: "100%",
              height: "400px",
            }}
          >
            <div
              style={{
                margin: "0px 200px",
              }}
            >
              {user &&
                user?.map((item: any, index: any) => {
                  return (
                    <>
                      <div
                        key={index}
                        style={{ color: "white" }}
                      >{`${item.firstName} `}</div>
                    </>
                  );
                })}
            </div>
          </div>
        </>
      )}
      <div>alooooooo</div>
      <button
        style={{ paddingTop: "300px" }}
        onClick={() => {
          setRefresh((pre) => pre + 1);
          console.log("checkUserClick: ", user);
        }}
      >
        check
      </button>
    </>
  );
}

export default index;

// export async function getStaticProps() {
//   const data = await axiosClient
//     .get("http://localhost:9000/customer")
//     .then((response) => {
//       return response?.data?.result;
//     });

//   return {
//     props: {
//       data: data,
//     },
//   };
// }

// export async function getStaticProps() {
//   const { auth } = userAuth((state: any) => state);
//   const data = await axios
//     .get("http://localhost:9000/customer", {
//       headers: {
//         Authorization: `Bearer ${auth?.token}`,
//       },
//     })
//     .then((response) => {
//       return response?.data?.result;
//     });

//   return {
//     props: {
//       data: data,
//     },
//   };
// }
