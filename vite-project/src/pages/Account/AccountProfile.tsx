

const AccountProfile = () => {
  return (
    <div className="container h-100 px-4" style={{ backgroundColor: "#fff" }}>
      <div className="pt-3 pb-3" style={{ borderBottom: "1px solid #dfdddd" }}>
        <h4 className="mb-0">Hồ sơ của tôi</h4>
        <span>Quản lý thông tin hồ sơ để bảo mật tài khoản</span>
      </div>
      <div className="pt-4 mt-3 d-flex flex-wrap justify-content-between">
        <div className="col-5">
          <label htmlFor="firstName" className="form-label">Tên <span className="text-danger">*</span></label>
          <input
            type="text"
            className="form-control"
            name="firstName"
            id="firstName"
            placeholder="First Name"
            required

          />
        </div>
        <div className="col-5">
          <label htmlFor="lastName" className="form-label">Họ <span className="text-danger">*</span></label>
          <input
            type="text"
            className="form-control"
            name="lastName"
            id="lastName"
            placeholder="Last Name"
            required

          />
        </div>
        <div className="col-12 mt-4">
        <div className="col-12 col-md-6">
          <label htmlFor="email" className="form-label">Email <span className="text-danger">*</span></label>
          <input
            type="email"
            className="form-control"
            name="email"
            id="email"
            required
            placeholder="example@gmail.com"
          /></div>
        </div>
        
        <div className="col-12 mt-4">
          <div className="col-12 col-md-6">
            <label htmlFor="phone" className="form-label">Số điện thoại <span className="text-danger">*</span></label>
            <input type="text" placeholder="số điện thoại" name="phone" className="form-control" /></div>
        </div>
        <div className="col-12 mt-4 col-md-2">

          <div className="d-grid">
          <button className="btn bsb-btn-xl btn-save-account" type="button" style={{color:"#fff"}}>Lưu</button></div></div>

      </div>

    </div>
  )
}

export default AccountProfile
