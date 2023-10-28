import React from "react";
import Image from "next/image";
import { Card } from "antd";
import Style from "./style.module.css";
// import anh1 from "../../picture/tao-dang-chup-anh-ky-yeu-doi-yody-vn.webp";
import {
  FacebookFilled,
  InstagramFilled,
  TwitterSquareFilled,
} from "@ant-design/icons";

const URL = "http://localhost:9000";
type Props = {
  data: {
    firstName: string;
    lastName: string;
    position: string;
    imageUrl: string;
  }[];
};

function CardMember({ data }: Props) {
  return (
    <>
      {data &&
        data?.map((item, index) => {
          return (
            <>
              <Card
                style={{ width: 300 }}
                key={index}
                className={Style.item__card}
              >
                <Image
                  src={`${URL}${item?.imageUrl}`}
                  alt="My Image"
                  width={250}
                  height={200}
                  // style={{ width: "500", height: "300" }}
                  className={Style.obj__img}
                />
                <span className={Style.name__title}>
                  {item.firstName} {item.lastName}
                </span>
                <span className={Style.name__position}>{item.position}</span>
                <div className={Style.social__icon}>
                  <i>
                    <FacebookFilled />
                  </i>
                  <i>
                    <InstagramFilled />
                  </i>
                  <i>
                    <TwitterSquareFilled />
                  </i>
                </div>
              </Card>
            </>
          );
        })}
    </>
  );
}

export default CardMember;
