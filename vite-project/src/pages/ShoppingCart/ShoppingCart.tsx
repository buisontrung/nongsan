import { useEffect, useState } from "react";
import NavDrawer from "../../components/AppBar/NavDrawer/NavDrawer";
import Header from "../../components/AppBar/Header/Header";
import Footer from "../../components/AppBar/Footer/Footer";
import BackToTop from "../../components/AppBar/BackTop/BackToTop";
import Contact from "../../components/AppBar/ContactIcon/ContactButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { ShoppingCartType } from "../../utils/IVegetable";
import { APIENDPOINT } from "../../utils/constant";
import { useAuth } from "../../components/Context/useAuth";
import axios from "axios";
import { Link } from "react-router-dom";
import './ShopppingCart.scss'
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
const ShoppingCart = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [cartItems, setCartItems] = useState<ShoppingCartType[]>([]);
    const [cartItemsChecked, setCartItemsChecked] = useState<ShoppingCartType[]>([]);
    const { user } = useAuth();
    const [isAllChecked, setIsAllChecked] = useState<boolean>(false);
    const [checkedItems, setCheckedItems] = useState<boolean[]>([]);
    useEffect(() => {
        const fetchCartItems = async () => {
            if (!user?.id) return;
            const toastId = toast.loading("Đang tải giỏ hàng...");
            try {
                const response = await axios.get(`${APIENDPOINT}/ShoppingCart/api/ShoppingCart/userId=${user?.id}`);
                setCartItems(response.data);
                toast.update(toastId, {
                    render: "Giỏ hàng đã được tải thành công!",
                    type: "success",
                    isLoading: false,
                    autoClose: 3000,
                  });
            } catch (error) {
                toast.update(toastId, {
                    render: "Đã xảy ra lỗi khi tải giỏ hàng!",
                    type: "error",
                    isLoading: false,
                    autoClose: 3000,
                  });
                console.error("Error fetching cart items:", error);
            }
        }
        fetchCartItems();
    }, [user?.id]);

   

    const handleCheckAll = () => {
        const newChecked = !isAllChecked;
        setIsAllChecked(newChecked);
        setCheckedItems(cartItems.map(() => newChecked));
        setCartItemsChecked(newChecked ? cartItems : []);
    };

    const handleCheckItem = (index: number) => {
        const updatedCheckedItems = [...checkedItems];
        updatedCheckedItems[index] = !updatedCheckedItems[index];
        setCheckedItems(updatedCheckedItems);

        setCartItemsChecked((prev) => {
            const updatedItems = [...prev];
            if (updatedCheckedItems[index]) {
                updatedItems.push(cartItems[index]);
            } else {
                const itemIndex = updatedItems.findIndex(item => item.shoppingCart.id === cartItems[index].shoppingCart.id);
                if (itemIndex > -1) updatedItems.splice(itemIndex, 1);
            }
            return updatedItems;
        });
    };

    const handleDeleteSelectedItems = async () => {
        const itemIdsToDelete = cartItems.filter((_, index) => checkedItems[index])
                                          .map(item => item.shoppingCart.id);
        
        try {
            await axios.delete(`${APIENDPOINT}/ShoppingCart/api/ShoppingCart/delete`, {
                data: itemIdsToDelete,
            });
            setCartItems(prevItems => prevItems.filter(item => !itemIdsToDelete.includes(item.shoppingCart.id)));
            setCheckedItems(prevChecked => prevChecked.filter((_, index) => !checkedItems[index]));
        } catch (error) {
            console.error("Error deleting selected items:", error);
        }
    };

    const calculateTotal = (): number => {
        return cartItemsChecked.reduce((total, item) => {
            return total + item.product.productVariantDTOs[0].unitPrice * item.shoppingCart.quantity;
        }, 0);
    };

    const toggleDrawer = () => {
        setIsDrawerOpen(!isDrawerOpen);
    };

    return (
        <>
            <NavDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
            <Header onMenuClick={toggleDrawer} />
            <div className="page-content">
                <section className="h-100 h-custom" style={{ backgroundColor: "#eee" }}>
                    <div className="container py-5 h-100">
                        <div className="row d-flex justify-content-center align-items-center h-100">
                            <div className="col-12">
                                <div className="card">
                                    <div className="card-body p-4">
                                        <div className="row">
                                            <div className="col-lg-7">
                                                <h5 className="mb-3">
                                                    <Link to="#" className="text-body">
                                                        <i className="fas fa-long-arrow-alt-left me-2"></i>Tiếp tục mua sắm
                                                    </Link>
                                                </h5>
                                                <hr />
                                                <div className="d-flex justify-content-between align-items-center mb-4">
                                                    <div className="d-flex">
                                                        <div className="SQGY8I pe-2">
                                                            <label className="stardust-checkbox stardust-checkbox--checked">
                                                        <input
                                                        className="stardust-checkbox__input"
                                                        type="checkbox"
                                                        aria-checked={isAllChecked ? "true" : "false"}
                                                        aria-disabled="false"
                                                        checked={isAllChecked} 
                                                        
                                                        onChange={handleCheckAll}  
                                                    />
                                                                                                            </label>
                                                        </div>
                                                        <div>
                                                            <p className="mb-1">Giỏ Hàng</p>
                                                            <p className="mb-0">Bạn có {cartItems.length} đơn trong giỏ hàng</p>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <p className="mb-0">
                                                            <span className="text-muted">Sắp xếp theo:</span> <Link to="#"
                                                                className="text-body">Giá <FontAwesomeIcon icon={faAngleDown} /></Link>
                                                        </p>
                                                    </div>
                                                </div>
                                                {cartItems.map((item, index) => (
                                                    <div className="d-flex" key={item.shoppingCart.id}>
                                                        <div className="SQGY8I pe-2 mb-3 align-items-center d-flex">
                                                            <label className="stardust-checkbox stardust-checkbox--checked">
                                                                <input className="stardust-checkbox__input" type="checkbox"
                                                                    aria-checked={checkedItems[index]} checked={checkedItems[index]}
                                                                    onChange={() => handleCheckItem(index)} />
                                                            </label>
                                                        </div>
                                                        <div className="card mb-3 flex-grow-1 d-flex flex-column">
                                                            <div className="card-body w-100">
                                                                <div className="d-flex justify-content-between">
                                                                    <div className="d-flex flex-row align-items-center">
                                                                        <div>
                                                                            <img
                                                                                src={APIENDPOINT + "/product/images/" + item.product.imageUrl}
                                                                                className="img-fluid rounded-3"
                                                                                alt="Shopping item"
                                                                                style={{ width: "65px", height: "65px" }} />
                                                                        </div>
                                                                        <div className="ms-3 d-flex" style={{ color: "#86bc42" }}>
                                                                            <h5>{item.product.productName}</h5>
                                                                        </div>
                                                                        <div className="ms-3 d-flex" style={{ color: "#86bc42" }}>
                                                                            <h6>{item.product.productVariantDTOs[0].variantName}</h6>
                                                                        </div>
                                                                    </div>
                                                                    <div className="d-flex flex-row align-items-center">
                                                                        <div className='d-flex'>
                                                                            <button className="btn btn-link px-1">
                                                                                <FontAwesomeIcon icon={faMinus} />
                                                                            </button>
                                                                            <input style={{ width: "40px" }} value={item.shoppingCart.quantity} type="number" className="form-control form-control-sm" />
                                                                            <button className="btn btn-link px-1">
                                                                                <FontAwesomeIcon icon={faPlus} />
                                                                            </button>
                                                                        </div>
                                                                        <div>
                                                                            <h5 className="mb-0 d-inline-block" style={{ fontSize: "1rem", color: "#86bc42" }}>
                                                                                {item.product.productVariantDTOs[0].unitPrice * item.shoppingCart.quantity} VND
                                                                            </h5>
                                                                        </div>

                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div></div>)
                                                )}




                                            </div>
                                            <div className="col-lg-5 h-100">

                                                <div className="card text-white rounded-3">
                                                    <div className="card-body">
                                                        <div className="d-flex justify-content-between align-items-center mb-4">
                                                            <h5 className="mb-0">Thanh Toán</h5>

                                                        </div>




                                                        <hr className="my-4" />

                                                        <div className="d-flex justify-content-between">
                                                            <p className="mb-2">Tiền Hàng</p>
                                                            <p className="mb-2">{calculateTotal()}VND</p>
                                                        </div>

                                                        <div className="d-flex justify-content-between">
                                                            <p className="mb-2">Phí giao hàng</p>
                                                            <p className="mb-2">20000VND</p>
                                                        </div>

                                                        <div className="d-flex justify-content-between mb-4">
                                                            <p className="mb-2">Thành Tiền</p>
                                                            <p className="mb-2">{calculateTotal()+20000}VND</p>
                                                        </div>

                                                        <button type="button" data-mdb-button-init data-mdb-ripple-init className="btn btn-block btn-lg">
                                                            <div className="d-flex justify-content-between">

                                                                <Link to={"/check-out"} state={cartItemsChecked}>Mua Hàng <i className="fas fa-long-arrow-alt-right ms-2"></i></Link>
                                                            </div>
                                                        </button>

                                                    </div>
                                                </div>

                                            </div>

                                        </div>

                                    </div>
                                </div>
                            </div>
                            <div className="col mt-5">
                                <div className="card">
                                    <div className="card-body">
                                        <button  onClick={handleDeleteSelectedItems} className="p-2"style={{backgroundColor:"#86bc42", height:"50px", borderRadius:"10px",color:"#fff"}}> Xóa các mục đã chọn</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <ToastContainer className="custom-toast-container"/>                                    
            </div>
            <Footer />
            <BackToTop />
            <Contact />
        </>
    )
}

export default ShoppingCart
