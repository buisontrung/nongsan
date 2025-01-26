import { useEffect, useState } from "react";
import { APIENDPOINT, formatPrice } from "../../../configs/constant";
import axios from "axios";
import { Address, Item,ShoppingCartType } from "../../../utils/IVegetable";
import { useAuth } from "../../../Context/useAuth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { HubConnectionBuilder } from "@microsoft/signalr";

interface CheckoutPaymetProps {
  totalPrice: number;
  cartItems: ShoppingCartType[]
  address:Address | undefined
}

const CheckoutPaymet: React.FC<CheckoutPaymetProps> = ({ totalPrice ,address,cartItems}) => {
  const [paymentOption, setPaymentOption] = useState(1);
  const [items,setItems] = useState<Item[]>([])
  const {user} = useAuth();
  const [address1,setAddress1]= useState("")
  const navigate = useNavigate();
  const [cookies] = useCookies(['accessToken', 'refreshToken']);
  useEffect(() => {
    // Update the items state whenever cartItems change
    const newItems = cartItems.map((x) => ({
      productId: x.shoppingCart.productVarianId,
      quantity: x.shoppingCart.quantity,
      price: x.shoppingCart.price,
    }));
    setAddress1(address ? `${address.city} ${address.district} ${address.wardsCommunes} ${address.addressName}` : '');
    setItems(newItems);


  }, [cartItems, address]); // This will run when cartItems or address changes
  const ids = cartItems.map(item => item.shoppingCart.id);
  const handleDeleteSelectedItems = async () => {
    const itemIdsToDelete = cartItems.map(item => item.shoppingCart.id);
  
    try {
      await axios.delete(`${APIENDPOINT}/ShoppingCart/api/ShoppingCart/delete`, {
        data: itemIdsToDelete,
      });
      // Cập nhật trạng thái cartItems

      
    } catch (error) {
      console.error("Error deleting selected items:", error);
      
    }
  }
  const handlePayment = async () => {
    try {
      switch (paymentOption) {
        case 1: // Thanh toán khi nhận hàng
          await axios.post(`${APIENDPOINT}/order/api/Order/thanh-toan-nhan-hang`, 
            { customerName:address?.userNameAddress,
              address:address1,
              phone:address?.phoneNumberAddress,
              promotionId:null,
              userId:user?.id,
              paymentMethodId:1,
              isPayment:true,
              items:items,
              promotion:null,
              status:1,
              email:"sontrungtt@gmail.com"
          });
          handleDeleteSelectedItems();
          toast.success("Đặt hàng thành công, thanh toán khi nhận hàng."); 
          navigate("/gio-hang")
          break;

        case 2: {
          if(!address?.userNameAddress){
            alert("bạn chưa tạo địa chỉ");
            return;
          }
          axios.delete(`${APIENDPOINT}/ShoppingCart/api/ShoppingCart/delete`, {
            headers: {
                'Authorization': `Bearer ${cookies.accessToken}`
              },
            data: ids,
        })
        .then(async () => {
                        const newConnection = new HubConnectionBuilder()
                            .withUrl("https://localhost:7006/cartHub")
                            .withAutomaticReconnect()
                            .build();
        
                        try {
                            await newConnection.start(); // Bắt đầu kết nối
        
                            if (newConnection.state === "Connected") {
                                await newConnection.invoke("NotifyCartUpdate", user?.id); // Gửi sự kiện
                                //giữ lại các phần tử có id không trùng với danh sách id đã xóa
                                
                                alert("thành công")
                            }
                        } catch (error) {
                            console.error("Lỗi khi gửi thông báo:", error);
                        } finally {
                            await newConnection.stop(); // Đảm bảo kết nối luôn được đóng
                            console.log("Kết nối đã được đóng.");
                        }
                    }
        
        
        
                    );
        
        axios.post(`${APIENDPOINT}/order/api/Order/vnpay`,{
          customerName:address?.userNameAddress,
          address:address1,
          phone:address?.phoneNumberAddress,
          promotionId:null,
          userId:user?.id,
          paymentMethodId:2,
          isPayment:true,
          items:items,
          promotion:null,
          status:2,
          email:"sontrungtt@gmail.com"
      }).then(res=>{
        // chuyển hướng theo đường link
        window.location.href=res.data.url
        handleDeleteSelectedItems();

      })
      .catch(err=>{
        console.log(err)
      })
      ;
        alert("Bạn đã chọn thanh toán qua VNPay. Đang xử lý...");
          break;
        }
        

        default:
          toast.error("Phương thức thanh toán không hợp lệ");
          break;
      }
    } catch (error) {
      console.error("Lỗi khi xử lý thanh toán:", error);
      toast.error("Đã xảy ra lỗi. Vui lòng thử lại sau.");
    }
  };

  return (
    <div className="mt-2">
      <div className="card-body" style={{ backgroundColor: "#fff" }}>
        <div className="mx-4">
          <div className="payment-method-title col-12 mb-3">
            Phương thức thanh toán
          </div>
          <div className="payment-method-tab col-12 mb-4">
            <button
              className={`col-12 col-md-3 pt-2 pb-2 ${
                paymentOption === 1 ? "payment-active" : ""
              }`}
              onClick={() => setPaymentOption(1)}
            >
              <span>Thanh toán khi nhận hàng</span>
            </button>
            <button
              className={`col-12 col-md-3 pt-2 pb-2 ${
                paymentOption === 2 ? "payment-active" : ""
              }`}
              onClick={() => setPaymentOption(2)}
            >
              <span>Thanh toán VNPay</span>
            </button>
            
          </div>
        </div>
        <div className="m-4">
          <div className="col-12 d-flex justify-content-end">
            <div className="col-md-3 col-12">
              <div className="col-12 d-flex justify-content-between mb-2 align-items-center">
                <span>Tổng tiền hàng</span>
                <span>{totalPrice && formatPrice(totalPrice, 0)} VND</span>
              </div>
              <div className="col-12 d-flex justify-content-between mb-2 align-items-center">
                <span>Phí vận chuyển</span>
                <span>20.000 VND</span>
              </div>
              <div className="col-12 d-flex justify-content-between mb-2 align-items-center">
                <span>Tổng thanh toán</span>
                <span style={{ fontSize: "22px", color: "#86bc42" }}>
                  {totalPrice && formatPrice(totalPrice + 20000, 0)} VND
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="m-4">
          <div className="col-12 d-flex justify-content-end">
            <button
              className="col-12 col-md-2 pt-2 pb-2 px-4 payment-active"
              onClick={handlePayment}
            >
              Đặt hàng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPaymet;
