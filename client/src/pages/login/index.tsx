import axios from "axios";
import React, { useEffect, useState } from "react";
import { userAuth } from "../../managerState/userAuth";
import Login from "../../components/login/index";

type Props = {};
const URL_ENV = "http://localhost:9000";
function index({}: Props) {
  const { auth }: any = userAuth((state) => state);
  const [user, setUser] = useState<any>();
  console.log(user);
  const E_URL = `http://localhost:9000/customer/${auth?.payload?._id}`;
  // useEffect(() => {
  //   console.log(auth);
  //   if (auth?.payload?._id) {
  //     axios.get(E_URL).then((response) => {
  //       console.log(response);
  //       setUser(response);
  //     });
  //   }
  // }, [E_URL]);
  return <>{!user && <Login />}</>;
}

export default index;
