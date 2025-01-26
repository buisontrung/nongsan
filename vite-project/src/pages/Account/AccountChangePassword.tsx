import { faEyeSlash } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import axios  from "axios";
import { useState } from "react"
import { APIENDPOINT } from "../../configs/constant";
import { useAuth } from "../../Context/useAuth";
import Swal from "sweetalert2";



const AccountChangePassword = () => {
    const {user}= useAuth();
    const [isfocus,setIsfocus]= useState(0);
    const [showPasswordOld, setShowPasswordOld] = useState(false);
    const [showPasswordNew, setShowPasswordNew] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
    const [oldpw,setOldpw] = useState("");
    const [newpw,setNewpw] = useState("");
    const [confirmpw,setConfirmpw] = useState("");
    const [checkconfirm,setCheckconfirm] = useState(false);
    const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const confirmPassword = e.target.value;
        setConfirmpw(confirmPassword);
        if(newpw !== confirmPassword){
            setCheckconfirm(true)
        }else{
            setCheckconfirm(false)
        }
      };
      const handleChangePassword = async () => {
        // Kiểm tra nếu mật khẩu xác nhận không khớp thì không thực hiện gì
        
        if (checkconfirm) {
            return; // Nếu mật khẩu không khớp, không gọi API
        }
    
        try {
            // Gửi yêu cầu đổi mật khẩu tới API
            const res = await axios.post(`${APIENDPOINT}/auth/api/auth/changepassword?userId=${user?.id}&currentPassword=${oldpw}&newPassword=${newpw}`);
    
             Swal.fire({
                      position: "center",
                      icon: "success",
                      title: res.data,
                      showConfirmButton: false,
                      timer: 1500
                    });
            console.log(res.data);
            // Có thể thực hiện các thao tác sau khi đổi mật khẩu thành công
        } catch (error) {
            // Kiểm tra nếu có phản hồi từ server (error.response)
                console.log(error)
                // Lấy thông báo lỗi từ response và hiển thị bằng SweetAlert
                const errorMessage = "Mật khẩu không đúng"; // Lấy message nếu có, hoặc thông báo mặc định
                Swal.fire({
                    position: "center",
                    icon: "error",
                    title: errorMessage,
                    showConfirmButton: false,
                    timer: 1500
                });
            
        }
    };
    
  return (
    <div className="container px-4" style={{ backgroundColor: "#fff",minHeight:"580px" }}>
        <div className="pt-3 pb-3" style={{ borderBottom: "1px solid #dfdddd" }}>
            <h4>Đổi mật khẩu</h4>
            <div>Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người khác</div>
        </div>
        <div className="pt-3 d-flex flex-column align-items-center">
            <div className="d-flex mt-3">
                <div className="d-flex align-items-center me-3" style={{width:"150px"}}><label htmlFor="oldpassword" className="m-0">Mật khẩu cũ</label></div>
                <div className={`d-flex YxyuDT ${isfocus===1?"JKL":""}`} >
                    <input value={oldpw} onChange={(e)=> setOldpw(e.target.value)} type={`${showPasswordOld?"text":"password"}`} onFocus={()=>setIsfocus(1)} onBlur={()=>setIsfocus(0)}  className="p-2 changepassword" style={{flex:"1",border:"0",outline:"none"}}  maxLength={16} />
                    <button className="mx-2"style={{background:"#fff"}}><FontAwesomeIcon className={`${showPasswordOld?"UIO":""}`} onClick={()=>setShowPasswordOld(!showPasswordOld)} icon={faEyeSlash}/></button>
                </div>
            </div>
            <div className="d-flex mt-3">
                <div className="d-flex align-items-center me-3" style={{width:"150px"}}><label htmlFor="oldpassword" className="m-0">Mật khẩu mới</label></div>
                <div className={`d-flex YxyuDT ${isfocus===2?"JKL":""}`}  >
                    <input value={newpw} onChange={(e)=> setNewpw(e.target.value)} type={`${showPasswordNew?"text":"password"}`} onFocus={()=>setIsfocus(2)} onBlur={()=>setIsfocus(0)} className="p-2 changepassword" style={{flex:"1",border:"0",outline:"none"}}  maxLength={16} />
                    <button className="mx-2"style={{background:"#fff"}}><FontAwesomeIcon icon={faEyeSlash} className={`${showPasswordNew?"UIO":""}`} onClick={()=>setShowPasswordNew(!showPasswordNew)}/></button>
                </div>
            </div>
            <div className="mt-3">
                <div className="d-flex">
                <div className="d-flex align-items-center me-3" style={{width:"150px"}}><label htmlFor="oldpassword" className="m-0">Xác nhận mật khẩu</label></div>
                <div className={`d-flex YxyuDT ${isfocus===3?"JKL":""}`} >
                    <input value={confirmpw} onChange={(e)=> handleConfirmPasswordChange(e)} onFocus={()=>setIsfocus(3)} onBlur={()=>setIsfocus(0)} type={`${showPasswordConfirm?"text":"password"}`} className="p-2 changepassword" style={{flex:"1",border:"0",outline:"none"}}  maxLength={16} />
                    <button className="mx-2"style={{background:"#fff"}}><FontAwesomeIcon className={`${showPasswordConfirm?"UIO":""}`} icon={faEyeSlash} onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}/></button>
                    
                </div>
                </div>
                {checkconfirm && confirmpw && (
                <div className="d-flex"><div className="me-3" style={{width:"150px"}}></div> <small  className="ms-2"style={{ color: 'red' }}>Mật khẩu không trùng khớp.</small></div>
      )}
            </div>
           
            <div className="d-flex m-3 ">
                <div className="me-3" style={{width:"150px"}}></div>
                    
                    <div className="d-flex justify-content-end" style={{minWidth:"400px"}}>
                    <button className="pt-1 pb-1 px-3 CVB" onClick={handleChangePassword}>Lưu</button>
                    </div>
                
            </div>
        </div>
    </div>
  )
}

export default AccountChangePassword
