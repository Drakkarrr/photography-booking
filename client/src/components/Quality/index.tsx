import React from "react";
import styles from "./style.module.css";
import {
  FaCameraRetro,
  FaAward,
  FaMoneyCheckAlt,
  FaSun,
  FaTicketAlt,
  FaUserFriends,
  FaCut,
  FaHandsHelping,
} from "react-icons/fa";
type Props = {};

function index({}: Props) {
  return (
    <>
      <div className={styles.element}>
        <ul className={styles.list__element}>
          <li className={styles.space_mobile}>
            <div style={{ display: "flex" }}>
              <FaCameraRetro className={styles.icon__style} />
              <h3>MÁY MÓC - THIẾT BỊ</h3>
            </div>
            <span>
              Tất cả các trang thiết bị tân tiến được sử dụng, bảo quản theo
              tiêu chuẩn
            </span>
          </li>
          <li className={styles.space_mobile}>
            <div style={{ display: "flex" }}>
              <FaCut className={styles.icon__style} />
              <h3>CHỈNH SỬA CHUYÊN NGHIỆP</h3>{" "}
            </div>

            <span>
              Được edit bởi đội ngũ chuyên nghiệp và có tính sáng tạo cao
            </span>
          </li>
          <li className={styles.space_mobile}>
            <div style={{ display: "flex" }}>
              <FaUserFriends className={styles.icon__style} />
              <h3>ĐỘI NGŨ GIÀU KINH NGHIỆM</h3>{" "}
            </div>
            <span>
              Nhân viên được đào tạo bài bài để có được những sản phẩm ưng ý
              nhất dành cho khách hàng, phục vụ khách hàng tận tình, thân thiện
            </span>
          </li>
          <li className={styles.space_mobile}>
            <div style={{ display: "flex" }}>
              <FaSun className={styles.icon__style} />
              <h3>CHẤT LƯỢNG HÌNH ẢNH CAO</h3>{" "}
            </div>

            <span>Đáp ứng nhu cầu của khách hàng</span>
          </li>
        </ul>
        <ul
          className={styles.list__element}
          style={{
            listStyle: "none",
            display: "flex",
            justifyContent: "center",
            paddingTop: "3%",
          }}
        >
          <li className={styles.space_mobile}>
            <div style={{ display: "flex" }}>
              <FaAward className={styles.icon__style} />
              <h3>CÁC CHỨNG NHẬN UY TÍN</h3>
            </div>
            <span>
              Đạt được nhiều chứng chỉ uy tính trong giới nghệ thuật nhiếp ảnh
            </span>
          </li>
          <li className={styles.space_mobile}>
            <div style={{ display: "flex" }}>
              <FaTicketAlt className={styles.icon__style} />
              <h3>KHUYẾN MÃI HẤP DẪN</h3>{" "}
            </div>
            <span>Nhiều ưu đãi hấp dẫn khi đăng ký</span>
          </li>
          <li className={styles.space_mobile}>
            <div style={{ display: "flex" }}>
              <FaMoneyCheckAlt className={styles.icon__style} />
              <h3>THANH TOÁN THÔNG MINH </h3>
            </div>
            <span>Hỗ trợ các phương thức thanh toán điện tử</span>
          </li>
          <li className={styles.space_mobile}>
            <div style={{ display: "flex" }}>
              <FaHandsHelping className={styles.icon__style} />
              <h3>TƯ VẤN - CSKH TẬN TÌNH</h3>
            </div>
            <span>Hỗ trợ nhiệt huyết - tận tình - thân thiện</span>
          </li>
        </ul>
      </div>
    </>
  );
}

export default index;
