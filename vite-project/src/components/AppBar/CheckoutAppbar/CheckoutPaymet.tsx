import { useEffect, useState } from "react";
import { APIENDPOINT, formatPrice } from "../../../utils/constant";
import axios from "axios";
import { Address, Item,ShoppingCartType } from "../../../utils/IVegetable";
import { useAuth } from "../../Context/useAuth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

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
  const handleDeleteSelectedItems = async () => {
    const itemIdsToDelete = cartItems.map(item => item.shoppingCart.id);
  
    try {
      await axios.delete(`${APIENDPOINT}/ShoppingCart/api/ShoppingCart/delete`, {
        data: itemIdsToDelete,
      });
      // Cập nhật trạng thái cartItems

      toast.success("Xóa các sản phẩm khỏi giỏ hàng thành công.");
    } catch (error) {
      console.error("Error deleting selected items:", error);
      toast.error("Lỗi khi xóa sản phẩm khỏi giỏ hàng.");
    }
  }
  const handlePayment = async () => {
    try {
      switch (paymentOption) {
        case 1: // Thanh toán khi nhận hàng
          await axios.post(`${APIENDPOINT}/order/api/Order/thanh-toan-nhan-hang`, 
            {customerName:user?.firstName +" "+ user?.lastName,
              address:address1,
              phone:address?.phoneNumberAddress,
              promotionId:null,
              userId:user?.id,
              paymentMethodId:1,
              isPayment:false,
              items:items,
              promotion:null,
              status:1
          });
          handleDeleteSelectedItems();
          toast.success("Đặt hàng thành công, thanh toán khi nhận hàng."); 
          navigate("/gio-hang")
          break;

        case 2: {
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
        case 3: // Thanh toán qua MoMo
          // API gọi MoMo (cần thay đổi URL nếu cần)
          axios.post(`${APIENDPOINT}/payment/momo`, {
            totalPrice: totalPrice + 20000,
          });
          alert("Bạn đã chọn thanh toán qua MoMo. Đang xử lý...");
          break;

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
