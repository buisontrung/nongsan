import { useEffect, useState } from "react";
import { useAuth } from "../../Context/useAuth"
import axios from "axios";
import { APIENDPOINT } from "../../configs/constant";
import Swal from "sweetalert2";


const AccountProfile = () => {
  const {user}= useAuth();
  const [firstName,setFirstName]= useState('')
  const [lastName,setLastName]= useState('')
  const [email,setEmail]= useState('')
  const [phone,setPhone]= useState('')
  const [isValidEmail, setIsValidEmail] = useState(true);
  useEffect(() => {
    
   setFirstName(user?.firstName||"");
     setLastName(user?.lastName||"");
     setEmail(user?.email||"");
     setPhone(user?.phoneNumber||"");
  }, [user]);
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const emailValue = e.target.value;
    setEmail(emailValue);

    // Biểu thức chính quy để kiểm tra email
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.com$/;
    setIsValidEmail(emailRegex.test(emailValue)); // Cập nhật trạng thái hợp lệ
  };
  const handleUpdateUser = async () => {
    if (!isValidEmail) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Vui lòng kiểm tra lại email",
        showConfirmButton: false,
        timer: 1500
      });
      return;
    }

    try {
      // Gửi yêu cầu PUT để cập nhật thông tin người dùng
      console.log(phone)
      const response = await axios.put(`${APIENDPOINT}/auth/api/Auth/${user?.id}`, {
        firstName: firstName,
        lastName: lastName,
        email: email,
        phoneNumber: phone,

      });

      // Kiểm tra kết quả trả về từ API (UserDTO đã được cập nhật)
      if (response.data) {
        const updatedUser = response.data;

        // Lưu thông tin người dùng mới vào sessionStorage (hoặc localStorage)
        sessionStorage.setItem("user", JSON.stringify(updatedUser)); // Hoặc localStorage.setItem nếu muốn lưu lâu dài

        // Cập nhật lại state user nếu cần


        // Thông báo thành công
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Cập nhật thông tin thành công",
          showConfirmButton: false,
          timer: 1500
        });
      }
    } catch (error) {
      console.error("Cập nhật thông tin người dùng thất bại:", error);
      console.log(lastName)
      alert("Có lỗi khi cập nhật thông tin người dùng.");
    }
  };
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
            value={firstName}
            placeholder="First Name"
            onChange={(e)=>setFirstName(e.target.value)}

          />
        </div>
        <div className="col-5">
          <label htmlFor="lastName" className="form-label">Họ <span className="text-danger">*</span></label>
          <input
            type="text"
            className="form-control"
            name="lastName"
            id="lastName"
            value={lastName}
            placeholder="Last Name"
            onChange={(e)=>setLastName(e.target.value)}

          />
        </div>
        <div className="col-12 mt-4">
        <div className="col-12 col-md-6">
          <label htmlFor="email" className="form-label">Email <span className="text-danger">*</span></label>
          <input
            type="email"
            className="form-control"
            value={email}
            name="email"
            id="email"
            
            onChange={(e)=>handleEmailChange(e)}
            placeholder="example@gmail.com"
          />
          {!isValidEmail && email && (
        <small style={{ color: 'red' }}>Email không hợp lệ.</small>
      )}</div>
        </div>
        
        <div className="col-12 mt-4">
          <div className="col-12 col-md-6">
            <label htmlFor="phone" className="form-label">Số điện thoại <span className="text-danger">*</span></label>
            <input value={phone} type="text" placeholder="số điện thoại"  onChange={(e)=>setPhone(e.target.value)} name="phone" className="form-control" /></div>
        </div>
        <div className="col-12 mt-4 col-md-2">

          <div className="d-grid">
          <button className="btn bsb-btn-xl btn-save-account" type="button" style={{color:"#fff"}} onClick={handleUpdateUser}>Lưu</button></div></div>

      </div>

    </div>
  )
}

export default AccountProfile
