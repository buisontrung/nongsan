

const CheckoutPaymet = () => {
  return (
    <div className="mt-2">
      <div className="card-body" style={{backgroundColor:"#fff"}}>
        <div className="mx-4">
            <div className="payment-method-title col-12 mb-3">
                Phương thức thanh toán
            </div>
            <div className="payment-method-tab col-12 mb-4">
                
                    <button className="col-12 col-md-2 pt-2 pb-2">
                        <span>Thanh toán VNPay</span>
                    </button>
                    <button className="col-12 col-md-2 pt-2 pb-2">
                        <span>Thanh toán MoMo</span>
                    </button>
                    <button className="col-12 col-md-3 pt-2 pb-2">
                        <span>Chuyển khoản qua ngân hàng</span>
                    </button>
                    <button className="col-12 col-md-3 pt-2 pb-2">
                        <span>Thanh toán khi nhận hàng</span>
                    </button>
                
            </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPaymet
