import { Link } from "react-router-dom";
import { useAuth } from "../../components/Context/useAuth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faUser } from "@fortawesome/free-solid-svg-icons";


const AccountNav = () => {
    const { user } = useAuth();
    return (
        <div style={{minHeight:"550px"}}>
            <div className="d-flex pt-3" >
                <div className="user">
                    <img src="logo_11.png" style={{ height: "50px", width: "50px" }} alt="" />
                </div>
                <div className="ms-3 flex-grow-1 mb-3">
                    <div className="mb-0 mx-auto mb-1">{`${user?.firstName + " " + user?.lastName}`}</div>
                    <div className="mb-0 mx-auto">Chỉnh sửa hồ sơ</div>
                </div>
            </div>
            <div className="mt-4 pt-3">
                <div>
                    <div className="user-active">
                        <div className="d-flex"><div className="col-1"><FontAwesomeIcon icon={faUser} style={{fontSize:"22px", color:"#86bc42"}}/></div><span className="ms-2 fw-bold">Tài khoản của tôi</span></div>
                        <div className="ps-4">
                            <div className="col-1">

                            </div>
                            <div className="ms-2 mt-2 d-flex flex-column">
                            <Link to="profile" className="mb-2">Hồ sơ</Link>
                            <Link to="dia-chi" className="mb-2">Địa Chỉ</Link>
                            <Link to="/profile" className="mb-2">Đổi mật khẩu</Link>
                            <Link to="/profile" className="mb-2">Xóa account</Link>
                            </div>
                        </div>
                        <div className="d-flex"><div className="col-1"><FontAwesomeIcon icon={faBars} style={{fontSize:"22px", color:"#86bc42"}}/></div><Link to='don-hang'className="ms-2 fw-bold">Đơn Mua</Link></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AccountNav
