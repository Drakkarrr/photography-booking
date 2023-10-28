import dbConnect from "../../utils/dbConnect";
import { Customer } from "../../../model/account";
//sử dụng nó thay cho phần backend nodejs
export default async function handler(req, res) {
  await dbConnect(); // Kết nối đến cơ sở dữ liệu
  if (req.method === "PATCH") {
    const { id } = req.params;
    const data = req.body;

    await Customer.findByIdAndUpdate(id, data)
      .then((result) => {
        res.send({ ok: true, results: result });
      })
      .catch((err) => {
        res.sendStatus(400).json({ message: err.message });
      });
  } else {
    // Xử lý các yêu cầu HTTP khác (PUT, DELETE) nếu cần
    res.status(404).end();
  }
}
