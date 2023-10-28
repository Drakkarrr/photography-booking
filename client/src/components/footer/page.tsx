import { memo } from "react";
import React from "react";
import Style from "./Footer.module.css";
import Link from "next/link";
import Image from "next/image";
import brand1 from "../../picture/kisspng-canon-digital-ixus-canon-eos-logo-camera-canon-logo-5b4ac044e82863.1962864615316255409509.png";
type Props = {};
const URL_ENV = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:9000";
function Footer({}: Props) {
  return (
    <>
      <hr />
      <div className={`container ${Style.container}`}>
        <div className={Style.content1}>
          <h3>Tiệm Ảnh Studio</h3>
          <p>Thanh Sơn, phường Thanh Bình, quận Hải Châu, TP. Đà Nẵng</p>
          <p>
            Điện thoại:{" "}
            <Link href={"/LienHe"} className="text-decoration-none">
              0356057252
            </Link>
          </p>
          <p>
            Tổng đài CSKH:{" "}
            <Link href={"/LienHe"} className="text-decoration-none">
              18000000
            </Link>
          </p>
        </div>
        <div className={Style.content2}>
          <h5>Về chúng tôi</h5>

          <p>
            <Link href={"/ThuongHieu"} className="text-decoration-none">
              Giới thiệu về thương hiệu
            </Link>
          </p>
          <p>
            {" "}
            <Link href={"/ThuongHieu"} className="text-decoration-none">
              Các chi nhánh trên toàn quốc
            </Link>
          </p>
        </div>
        <div className={Style.content3}>
          <div>
            {" "}
            <h5>Hỗ trợ thanh toán</h5>
            <Image
              alt=""
              src={brand1}
              width={50}
              height={50}
              style={{ fontSize: "24px", color: "white" }}
            />
            <Image
              alt=""
              src={brand1}
              width={50}
              height={50}
              style={{ fontSize: "24px", color: "white" }}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default memo(Footer);
