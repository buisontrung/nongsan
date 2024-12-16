import { faPlus } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useState } from "react";
import { Address} from "../../utils/IVegetable";
import axios from "axios";
import { useAuth } from "../../components/Context/useAuth";
import { toast } from "react-toastify";
import { APIENDPOINT } from "../../utils/constant";


const AccountAddress = () => {
    const [address, setAddress] = useState<Address[]>([]);
    const { user } = useAuth();
    useEffect(() => {
        const fetchAddresses = async () => {
            if (user?.id) {
                try {
                    const [addressRes] = await Promise.all([
                        axios.get(`${APIENDPOINT}/auth/api/Address/user/${user.id}`),

                    ]);

                    setAddress(addressRes.data);


                } catch (error) {
                    console.error(error);
                }
            }
        };

        fetchAddresses();
    }, [user?.id]);

    const handleConfirm = async (id:number) => {
        
            try {
                await axios.put(`${APIENDPOINT}/auth/api/Address/updateprimary/userId=${user?.id}&Id=${id}`)
                    .then(() => {
                        setAddress(prevAddresses =>
                            prevAddresses.map(address =>
                                address.id === id
                                    ? { ...address, isPrimary: true }
                                    : { ...address, isPrimary: false } 
                            )
                        );
                    })

                toast.success("Cập nhật địa chỉ thành công!",)
            } catch (error) {
                console.error("Failed to update primary address", error);
                toast.error("Cập nhật địa chỉ chính thất bại!");
            }
        
    };
    return (
        <div className="container h-100 px-4" style={{ backgroundColor: "#fff" }}>
            <div className="pt-3 pb-3 d-flex justify-content-between " style={{ borderBottom: "1px solid #dfdddd" }}>
                <h4 className="mb-0">Địa chỉ của tôi</h4>
                <button className="btn-save-account p-2 px-3"><FontAwesomeIcon icon={faPlus} /> Thêm địa chỉ mới</button>
            </div>
            <div className="pt-4 mt-3 d-flex flex-wrap justify-content-between">

                <h4 className="">Địa chỉ</h4>
                {address.map(item => (
                    <div className="col-12 mt-4">
                        <div className="d-flex justify-content-between">
                            <div className="d-flex">
                                <span>{item.userNameAddress}</span>
                                <div className="ddd"></div>
                                <span className="address-grey">{item.phoneNumberAddress}</span>
                            </div>
                            <button className="oOGEkQ" style={{color:"blue"}}>Cập nhật</button>
                        </div>
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                            <div className="address-grey">
                                {item?.addressName}
                            </div>
                            <div className="address-grey">
                                {item?.wardsCommunes +", " +item?.district +", " +item?.city}
                            </div>
                            </div>
                            <button className={`btn-save-account1 p-1 px-2 textaddress ${item.isPrimary?"border-account":""}`} onClick={!item.isPrimary?()=> handleConfirm(item.id): undefined}>Thiết lập mặc định</button>
                        </div>
                        {item.isPrimary? <div className="mt-2 mb-4">
                            <span className="span-address-btn span-default">Mặc định</span>
                            <span className="span-address-btn address-grey">Địa chỉ lấy hàng</span>
                        </div>:""}
                    </div>
                ))}


            </div>

        </div>
    )
}

export default AccountAddress
