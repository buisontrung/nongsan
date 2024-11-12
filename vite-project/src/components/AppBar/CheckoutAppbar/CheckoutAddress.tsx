import { faAddressCard, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuth } from "../../Context/useAuth";
import { useEffect, useState } from "react";
import { Address, ListProvince } from "../../../utils/IVegetable";
import axios from "axios";
import { APIENDPOINT } from "../../../utils/constant";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
const CheckoutAddress = () => {
    const { user } = useAuth();
    const [address, setAddress] = useState<Address[]>([]);
    const [primaryAddress, setPrimaryAddress] = useState<Address | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [step, setStep] = useState<number>(0);
    const [stepProvince, setStepProvince] = useState<number>(0);
    const [provinces, setProvinces] = useState<ListProvince | undefined>();
    const [districts, setDistricts] = useState<ListProvince | undefined>()
    const [wards, setWards] = useState<ListProvince | undefined>()
    const [selected, setSelected] = useState<number>();
    const [text, setText] = useState("");
    const [addressName,setAddressName] = useState("")
    const [userNameAddress,setUserNameAddress] = useState("")
    const [phoneNumberAddress,setPhoneNumberAddress] = useState("")
    const [selectedValue, setSelectedValue] = useState<boolean>(false);
    useEffect(() => {
        const fetchAddresses = async () => {
            if (user?.id) {
                try {
                    const [primaryRes, addressRes, provincesRes] = await Promise.all([
                        axios.get(`${APIENDPOINT}/auth/api/Address/userprimary/${user.id}`),
                        axios.get(`${APIENDPOINT}/auth/api/Address/user/${user.id}`),
                        axios.get('https://open.oapi.vn/location/provinces?page=0&size=63'),
                    ]);
                    setPrimaryAddress(primaryRes.data);
                    setAddress(addressRes.data);
                    setSelected(primaryRes.data.id)
                    setProvinces(provincesRes.data);
                } catch (error) {
                    console.error(error);
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
            }
        };

        fetchAddresses();
    }, [user?.id]);
    const handleDistricts = async (id: string) => {
        try {
            const response = await axios.get(`https://open.oapi.vn/location/districts/${id}`);
            setDistricts(response.data)
        } catch (error) {
            console.error("Lỗi khi gọi API:", error);
        }
    };
    const handleWards = async (id: string) => {
        try {
            const response = await axios.get(`https://open.oapi.vn/location/wards/${id}`);
            setWards(response.data)
        } catch (error) {
            console.error("Lỗi khi gọi API:", error);
        }
    };

    const handleAddNewAddress = async () => {
        
        try {
            const value = text.split(", ");
            
            // Gửi yêu cầu API
            const res = await axios.post(`${APIENDPOINT}/auth/api/Address/add`, {
                id: 0,
                userId: user?.id,
                isPrimary: selectedValue,
                addressName: addressName,
                userNameAddress: userNameAddress,
                phoneNumberAddress: phoneNumberAddress,
                city: value[0],
                district: value[1],
                wardsCommunes: value[2]
            });
            
            // Kiểm tra dữ liệu trả về
            if (res && res.data) {
                // Cập nhật địa chỉ chính nếu cần
                if (selectedValue) {
                    setPrimaryAddress(res.data);
                    setSelected(res.data.id);
                    console.log("Primary Address:", res.data); // Kiểm tra dữ liệu
                }
                
                // Cập nhật danh sách địa chỉ
                setAddress(prev => [...prev, res.data]);
            }
        
            // Cập nhật bước sau khi thêm địa chỉ thành công
            setStep(1);
            toast.success("Thêm địa chỉ thành công!");
        
        } catch (error) {
            // Xử lý lỗi
            console.error("Failed to update primary address", error);
            toast.error("Thêm địa chỉ thất bại!");
        }
        
            setStep(1); // Đóng cửa sổ nếu không có thay đổi
        
    };
    const handleConfirm = async () => {
        if (selected && selected !== primaryAddress?.id) {
            try {
                await axios.put(`${APIENDPOINT}/auth/api/Address/updateprimary/userId=${user?.id}&Id=${selected}`)
                    .then(res => {
                        setPrimaryAddress(res.data);
                    })
                setStep(0);
                toast.success("Cập nhật địa chỉ thành công!",)
            } catch (error) {
                console.error("Failed to update primary address", error);
                toast.error("Cập nhật địa chỉ chính thất bại!");
            }
        } else {
            setStep(0); // Đóng cửa sổ nếu không có thay đổi
        }
    };
    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <div className="m6A2B1">
                <div className="p-4">
                    <div className="SvK9MH">
                        <div className="d-flex align-items-end mb-3">
                            <div className="me-2 h-100">
                                <FontAwesomeIcon icon={faAddressCard} />
                            </div>
                            <h2 className="mb-0" style={{ fontSize: "28px" }}>
                                Địa chỉ nhận hàng
                            </h2>
                        </div>
                    </div>
                    <div className="d-flex">
                        <div className="y0jyrJ">
                            {address.length > 0 ? (
                                <div className="d-flex">
                                    <div className="PzGLCh">
                                        {primaryAddress?.userNameAddress} {primaryAddress?.phoneNumberAddress}
                                    </div>
                                    <div className="a9c4OR">
                                        {primaryAddress?.addressName +
                                            ", " +
                                            primaryAddress?.wardsCommunes +
                                            ", " +
                                            primaryAddress?.district +
                                            ", " +
                                            primaryAddress?.city}
                                    </div>
                                    <div className="dIzOca">Mặc định</div>
                                </div>
                            ) : (
                                <div className="a9c4OR">Không có địa chỉ nào được thiết lập.</div>
                            )}
                        </div>
                        <button className="VNkBIJ div-style" onClick={() => setStep(1)}>Thay đổi</button>
                    </div>
                </div>
            </div>
            {step && (
                <div>
                    <div className="checkout-address">
                        <div className="checkout-address-bg"></div>
                        <div className=" address-options">
                            {step == 1 && (<><div className="px-4 pt-3 pb-3 address-title">
                                <h3 style={{ color: "#615f5f" }}>Địa chỉ của tôi</h3>
                            </div>
                                <div className="pb-3 px-4 abcdz">
                                    {address.map((item) => (
                                        <div key={item.id} className="d-flex pt-3" style={{ borderBottom: "1px solid #dfdddd" }}>
                                            <div className="me-3">
                                                <input
                                                    type="checkbox"
                                                    checked={selected === item.id}
                                                    onChange={() => setSelected(item.id)}
                                                />
                                            </div>
                                            <div className="address">
                                                <div className="d-flex justify-content-between">
                                                    <div className="d-flex ">
                                                        <span>{item.userNameAddress}</span>
                                                        <div className="ddd"></div>
                                                        <span className="address-grey">{item.phoneNumberAddress}</span>
                                                    </div>
                                                    <div>
                                                        <button className="oOGEkQ">Cập nhật</button>
                                                    </div>
                                                </div>
                                                <div className="mt-1">
                                                    <div className="address-grey">
                                                        {item.userNameAddress}
                                                    </div>
                                                    <div className="address-grey">
                                                        {item?.addressName +
                                                            ", " +
                                                            item?.wardsCommunes +
                                                            ", " +
                                                            item?.district +
                                                            ", " +
                                                            item?.city}
                                                    </div>
                                                </div>
                                                <div className="mt-2 mb-4">
                                                    <span className="span-address-btn span-default">Mặc định</span>
                                                    <span className="span-address-btn address-grey">Địa chỉ lấy hàng</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <button className="btn-add-address" onClick={() => setStep(2)}>
                                        <FontAwesomeIcon icon={faPlus} /> Thêm Địa Chỉ Mới
                                    </button>
                                </div>
                                <div className="address-submit">
                                    <button className="btn-address-cancle" onClick={() => { setStep(0); setSelected(primaryAddress?.id) }}>Hủy</button>
                                    <button className="btn-address-submit" onClick={handleConfirm}>Xác Nhận</button>
                                </div></>)}
                            {step == 2 && (
                                <>
                                    <div className="px-4 pt-3 pb-3 address-title">
                                        <h3 style={{ color: "#615f5f" }}>Địa chỉ mới</h3>
                                    </div>
                                    <div className="pb-3 px-4 d-flex flex-wrap address-content">
                                        <div className="col-12 d-flex">
                                            <div className="col-5 mt-4">
                                                <input type="text" placeholder="Tên" className="w-100 px-3 pt-1 pb-1" onChange={(e)=>{setUserNameAddress(e.target.value)}}/>
                                            </div>
                                            <div className="col-2 mt-4">

                                            </div>
                                            <div className="col-5 mt-4">
                                                <input type="text" placeholder="Số điện thoại" className="w-100 px-3 pt-1 pb-1" 
                                                onChange={(e)=>{setPhoneNumberAddress(e.target.value)}}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-12 mt-4">
                                            <input type="text" placeholder="Tỉnh/ Thành phố, Quận/Huyện, Phường/Xã" className="w-100 px-3 pt-1 pb-1"
                                                onFocus={() => setStepProvince(1)}
                                                value={text || ""}
                                                onChange={(e) => setText(e.target.value)} onBlur={() => setStepProvince(0)}
                                            />
                                        </div>
                                        <div className="w-100">
                                            <div className="col-12 mt-4">
                                                <input type="text" placeholder="Địa chỉ cụ thể" className="w-100 px-3 pt-1 pb-3"
                                                onChange={(e)=>{setAddressName(e.target.value)}}
                                                />
                                            </div>

                                            <div className="province-list col-12">

                                                <div className={`mt-4 d-flex ${stepProvince != 0 ? "" : "d-none"}`} style={{ border: "1px solid #333" }}>
                                                    <div className="col-4 text-center pt-3 pb-3">Tỉnh/Thành phố</div>
                                                    <div className="col-4 text-center pt-3 pb-3">Quận/Huyện</div>
                                                    <div className="col-4 text-center pt-3 pb-3">Phường/Xã</div>
                                                </div>


                                                {stepProvince === 1 && provinces && (
                                                    <div>
                                                        {provinces.data.map((province) => (
                                                            <div
                                                                className="text-start province-item"
                                                                key={province.id}
                                                                onMouseDown={() => {
                                                                    setText(province.name);
                                                                    setTimeout(() => { setStepProvince(2) })
                                                                    handleDistricts(province.id);
                                                                }}
                                                            >
                                                                {province.name}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                {stepProvince === 2 && districts && (
                                                    <div>
                                                        {districts.data.map((district) => (
                                                            <div className="text-start province-item" key={district.id} onMouseDown={() => {
                                                                setText((prev) => prev + ', ' + district.name);
                                                                handleWards(district.id)
                                                                setTimeout(() => {
                                                                    setStepProvince(3);
                                                                }, 0);
                                                            }}>
                                                                {district.name}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                                {stepProvince === 3 && wards && (
                                                    <div>
                                                        {wards.data.map((ward) => (
                                                            <div className="text-start province-item" key={ward.id} onMouseDown={() => {
                                                                setText((prev) => prev + ', ' + ward.name);
                                                                handleWards(ward.id)

                                                            }}>
                                                                {ward.name}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>


                                        </div>
                                        <div className="col-12 mt-3">
                                            <input
                                                type="radio"
                                                
                                                checked={selectedValue}
                                                onClick={() => setSelectedValue(!selectedValue)}
                                            />
                                            <span className="ms-2 address-grey">Đặt làm địa chỉ mặc định</span>
                                        </div>
                                    </div>
                                    <div className="address-submit">
                                        <button className="btn-address-cancle" onClick={() => { setStep(1) }}>Trở lại</button>
                                        <button className="btn-address-submit" onClick={handleAddNewAddress}>Hoàn thành</button>
                                    </div>
                                </>
                            )}


                        </div>
                    </div>
                </div>
            )}
            <ToastContainer
                autoClose={2000} toastClassName="custom-toast-container"
            />
        </>
    );
};

export default CheckoutAddress;
