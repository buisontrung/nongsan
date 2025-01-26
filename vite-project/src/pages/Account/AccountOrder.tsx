import { useEffect, useState } from "react";
import { orderArr } from "../../const/array";
import { Link, useLocation } from "react-router-dom";
import { Order } from "../../utils/IVegetable";
import axios from "axios";
import { APIENDPOINT, formatPrice } from "../../configs/constant";
import { useAuth } from "../../Context/useAuth";

const AccountOrder = () => {
    const [tab, setTab] = useState(0);
    const [page, setPage] = useState(1);
    const [countOrder, setCountOrder] = useState(0);
    const location = useLocation();
    const [order, setOrder] = useState<Order[]>([]);
    const { user } = useAuth();

    // Khi location thay đổi, kiểm tra URL để cập nhật tab
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const type = queryParams.get("type");
        if (type !== null && type !== undefined) {
            setTab(parseInt(type));
            setPage(1)            
        }
    }, [location.search]);

    // Gọi API khi tab hoặc page thay đổi
    useEffect(() => {
        const fetchOrder = async () => {
            if (user?.id && tab !== null && tab !== undefined) {
                try {
                    const res = await axios.get(
                        `${APIENDPOINT}/order/api/order/userId=${user?.id}?status=${tab}&pageIndex=${page}&pageSize=4`
                    );
                    setOrder(res.data.orders);
                    setCountOrder(res.data.totalCount);
                } catch (err) {
                    console.log(err);
                    setOrder([]);
                }
            }
        };
        fetchOrder();
    }, [tab, user?.id, page]);
    const handleRemoveOrder = async (id: number) => {
        // Cập nhật trạng thái trong mảng đơn hàng
        setOrder((prevOrders) => 
            prevOrders.map((order) => 
                order.id === id ? { ...order, status: 5 } : order
            )
        );
    
        try {
            // Gửi yêu cầu PUT đến API
            const response = await axios.put(`${APIENDPOINT}/order/api/order/UpdateStatus`, {
                id: id,
                status: 5,
            });
    
            // Kiểm tra phản hồi thành công
            if (response.status === 200) {
                console.log("Order status updated successfully");
            } else {
                console.error("Failed to update order status:", response.data);
            }
        } catch (error) {
            // Xử lý lỗi
            console.error("An error occurred while updating order status:", error);
        }
    };
    
    // Render số trang
    const renderPaginationItems = () => {
        const totalPages = Math.ceil(countOrder / 4);
        console.log(totalPages)
        const items = [];
        for (let i = 1; i <= totalPages; i++) {
            items.push(
                <li
                    key={i}
                    onClick={() => setPage(i)}
                    className={`page-item ${i === page ? "active" : ""}`}
                    style={{
                        cursor: "pointer",
                        padding: "5px 10px",
                        border: "1px solid #ccc",
                        display: "inline-block",
                        margin: "0 5px",
                       
                    }}
                >
                    {i}
                </li>
            );
        }
        return items;
    };

    return (
        <>
            <div className="container px-4" style={{ backgroundColor: "#fff",minHeight:"650px" }}>
                <div
                    className="d-flex justify-content-between"
                    style={{ borderBottom: "1px solid #dfdddd" }}
                >
                    {orderArr.map((item) => (
                        <Link
                            to={`?type=${item.status}`}
                            key={item.status}
                            className={`text-center pt-3 pb-3 order-item ${
                                item.status == tab ? "order-active" : ""
                            }`}
                        >
                            {item.name}
                        </Link>
                    ))}
                </div>
                <div className="pt-4 mt-3">
                    {order &&order.map((item) => (
                        <div
                            key={item.id}
                            className="col-12 p-3 mb-3"
                            style={{ border: "1px solid #dfdddd" }}
                        >
                            <div className="d-flex justify-content-between">
                                <span> Đơn hàng: {item.code}</span>
                                <span> {formatPrice(item.discountAmount, 0)} VND</span>
                            </div>
                            <div className="d-flex justify-content-between mt-3">
                                <div></div>
                                <div className="d-flex">
                                    <Link
                                        to={`details?type=${tab}&order_id=${item.id}`}
                                        className="btn-order"
                                    >
                                        Xem Chi tiết
                                    </Link>
                                    
                                    <button
                                        className={`btn-order ${
                                            item.status >= 3 ? "d-none" : ""
                                        }`} onClick={()=>handleRemoveOrder(item.id)}
                                    >
                                        Hủy đơn
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="mt-2 mb-3">
                <ul  className="text-center"style={{ listStyle: "none", padding: 0 }}>{renderPaginationItems()}</ul>
            </div>
        </>
    );
};

export default AccountOrder;
