import { APIENDPOINT, formatPrice } from "../../../utils/constant";
import {  ShoppingCartType } from "../../../utils/IVegetable"

interface CheckoutCartProps {
  cartItems: ShoppingCartType[];
}

const CheckoutCart: React.FC<CheckoutCartProps> = ({ cartItems }) => {
  console.log(cartItems)
  if (!cartItems || cartItems.length === 0) {
    return <div>Giỏ hàng trống</div>;
  }
  return (
    <div className="UWJJw6 pb-5">
      <div className="kvWjhK ">
        <div className="d-flex align-items-center">
          <div className="col-4">
            <h2 className="zgWBzz">Sản phẩm</h2>
          </div>
          <div className="col-2 text-end">Phân loại</div>
          <div className="col-2 text-end">Đơn giá</div>
          <div className="col-2 text-end">Số lượng</div>
          <div className="col-2 text-end">Thành tiền</div>
        </div>
      </div>
      <div>
        {cartItems.map((item, index) => (
          <div key={index} className="QroV_K">
            <div className="xyz">
              <div className="A3VoHf">
                <div className="_MbENL">
                  <div className="d-flex">
                    <div className="col-4">
                      <picture>
                        <source
                          srcSet={APIENDPOINT+"/product/images/"+ item.product.imageUrl}
                          type="image/webp"
                          className="xh1MNn"
                        />
                        <img
                          width="60"
                          loading="lazy"
                          className="RIhds1 lazyload Yzo0tI"
                          src={APIENDPOINT+"/product/images/"+ item.product.imageUrl}
                          height="60"
                          alt={item.product.productName}
                        />
                      </picture>
                      <span className="mx-2">
                        <span className="TvB7XR">{item.product.productName}</span>
                      </span>
                    </div>
                    <div className="col-2 text-center d-flex align-items-center">
                      <span className="Ev9jhR">Loại: {item.product.productVariantDTOs[0].variantName}</span>
                    </div>
                    <div className="col-2 d-flex align-items-center justify-content-start">{formatPrice(item.shoppingCart.price,0)} VND</div>
                    <div className="col-2 d-flex align-items-center justify-content-start">{item.shoppingCart.quantity}</div>
                    <div className="col-2 d-flex align-items-center justify-content-start">
                      {formatPrice(item.shoppingCart.quantity, item.shoppingCart.price)} VND
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CheckoutCart
