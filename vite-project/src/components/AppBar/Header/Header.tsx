import { Link } from 'react-router-dom'
import './Header.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faCartShopping, faClock, faEnvelope, faPhone, faSearch } from '@fortawesome/free-solid-svg-icons'
import {  useEffect, useState } from 'react';
import { navArray } from '../../../const/array';
import { useAuth } from '../../../Context/useAuth';

import axios from 'axios';
import { APIENDPOINT } from '../../../configs/constant';
import SearchInput from '../Search/SearchInput';
import { HubConnectionBuilder } from '@microsoft/signalr';
interface HeaderProps {
    onMenuClick: () => void; // Prop được truyền vào là một hàm
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
    const { isAuthenticated, logout,user} = useAuth();
    
    const [isScrolled, setIsScrolled] = useState(false);

    const [cartItems, setCartItems] = useState(0);


    useEffect(() => {
        if (user?.id) {
            const savedCart = localStorage.getItem(`cart_${user?.id}`);
            if (savedCart) {
                setCartItems(JSON.parse(savedCart)); // Retrieve from localStorage if available
            } else {
                fetchCartItems(); // Fetch cart items if not available in localStorage
            }
        }
    }, [user?.id]);
    const fetchCartItems = async () => {
        try {
            const response = await axios.get(`${APIENDPOINT}/ShoppingCart/api/ShoppingCart/userId=${user?.id}`);
            setCartItems(response.data.length);
            localStorage.setItem(`cart_${user?.id}`, JSON.stringify(response.data.length)); // Save to localStorage
        } catch (error) {
            console.error("Error fetching cart items:", error);
        }
    };
    useEffect(() => {
        // Nếu chưa có user.id thì không thực hiện kết nối
        if (!user?.id) return;

        // Khởi tạo kết nối SignalR
        const connection = new HubConnectionBuilder()
            .withUrl('https://localhost:7006/cartHub')
            .withAutomaticReconnect()
            .build();

        // Mở kết nối
        const startConnection = async () => {
            try {
                await connection.start();


                // Gửi yêu cầu tham gia nhóm sau khi kết nối thành công
                await connection.invoke("JoinGroup", user?.id);
   

                // Lắng nghe sự kiện CartUpdated
                connection.on('CartUpdated', (updatedCart) => {
   
                    setCartItems(updatedCart.length); // Cập nhật giỏ hàng
                    localStorage.setItem(`cart_${user?.id}`, JSON.stringify(updatedCart.length));
                });

                // Lắng nghe sự kiện GroupJoined
                connection.on("GroupJoined", () => {

                });
            } catch (err) {
                console.error('Error while starting SignalR connection:', err);
            }
        };

        // Gọi hàm khởi tạo kết nối
        startConnection();

        // Dừng kết nối khi component unmount hoặc user.id thay đổi
        return () => {
            if (connection) {
                connection.stop();
                console.log("SignalR connection stopped");
            }
        };
    }, [user?.id]); // Hook này chỉ chạy lại khi user.id thay đổi
    const handleScroll = () => {
        if (window.scrollY > 100) {
            setIsScrolled(true);
        } else {
            setIsScrolled(false);
        }
    };
    useEffect(() => {
        const checkAuthStatus = async () => {
            // Giả lập quá trình kiểm tra xác thực (nếu cần thiết)
            await new Promise((resolve) => setTimeout(resolve, 300)); // Ví dụ độ trễ 300ms
           
        };
        checkAuthStatus();
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div id='header'>
            <div className="hd-desktop medium--hide small--hide">
                <div className={`hd-top ${isScrolled ? "d-none" : ""}`}>
                    <div className="container mt-3">
                        <div className="row">
                            <div className="grid">
                                <div className="grid__item large--one-half">
                                    <div className="hd-contact">
                                        <Link to={"/#"} className='mx-2'><FontAwesomeIcon icon={faPhone} className='mx-1' />0814656137</Link>
                                        <Link to={"/#"} className='mx-2'><FontAwesomeIcon icon={faEnvelope} className='mx-1' />sontrungtt@gmail.com</Link>
                                        <Link to={"/#"} className='mx-2'><FontAwesomeIcon icon={faClock} className='mx-1' />Mở cửa từ 6:00 - 20:00</Link>


                                    </div>
                                </div>
                                <div className="grid__item large--one-half">
                                    <div className="hdt-account">
                                        {isAuthenticated ? (
                                            <div className='user me-1'>
                                                
                                                <p>{user ? `${user.firstName?.charAt(0)}${user.lastName?.charAt(0)}`: ""}</p>
                                                <div className="user-nav">
                                                    
                                                    <div className='text-center user-infor'>
                                                        <Link to={'/tai-khoan'} style={{color:"#86bc42"}}>Xem thông tin</Link>
                                                    </div>
                                                    <div className='text-center'>
                                                        <button onClick={logout}>Thoát</button>
                                                    </div>
                                                </div>
                                            </div>

                                        ) : (<>
                                            <Link to={"/dang-ki"} className='mx-2'>Đăng ký</Link>
                                            <Link  to={"/dang-nhap"} className='mx-2'>Đăng nhập</Link>
                                            </>)
                                        }


                                    </div>
                                    <div className="desktop-cart-wrapper hdt-cart d-flex align-items-center"><Link to={"/gio-hang"}><FontAwesomeIcon icon={faCartShopping} className='mx-1' /><span>{cartItems}</span></Link>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
                <div className={`hd-center p-4 ${isScrolled ? "hd-fixed pt-0 pb-0" : ""}`}>

                    <header className='header d-flex flex-row container'>
                        <div className={`d-flex w-100 flex-row justify-content-between` }>
                            <div className='search-nav align-items-center d-flex'>
                                    <Link to={"#"}><FontAwesomeIcon icon={faSearch} style={{ fontSize: "1.2rem" }}  className='mx-1' /></Link>
                                    <div className={`ggggg `}><SearchInput/></div>
                                </div>
                            <div className='navbar-left'>

                                <ul className="navbar-main mb-2 mb-lg-0 fs-6">
                                    {navArray.map((navItem, index) => (
                                        <li key={index} className='pt-4 pb-4 px-3'>
                                            <Link to={"/" + navItem.url} state={{ title: navItem.name }} className='fw-bold'>
                                                {navItem.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                                
                                <div className="mt-2 pt-1 ps-3">
                                {isAuthenticated && isScrolled ?  (
                                    <div className='d-flex'>
                                            <div className='user me-1'>
                                                
                                                <p>{user ? `${user.firstName?.charAt(0)}${user.lastName?.charAt(0)}` : ""}</p>
                                                <div className="user-nav">
                                                    
                                                    <div className='text-center user-infor'>
                                                        <button>Xem thông tin</button>
                                                    </div>
                                                    <div className='text-center'>
                                                        <button onClick={logout}>Thoát</button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="desktop-cart-wrapper hdt-cart d-flex align-items-center"><Link to={"/gio-hang"}><FontAwesomeIcon icon={faCartShopping} className='mx-1' /><span>{cartItems}</span></Link>
                                            </div>
                                    </div>
                                        ) : (<>
                                           
                                            </>)
                                        }
                                </div>
                            </div>
                        </div>
                    </header>
                </div>
            </div>
            <div className='container mobile-header large--hide pt-2'>

                <div className="d-flex justify-content-between">
                    <div className='grid__item medium--one-third'>
                        <div className='hd-logo text-left'>
                            <img src="logo.png" alt="" />
                        </div>
                    </div>

                    <div className='grid__item large--two-twelfths push--large--eight-twelfths medium--two-thirds clearfix text-right align-items-center'>
                        <Link to="#" onClick={onMenuClick}> <span>Menu</span><FontAwesomeIcon icon={faBars} className='mx-1' /></Link>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Header
