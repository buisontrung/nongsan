import { useEffect, useState } from "react";
import { Order, OrderDetail } from "../../utils/IVegetable";
import { APIENDPOINT, formatPrice } from "../../utils/constant";
import axios from "axios";

const AccountOrderDetails = () => {
    const [order, setOrder] = useState<Order | undefined>(undefined);
    const [orderDetails, setOrderDetails] = useState<OrderDetail[]>([]);


    useEffect(() => {
        const hash = window.location.hash;
        const queryParams = new URLSearchParams(hash.split("?")[1]);
        const orderId = queryParams.get("order_id");

        if (orderId) {
            const fetchOrderDetails = async () => {
                try {
                    const [orderResponse, detailsResponse] = await Promise.all([
                        axios.get(`${APIENDPOINT}/order/api/Order/${orderId}`),
                        axios.get(`${APIENDPOINT}/order/api/OrderDetail/orderId=${orderId}`),
                    ]);

                    // Đặt dữ liệu vào state
                    setOrder(orderResponse.data);
                    setOrderDetails(detailsResponse.data);

                } catch (error) {
                    console.error("Error fetching order details:", error);
                }
            };

            fetchOrderDetails();
        }
    }, []);
    
    return (
        <div className="container h-100 px-4" style={{ backgroundColor: "#fff" }}>
            <div className="card-order">
                <div className="title-order row">Chi tiết đơn hàng</div>

                {/* Order Info */}

                <div className="progress-track">
                    <ul id="progressbar">
                        <li className={`step0 ${order && order?.status >= 1 ? "active-order" : ""}`} id="step1">Đang xác nhận</li>
                        <li className={`step0 ${order && order?.status >= 2 ? "active-order" : ""}`} id="step2">Đang chuẩn bị</li>
                        <li className={`step0 ${order && order?.status >= 3 ? "active-order" : ""}`} id="step3">Đang giao</li>
                        <li className={`step0 ${order && order?.status >= 4 ? "active-order" : ""}`} id="step4">Hoàn thành</li>
                    </ul>
                </div>
                <div className="info-order">
                    <div className="row">
                        <div className="col-7">
                            <span id="heading-order">Ngày tạo</span><br />
                            <span className="details-order">{order?.createDate ? new Date(order.createDate).toLocaleDateString("vi-VN") : "Không có ngày"}</span>
                        </div>
                        <div className="col-5 text-end pe-5">
                            <span id="heading-order">Mã đơn hàng</span><br />
                            <span className="details-order">{order?.code || "N/A"}</span>
                        </div>
                    </div>
                </div>

                {/* Order Pricing */}


                <div className="pricing-order">
                    <div className="row pt-3">
                        <div className="col-2">Tên sản phẩm</div>
                        <div className="col-2">Ảnh</div>
                        <div className="col-1"></div>
                        <div className="col-3">Phân loại</div>
                        <div className="col-2">Số lượng</div>
                        <div className="col-2 d-flex justify-content-end">Thành tiền</div>
                    </div>
                    {orderDetails.map((detail, index) => (
                        <div className="row pt-3" key={index}>
                            <div className="col-2 ">
                                <span >{detail.product.productName}</span>
                            </div>
                            <div className="col-2">
                                <img src={`${APIENDPOINT}/product/images/${detail.product.imageUrl}`} style={{ width: "100%", height: "auto" }} alt="" />
                            </div>
                            <div className="col-1"></div>
                            <div className="col-3">
                                <span>{detail.product.productVariantDTOs[0].variantName}</span>
                            </div>
                            <div className="col-2">
                                <span>{detail.quantity}</span>
                            </div>
                            <div className="col-2 d-flex justify-content-end">
                                <span>
                                    {formatPrice(detail.price, detail.quantity)} VND
                                </span>
                            </div>
                        </div>
                    ))}

                    {/* Shipping Info */}
                    <div className="row pt-3">
                        <div className="col-10">
                            <span id="name">Phí giao hàng</span>
                        </div>
                        <div className="col-2 d-flex justify-content-end">
                            <span className="">20.000 VND</span>
                        </div>
                    </div>
                    <div className="row pt-3">
                        <div className="col-9"><span>Tổng tiền</span></div>
                        <div className="col-1"></div>
                        <div className="col-2 d-flex justify-content-end">
                            <span>
                                {formatPrice(order && order?.discountAmount || 0, 0)} VND
                            </span>
                        </div>
                    </div>
                    <div className="row pt-3">
                        <div className="title-order mb-0">Địa chỉ nhận hàng</div>
                        <div>

                            <span>{order?.customerName}</span>
                        </div>

                        <div className="">
                            <span>
                                {order?.phone}
                            </span>
                        </div>
                        <div className="">
                            <span>
                                {order?.address}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Total */}




                {/* Tracking Order */}


                {/* Footer */}
                <div className="footer-order">
                    <div className="row">
                        <div className="col-2">

                        </div>
                        <div className="col-10">

                        </div>
                    </div>
                </div>
            </div>
            <div className="row d-flex justify-content-end">{order && order?.status <=3 && <button className="btn col-3 text-center d-block btn-order" disabled={!(order&&order?.status === 3)}>Xác nhận hàng</button>}</div>
        </div>
    );
};

export default AccountOrderDetails;
