import { useEffect, useState } from "react";
import NavDrawer from "../../components/AppBar/NavDrawer/NavDrawer";
import Header from "../../components/AppBar/Header/Header";
import Footer from "../../components/AppBar/Footer/Footer";
import BackToTop from "../../components/AppBar/BackTop/BackToTop";
import Contact from "../../components/AppBar/ContactIcon/ContactButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { ShoppingCartType } from "../../utils/IVegetable";
import { APIENDPOINT, formatPrice } from "../../utils/constant";
import axios from "axios";
import { Link } from "react-router-dom";
import './ShopppingCart.scss'

import 'react-toastify/dist/ReactToastify.css';
import { HubConnectionBuilder } from "@microsoft/signalr";
type User = {
    id: string
}
const ShoppingCart = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [cartItems, setCartItems] = useState<ShoppingCartType[]>([]);
    const [cartItemsChecked, setCartItemsChecked] = useState<ShoppingCartType[]>([]);
    const [isAllChecked, setIsAllChecked] = useState<boolean>(false);
    const [checkedItems, setCheckedItems] = useState<boolean[]>([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const user: User | null = (() => {
        const userData = sessionStorage.getItem('user');
        return userData ? JSON.parse(userData) as User : null;
      })();


  
    useEffect(() => {
        const fetchCartItems = async () => {
            if (!user?.id) { setCartItems([]) };
            setIsLoading(true); 
            try {
                const response = await axios.get(`${APIENDPOINT}/ShoppingCart/api/ShoppingCart/userId=${user?.id}`);
                setCartItems(response.data);
               
            } catch (error) {
                
                console.error("Error fetching cart items:", error);
            }
            finally {
                setIsLoading(false); // Kết thúc loading
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
    const updateTotalPrice = (updatedItems: ShoppingCartType[]) => {
        const newTotal = updatedItems.reduce((total, item) => {
            return total + item.product.productVariantDTOs[0].unitPrice * item.shoppingCart.quantity;
        }, 0);
        setTotalPrice(newTotal);
    };
    const handleDeleteSelectedItems = () => {
        // Lọc ra các ID của các items đã chọn
        const itemIdsToDelete = cartItems.filter((_, index) => checkedItems[index])
            .map(item => item.shoppingCart.id);

        try {
            // Xóa các items đã chọn từ API
            axios.delete(`${APIENDPOINT}/ShoppingCart/api/ShoppingCart/delete`, {
                data: itemIdsToDelete,
            }).then(async () => {
                const newConnection = new HubConnectionBuilder()
                    .withUrl("https://localhost:7006/cartHub")
                    .withAutomaticReconnect()
                    .build();

                try {
                    await newConnection.start(); // Bắt đầu kết nối

                    if (newConnection.state === "Connected") {
                        await newConnection.invoke("NotifyCartUpdate", user?.id); // Gửi sự kiện
                        setCartItems(prevItems => prevItems.filter(item => !itemIdsToDelete.includes(item.shoppingCart.id)));

                        // Cập nhật lại checkedItems để đảm bảo rằng các checkbox không bị chọn sau khi xóa
                        setCheckedItems(prevCheckedItems =>
                            prevCheckedItems.filter((_, index) => !itemIdsToDelete.includes(cartItems[index]?.shoppingCart.id))
                        );
                        setCartItemsChecked([]);
                        alert("thành công")
                    }
                } catch (error) {
                    console.error("Lỗi khi gửi thông báo:", error);
                } finally {
                    await newConnection.stop(); // Đảm bảo kết nối luôn được đóng
                    console.log("Kết nối đã được đóng.");
                }
            }



            );

            // Cập nhật lại cartItems sau khi xóa





        } catch (error) {
            console.error("Error deleting selected items:", error);
        }
    };


    useEffect(() => {
        // Hàm tính tổng giá trị
        const calculateTotal = (): number => {
            return cartItemsChecked.reduce((total, item) => {
                return total + item.product.productVariantDTOs[0].unitPrice * item.shoppingCart.quantity;
            }, 0);
        };

        // Tính toán tổng và cập nhật vào state
        setTotalPrice(calculateTotal());
    }, [cartItemsChecked]);

    const toggleDrawer = () => {
        setIsDrawerOpen(!isDrawerOpen);
    };
    const handleIncreaseQuantity = (index: number) => {
        setCartItems((prevItems) => {
            const updatedItems = [...prevItems];
            const maxQuantity = updatedItems[index].product.productVariantDTOs[0].productInventorySuppliers[0].quantity;

            if (updatedItems[index].shoppingCart.quantity >= maxQuantity) {
                alert("Số lượng vượt quá giới hạn cho phép!");
                return updatedItems;
            } else {
                updatedItems[index].shoppingCart.quantity += 1;
                axios
                    .put(`${APIENDPOINT}/shoppingcart/api/shoppingcart/update`, {
                        quantity: updatedItems[index].shoppingCart.quantity,
                        id:updatedItems[index].shoppingCart.id,
                        userId:updatedItems[index].shoppingCart.userId,
                        productVarianId:updatedItems[index].shoppingCart.productVarianId,
                        price:updatedItems[index].shoppingCart.price,
                        created:updatedItems[index].shoppingCart.created
                    })
                    .catch((error) => {
                        console.error("Lỗi khi cập nhật số lượng sản phẩm:", error);
                        // Nếu API lỗi, khôi phục số lượng cũ
                        setCartItems((restoredItems) => {
                            const rolledBackItems = [...restoredItems];
                            rolledBackItems[index].shoppingCart.quantity -= 1;
                            updateTotalPrice(rolledBackItems); // Cập nhật lại tổng giá
                            return rolledBackItems;
                        });
                    });
                    updateTotalPrice(updatedItems)
            }

           
            
            return updatedItems;
        });
        
    };

    const handleDecreaseQuantity = (index: number) => {
        setCartItems((prevItems) => {
            const updatedItems = [...prevItems];
            if (updatedItems[index].shoppingCart.quantity > 1) {
                updatedItems[index].shoppingCart.quantity -= 1;
                axios
                    .put(`${APIENDPOINT}/shoppingcart/api/shoppingcart/update`, {
                        quantity: updatedItems[index].shoppingCart.quantity,
                        id:updatedItems[index].shoppingCart.id,
                        userId:updatedItems[index].shoppingCart.userId,
                        productVarianId:updatedItems[index].shoppingCart.productVarianId,
                        price:updatedItems[index].shoppingCart.price,
                        created:updatedItems[index].shoppingCart.created
                    })
                    .catch((error) => {
                        console.error("Lỗi khi cập nhật số lượng sản phẩm:", error);
                        // Nếu API lỗi, khôi phục số lượng cũ
                        setCartItems((restoredItems) => {
                            const rolledBackItems = [...restoredItems];
                            rolledBackItems[index].shoppingCart.quantity += 1;
                            updateTotalPrice(rolledBackItems); // Cập nhật lại tổng giá
                            return rolledBackItems;
                        });
                    });
                updateTotalPrice(updatedItems)
            }


            return updatedItems;
        });




    };
    
    return isLoading ? (
        <div className="loading-spinner">
            <p>Đang tải...</p>
        </div>
    ) : (
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
                                        <div className="row d-flex">
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
                                                            <p className="mb-0">Bạn có {cartItems.length} sản phẩm trong giỏ hàng</p>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <p className="mb-0">
                                                            <span className="text-muted">Sắp xếp theo:</span>{" "}
                                                            <Link to="#" className="text-body">
                                                                Giá <FontAwesomeIcon icon={faAngleDown} />
                                                            </Link>
                                                        </p>
                                                    </div>
                                                </div>
                                                {cartItems.map((item, index) => (
                                                    <div className="d-flex" key={item.shoppingCart.id}>
                                                        <div className="SQGY8I pe-2 mb-3 align-items-center d-flex">
                                                            <label className="stardust-checkbox stardust-checkbox--checked">
                                                                <input
                                                                    className="stardust-checkbox__input"
                                                                    type="checkbox"
                                                                    aria-checked={checkedItems[index]}
                                                                    checked={checkedItems[index]}
                                                                    onChange={() => handleCheckItem(index)}
                                                                />
                                                            </label>
                                                        </div>
                                                        <div className="card mb-3 flex-grow-1 d-flex flex-column">
                                                            <div className="card-body w-100">
                                                                <div className="d-flex justify-content-between">
                                                                    <div className="d-flex flex-row align-items-center col-6">
                                                                        <div>
                                                                            <img
                                                                                src={`${APIENDPOINT}/product/images/${item.product.imageUrl}`}
                                                                                className="img-fluid rounded-3"
                                                                                alt="Shopping item"
                                                                                style={{ width: "65px", height: "65px" }}
                                                                            />
                                                                        </div>
                                                                        <div className="ms-3 d-flex" style={{ color: "#86bc42" }}>
                                                                            <h5>{item.product.productName}</h5>
                                                                        </div>
                                                                        <div className="ms-3 d-flex" style={{ color: "#86bc42" }}>
                                                                            <h6>{item.product.productVariantDTOs[0].variantName}</h6>
                                                                        </div>
                                                                    </div>
                                                                    <div className="d-flex flex-row align-items-center justify-content-between col-4">
                                                                        <div className="d-flex">
                                                                            <button className="btn btn-link px-1">
                                                                                <FontAwesomeIcon icon={faMinus} onClick={() => handleDecreaseQuantity(index)} />
                                                                            </button>
                                                                            <input
                                                                                style={{ width: "50px" }}
                                                                                value={item.shoppingCart.quantity}
                                                                                type="number"
                                                                                className="form-control form-control-sm"
                                                                            />
                                                                            <button className="btn btn-link px-1">
                                                                                <FontAwesomeIcon icon={faPlus} onClick={() => handleIncreaseQuantity(index)} />
                                                                            </button>
                                                                        </div>
                                                                        <div>
                                                                            <h5 className="mb-0 d-inline-block" style={{ fontSize: "1rem", color: "#86bc42" }}>
                                                                                {formatPrice(item.shoppingCart.price, item.shoppingCart.quantity)} VND
                                                                            </h5>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="col-lg-5">
                                                <div className="card text-white rounded-3 h-100">
                                                    <div className="card-body">
                                                        <div className="d-flex justify-content-between align-items-center mb-4">
                                                            <h5 className="mb-0">Thanh Toán</h5>
                                                        </div>
                                                        <hr className="my-4" />
                                                        <div className="d-flex justify-content-between">
                                                            <p className="mb-2">Tiền Hàng</p>
                                                            <p className="mb-2">{formatPrice(totalPrice, 0)}VND</p>
                                                        </div>
                                                        <div className="d-flex justify-content-between">
                                                            <p className="mb-2">Phí giao hàng</p>
                                                            <p className="mb-2">20.000VND</p>
                                                        </div>
                                                        <div className="d-flex justify-content-between mb-4">
                                                            <p className="mb-2">Thành Tiền</p>
                                                            <p className="mb-2">{formatPrice(totalPrice + 20000, 0)}VND</p>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            style={{ borderRadius: "2px" }}
                                                            className="btn btn-block btn-lg"
                                                        >
                                                            <div className="d-flex justify-content-between">
                                                                <Link
                                                                    to={"/check-out"}
                                                                    state={{
                                                                        cartItemsChecked,
                                                                        totalPrice,
                                                                    }}
                                                                >
                                                                    Mua Hàng
                                                                    <i className="fas fa-long-arrow-alt-right ms-2"></i>
                                                                </Link>
                                                            </div>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col mt-5">
                                    <div className="card">
                                        <div className="card-body d-flex justify-content-between">
                                            <button
                                                onClick={handleDeleteSelectedItems}
                                                className="p-2"
                                                style={{ backgroundColor: "#86bc42", height: "50px", borderRadius: "2px", color: "#fff" }}
                                            >
                                                Xóa các mục đã chọn
                                            </button>
                                            <Link to="/danh-muc-san-pham">
                                                <button
                                                    className="p-2"
                                                    style={{ backgroundColor: "#86bc42", height: "50px", borderRadius: "2px", color: "#fff" }}
                                                >
                                                    Tiếp tục mua hàng
                                                </button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            <Footer />
            <BackToTop />
            <Contact />
        </>
    );
    
}

export default ShoppingCart
