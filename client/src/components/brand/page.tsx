import React from "react";
import Image from "next/image";
import style from "./style.module.css";
type Props = {};
import brand1 from "../../picture/kisspng-canon-digital-ixus-canon-eos-logo-camera-canon-logo-5b4ac044e82863.1962864615316255409509.png";
import brand2 from "../../picture/kisspng-fujifilm-logo-inkjet-paper-image-product-fujifilm-bright-bi-consulting-5b7d8fe8793ad0.8424786815349554964966.png";
import brand3 from "../../picture/kisspng-logo-mobile-world-congress-sony-xperia-xz2-sony-ar-5b26ca8e29b3b8.6471170715292688781708.png";
import brand4 from "../../picture/kisspng-logo-nikon-camera-nikon-logo-5b15ec6645f503.0623477815281634302866.png";

function Brand({}: Props) {
  return (
    <>
      <div className={style.Brand}>
        <Image
          src={brand3}
          alt="My Image"
          width={260}
          height={140}
          className={style.Brand_item}
        />
        <Image
          src={brand4}
          alt="My Image"
          width={260}
          height={140}
          className={style.Brand_item}
        />
        <Image
          src={brand2}
          alt="My Image"
          width={260}
          height={140}
          className={style.Brand_item}
        />
        <Image
          src={brand1}
          alt="My Image"
          width={260}
          height={140}
          //
          className={style.Brand_item2}
        />
      </div>
    </>
  );
}

export default Brand;
