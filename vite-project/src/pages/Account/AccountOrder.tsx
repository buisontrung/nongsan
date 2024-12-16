import { useEffect, useState } from "react"
import { orderArr } from "../../utils/array"
import { Link, useLocation } from "react-router-dom";
import { Order } from "../../utils/IVegetable";
import axios from "axios";
import { APIENDPOINT, formatPrice } from "../../utils/constant";
import { useAuth } from "../../components/Context/useAuth";

const AccountOrder = () => {
    const [tab,setTab]= useState(0);
    const location = useLocation();
    const [order,setOrder] = useState<Order[]>([])
    const {user} = useAuth();
    // Khi location thay đổi, kiểm tra URL để cập nhật tab
    useEffect(() => {
        // Lấy query string từ location.search
        const queryParams = new URLSearchParams(location.search); 
        const type = queryParams.get('type'); 
    
        // Đặt giá trị tab nếu query string tồn tại
        if (type !== null && type !== undefined) {
            setTab(parseInt(type));
        }
    }, [location.search]); // Chỉ chạy khi `location.search` thay đổi
    
    useEffect(() => {
        const fetchOrder = async () => {
            if (user?.id && tab !== null && tab !== undefined) {
                try {
                    switch (tab) {
                        case 0: {
                            const res = await axios.get(`${APIENDPOINT}/order/api/order/userId=${user?.id}`);
                            setOrder(res.data);
                            break;
                        }
                        default:
                            console.log('Invalid tab');
                            break;
                    }
                } catch (err) {
                    console.log(err);
                    setOrder([]); // Đặt rỗng khi lỗi xảy ra
                }
            }
        };
    
        fetchOrder();
    }, [tab, user?.id]);
  return (
    <div className="container h-100 px-4" style={{ backgroundColor: "#fff" }}>
            <div className="d-flex justify-content-between " style={{ borderBottom: "1px solid #dfdddd" }}>
            {
                orderArr.map(item=>(
                    <Link  to={`?type=${item.status}`} key={item.status} className={`text-center pt-3 pb-3 order-item ${item.status==tab?"order-active":""}`} >{item.name}</Link>
                ))
            }
                
            </div>
            <div className="pt-4 mt-3">

            {order.map((item)=>(
                <div key={item.id} className="col-12 p-3 mb-3" style={{ border: "1px solid #dfdddd" }}>
                    <div className="d-flex justify-content-between">
                        <span> Đơn hàng: {item.code}</span>
                        <span> {formatPrice(item.discountAmount,0) } VND</span>
                    </div>
                    <div className="d-flex justify-content-between">
                        <div></div>
                        <div className="">
                            <button className="btn-order">Mua lại</button>
                            <Link to={`details?type=${tab}&order_id=${item.id}`} type='button'className="btn-order">Xem Chi tiết</Link>
                            <button className="btn-order">Xem đánh giá</button>
                        </div>
                    </div>
                </div>
            ))}
                


            </div>

        </div>
  )
}

export default AccountOrder
