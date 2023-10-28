"use client";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, EffectCoverflow } from "swiper";
import Image from "next/image";

// Import Swiper styles
import "swiper/css";

import style from "./style.module.css";

const URL = "http://localhost:9000";

type Props = {
  Slidedata: any;
};

export default function App({ Slidedata }: Props) {
  return (
    <>
      <Swiper
        effect={"coverflow"}
        grabCursor={true}
        centeredSlides={true}
        slidesPerView={"auto"}
        coverflowEffect={{
          rotate: 50,
          stretch: 2,
          depth: 100,
          modifier: 1,
          slideShadows: true,
        }}
        pagination={true}
        modules={[EffectCoverflow, Pagination]}
        className={style.swiper}
      >
        {Slidedata?.results &&
          Slidedata?.results.map((item: any, index: any) => {
            return (
              <>
                <SwiperSlide className={style.swiper_slide} key={item._id}>
                  <Image
                    src={`${URL}${item?.imageUrl}`}
                    alt={item.package}
                    width={500}
                    height={300}
                    // style={{ width: "500", height: "300" }}
                    // className="aspect-w-16 aspect-h-9"
                  />
                </SwiperSlide>
              </>
            );
          })}
      </Swiper>
    </>
  );
}

// export async function getStaticProps() {
//   const data = await axios
//     .get("http://localhost:9000/photographyPackage")
//     .then((response) => {
//       return response.data;
//     });

//   return {
//     props: {
//       data: data,
//     },
//   };
// }
