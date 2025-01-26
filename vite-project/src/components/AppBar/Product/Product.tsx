import axios from "axios"
import { useEffect, useMemo, useState } from "react"
import { APIENDPOINT, formatPrice } from "../../../configs/constant"
import { Product, RatingCount, Review, ShoppingCartItem } from "../../../utils/IVegetable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {  faShoppingCart, faStar } from "@fortawesome/free-solid-svg-icons";
import Slider from "react-slick";
import { Link, useParams } from "react-router-dom";
// import { useCart } from "../../Context/useCartOverlay";
import { useAuth } from "../../../Context/useAuth";
import { HubConnectionBuilder } from "@microsoft/signalr";
import axiosInstance from "../../../utils/axiosInstance";

import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";






const Product1 = () => {

    // const { addToCart} = useCart()

    const [product, setProduct] = useState<Product>();
    const { user } = useAuth();
    const [recommend, setRecommend] = useState<Product[]>([]);
    const [recommend1, setRecommend1] = useState<Product[]>([]);
    const [choose, setChoose] = useState<number | undefined>();
    const [tab, setTab] = useState(1);
    const [ratingcount,setRatingcout]=useState<RatingCount[]>();
    const params = useParams<{ id: string | undefined }>();
    const [quantity, setQuantity] = useState(1);
    const [cartItem, setCartItem] = useState<ShoppingCartItem | undefined>();
    const [checkComment, setCheckComment] = useState(false);
    const [tabReview,setTabReview] = useState(0);
    const [content, setContent] = useState("");
    const price = product?.productVariantDTOs
        .find(varian => varian.id === choose)?.priceSale;
    const unitprice = product?.productVariantDTOs
        .find(varian => varian.id === choose)?.unitPrice;
    const totalQuantity = product?.productVariantDTOs
        .filter(varian => varian.id === choose)
        .flatMap(varian => varian.productInventorySuppliers)
        .reduce((total, supplier) => total + supplier.quantity, 0) || 0;
    const productChoose = product?.productVariantDTOs
        .filter(varian => varian.id === choose)
    const VariantIds = useMemo(() => {
        return product?.productVariantDTOs.map(variant => variant.id) || [];
    }, [product]);
    const [star, setStar] = useState<number | undefined>();
    const [ratings, setRatings] = useState<Review[]>()
    useEffect(() => {
        const fetchProductData = async () => {
            try {
                const [productRes, reviewsRes, ratingCountRes] = await Promise.all([
                    axios.get(`${APIENDPOINT}/product/api/Product/id1=${params.id}`),
                    axios.get(`${APIENDPOINT}/product/api/Review/Product/${params.id}`),
                    axios.get(`${APIENDPOINT}/product/api/Review/countRatingProduct?Id=${params.id}`)
                ]);
    
                setProduct(productRes.data);
                setRatings(reviewsRes.data);
                setRatingcout(ratingCountRes.data);
                setChoose(productRes.data.productVariantDTOs[0].id)
            } catch (error) {
                console.error("Error fetching product data:", error);
            }
        };
    
        fetchProductData();
    }, [params.id]);
    useEffect(() => {

        
        if (choose) {
            axios.get(`${APIENDPOINT}/ShoppingCart/api/ShoppingCart/user=${user?.id}&productVarianId=${choose}`)
                .then(res => {
                    setCartItem(res.data)


                }).catch(err => {
                    console.log(err)
                })

        }
    }, [choose, user?.id])
    const handleAddtoCart = () => {

  

        if ((cartItem?.quantity ?? 0) + quantity > totalQuantity) {

            alert(`bạn đã có ${cartItem?.quantity} số lượng trong giỏ hàng nên không thể thêm ${quantity}`);
            return;
        } else if (productChoose) {

            if(user===null){
                return;
            }

            axios.post(`${APIENDPOINT}/ShoppingCart/api/ShoppingCart/add`, {
                id: cartItem?.id || 0,
                userId: user?.id,
                quantity: quantity,
                productVarianId: productChoose[0].id,
                price: productChoose[0].priceSale, // Ensure this accesses the actual price property
            })
                .then(async (res) => {
                    setCartItem(res.data);
                    if(user===null){
                        return;
                    }
                    const newConnection = new HubConnectionBuilder()
                        .withUrl("https://localhost:7006/cartHub")
                        .withAutomaticReconnect()
                        .build();

                    try {
                        await newConnection.start(); // Bắt đầu kết nối

                        if (newConnection.state === "Connected") {
                            await newConnection.invoke("NotifyCartUpdate", user?.id); // Gửi sự kiện
                            alert("thành công")
                        }
                    } catch (error) {
                        console.error("Lỗi khi gửi thông báo:", error);
                    } finally {
                        await newConnection.stop(); // Đảm bảo kết nối luôn được đóng
                        console.log("Kết nối đã được đóng.");
                    }
                })
                .catch(err => {
                    console.error("Error adding item to cart:", err);
                });




        }

    };

    const settings = {
        customPaging: function (i: number) {
            return (
                <a>
                    <img src={product?.productImageDTOs[i].imageUrl} style={{ width: '100%' }} alt={`Thumbnail ${i + 1}`} />

                </a>
            );
        },
        dots: true,
        dotsClass: "slick-dots slick-thumb",
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
    };

    useEffect(() => {
        if (VariantIds.length > 0) {
            const queryString = VariantIds && VariantIds.map(id => `VariantIds=${id}`).join('&');

            axiosInstance.get(`${APIENDPOINT}/order/api/Order/checkOrder?${queryString}`, {

            }
            )
                .then(res => {
                    setCheckComment(res.data);

                    console.log(VariantIds)
                })
                .catch(err => {
                    console.log(err)
                })
        }

    }, [VariantIds])
    useEffect(() => {
        const fetchRecommendations = async () => {
            if (!product?.productCategoryId) return;
    
            try {
                const [recommendRes, recommend1Res] = await Promise.all([
                    axios.get(`${APIENDPOINT}/product/api/Product/productcategoryid=${product.productCategoryId}`),
                    axios.get(`${APIENDPOINT}/product/api/Product/productscategoryid=3&getbyorder=default&pz=3&pn=1`)
                ]);
                setRecommend(recommendRes.data);
                setRecommend1(recommend1Res.data);
            } catch (error) {
                console.error("Error fetching recommendations:", error);
            }
        };
    
        fetchRecommendations();
    }, [product?.productCategoryId]);
    const handleTab = (key: number) => {
        setTab(key)
    }
    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        // Kiểm tra để chỉ nhận các giá trị là số

        if (/^\d*$/.test(newValue)) {
            setQuantity(newValue === "" ? 1 : parseInt(newValue, 10));

        }
        if (parseInt(newValue, 10) > totalQuantity) {
            setQuantity(totalQuantity)
        }
    };
    const handleRating = async() => {
        if (star === undefined || star === null) {
            // Nếu chưa chọn rating, thông báo "Chưa đánh giá"
            alert("Bạn chưa đánh giá sản phẩm!");
            return; // Dừng lại và không gửi yêu cầu POST
        }
        
        try {
             axios.post(
                `${APIENDPOINT}/product/api/review/create`,
                {
                    id: 1,
                    productId: product?.id,
                    userId: user?.id,
                    userName: user?.firstName + " " + user?.lastName,
                    rating: star,
                    createAt: new Date().toISOString(),
                    updateAt: new Date().toISOString(),
                    content: content,
                },

            ).then(()=>(window.location.reload()));
            
            // Reload the page after the request is successful
            
        } catch (error) {
            console.error("Error submitting review:", error);
        }
    }

    return (
        <>
            <div className="pt-5 container" style={{ background: "#fff" }}>
                <nav><Link to="#">Trang chủ</Link>/ <Link to="/danh-muc-san-pham">Sản phẩm</Link>  / {product?.productCategoryDTO?.productCategoryName}</nav>
                <div className="container pt-5 pb-3 mb-3">

                    <div className="row">
                        <div className="col-12 col-md-5 mx-auto">
                            {product?.productImageDTOs && product.productImageDTOs.length > 1 ? (
                                <Slider {...settings}>
                                    {product.productImageDTOs.map((image, index) => (
                                        <div key={index}>
                                            <LazyLoadImage src={image.imageUrl} style={{ width: "100%", border: "1px solid #d3ced2" }} alt={`Product image ${index + 1}`} />
                                        </div>
                                    ))}
                                </Slider>
                            ) : (
                                <img src={product?.imageUrl && `${APIENDPOINT}/product/images/${product?.imageUrl}`} style={{ width: "100%", height: "auto", border: "1px solid #d3ced2" }} alt="" />
                            )}
                        </div>
                        <div className="col-12 col-md-6 mx-auto">
                            <div className="product-content">
                                <div className="pro-header">
                                    <h1>{product?.productName}</h1>
                                </div>

                                <div className="pro-detail">

                                    <p className="fs-6"><strong>Danh Mục</strong>: {product?.productCategoryDTO?.productCategoryName}</p>
                                </div>
                                <div className="pro-price pb-3">
                                    <span className="current-price fs-5" style={{ color: "#86bc42" }}><s>{unitprice && formatPrice(unitprice, 0)}</s> - {price && formatPrice(price, 0)} VNĐ</span>
                                </div>
                                <div >
                                    <div className="swatch d-flex mb-4">
                                        <div className="me-4"><h4 className="fw-bold mb-0 mt-1">QUY CÁCH</h4></div>
                                        <div className="select-wrap d-flex">

                                            {product?.productVariantDTOs.map(pVarian => {
                                                return (<div className="n-sd swatch-element mx-2" key={pVarian.id} >

                                                    <input className="variant-0 input-product d-none" type="radio" name="option1" value="Hộp-250gr" checked={undefined} />
                                                    <label htmlFor="" className={pVarian.id == choose ? "sd" : ""} onClick={() => { setChoose(pVarian.id) }} style={{ cursor: "pointer" }}>
                                                        {pVarian.variantName}
                                                        <img className="crossed-out" src="//theme.hstatic.net/1000302988/1000808903/14/soldout.png?v=161" />
                                                        
                                                        
                                                    </label>
                                                </div>)
                                            })}


                                        </div>
                                    </div>
                                    <div className="quantity-product">
                                        <div className="me-4">
                                            <h4 className="fw-bold mb-0 mt-1">SỐ LƯỢNG</h4>
                                        </div>
                                        <div className="js-qty">
                                            {/* Nút giảm số lượng */}
                                            <button
                                                type="button"
                                                className="js-qty__adjust js-qty__adjust--minus icon-fallback-text"
                                                data-id="Quantity"
                                                onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)} // Không cho giảm dưới 1
                                            >
                                                <span className="icon icon-minus" aria-hidden="true"></span>
                                                <span className="fallback-text" aria-hidden="true">−</span>
                                                <span className="visually-hidden">Giảm số lượng sản phẩm đi 1</span>
                                            </button>

                                            {/* Ô nhập số lượng */}
                                            <input
                                                type="text"
                                                className="js-qty__num"
                                                value={quantity}



                                                name="quantity"
                                                id="Quantity"
                                                onChange={handleQuantityChange} // Sự kiện onChange để cập nhật state
                                            />

                                            {/* Nút tăng số lượng */}
                                            <button
                                                type="button"
                                                className="js-qty__adjust js-qty__adjust--plus icon-fallback-text"
                                                data-id="Quantity"
                                                onClick={() => quantity < totalQuantity ? setQuantity(quantity + 1) : setQuantity(totalQuantity)}
                                            >
                                                <span className="icon icon-plus" aria-hidden="true"></span>
                                                <span className="fallback-text" aria-hidden="true">+</span>
                                                <span className="visually-hidden">Tăng số lượng sản phẩm lên 1</span>
                                            </button>
                                        </div>

                                        <div className="qty ms-3">
                                            <p className="m-0">
                                                Số lượng : {totalQuantity}
                                            </p>

                                        </div>

                                    </div>
                                    <div className="mt-4">
                                        <div className="d-flex">
                                            <button type="button" className="btn btn-tinted btn--l YuENex a_JvBi me-4" aria-disabled="false"
                                                onClick={handleAddtoCart}
                                            ><FontAwesomeIcon  className="_kL9Hf" icon={faShoppingCart}

                                                />
                                                <span className="ms-1">Thêm Vào Giỏ Hàng</span>
                                            </button>
                                           
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
            <div className="container">
                <div className="row "style={{ alignItems: "flex-start" }}>
                    <div className="product-des container px-2 col8 ms-0" style={{ background: "#fff" }}>
                        <div className="mt-3">
                            <div className="tab m-0 mb-3 text-start" >
                                <button className={`fs-4 m-0 ${tab == 1 ? "active" : ""}`}  style={{fontWeight:"600"}}onClick={() => handleTab(1)}>
                                    <span>Mô Tả</span>
                                </button>
                                
                                <button className={`fs-4  ${tab == 2 ? "active" : ""}`}style={{fontWeight:"600"}} onClick={() => handleTab(2)}>
                                    <span>Đánh Giá</span>
                                </button>
                            </div>
                            <div className={`protab-des ${tab == 1 ? "" : "d-none"}`}>

                                <p>{product?.description}</p>
                            </div>
                            <div className={`protab-reviews ${tab == 2 ? "" : "d-none"}`}>

                                <div className="">
                                    <h4 className="text-center">ĐÁNH GIÁ SẢN PHẨM</h4>
                                    {ratings?.length == 0 ? <p className="mb-3">Chưa có đánh giá nào.</p> :
                                        <>

                                            <div className="d-flex align-items-center star-bg">
                                                <div className="px-2 me-2">
                                                    <div>
                                                        <span className="fs-2">5</span>
                                                        <span> trên 5</span>
                                                    </div>
                                                    <div>
                                                        <FontAwesomeIcon icon={faStar} className="star1" />
                                                        <FontAwesomeIcon icon={faStar} className="star1" />
                                                        <FontAwesomeIcon icon={faStar} className="star1" />
                                                        <FontAwesomeIcon icon={faStar} className="star1" />
                                                        <FontAwesomeIcon icon={faStar} className="star1" />
                                                    </div>
                                                </div>
                                                <div className="d-flex flex-1 flex-wrap">
                                                    <div className={`review-tab me-2 ${tabReview===0?"active4":""}`} onClick={()=>{setTabReview(0)}}>Tất cả</div>
                                                    {ratingcount?.map(r=>(
                                                        <div key={r.rating}className={`review-tab me-2 ${tabReview===r.rating?"active4":""}`} onClick={()=>{setTabReview(r.rating)}}>{r.rating} sao ({r.count})</div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="w-100 mt-3 px-4">

                                                <div className="w-100 mt-3">
                                                    {ratings?.map((rating, index) => {
                                                        // Tạo danh sách các ngôi sao dựa trên `rating.rating`
                                                        const stars = [];
                                                        for (let i = 0; i < rating.rating; i++) {
                                                            stars.push(
                                                                <i key={i} className="fa fa-star" style={{ color: "gold" }} />
                                                            );
                                                        }

                                                        return (
                                                            <div key={index} className="mb-4 d-flex align-items-center justify-content-between">
                                                                <div className="d-flex">
                                                                    <i className="mr-3 fa fa-user-circle-o pe-3" style={{ fontSize: "40px", color: "lightgray" }} />
                                                                    <div>
                                                                        <h5 className="mb-0">{rating.userName}</h5>
                                                                        <div>{stars}</div>
                                                                        
                                                                        <div className="mt-2">{rating.content}</div>
                                                                       
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>

                                            </div>

                                        </>}

                                </div>

                                <div className="row">
                                    <form className="col-12">
                                        <p className="comment-notes"><span id="email-notes">Email của bạn sẽ không được hiển thị công khai.</span> <span className="required-field-message">Các trường bắt buộc được đánh dấu <span className="required">*</span></span></p>
                                        <div className="comment-rating">

                                            <div className="stars mb-2 d-flex">
                                                <label htmlFor="rating">Đánh giá của bạn</label>
                                                <span className="d-flex align-items-center ps-3">

                                                    <FontAwesomeIcon onClick={() => setStar(5)} className={`star ${star && star >= 5 ? "active5" : ""}`} icon={faStar} />


                                                    <FontAwesomeIcon onClick={() => setStar(4)} className={`star ${star && star >= 4 ? "active5" : ""}`} icon={faStar} />


                                                    <FontAwesomeIcon onClick={() => setStar(3)} className={`star ${star && star >= 3 ? "active5" : ""}`} icon={faStar} />
                                                    <FontAwesomeIcon onClick={() => setStar(2)} className={`star ${star && star >= 2 ? "active5" : ""}`} icon={faStar} />
                                                    <FontAwesomeIcon onClick={() => setStar(1)} className={`star ${star && star >= 1 ? "active5" : ""}`} icon={faStar} />

                                                </span>
                                            </div>
                                            <div className="form-comment mb-3 row">
                                                <label htmlFor="comment">Nhận xét của bạn&nbsp;
                                                    <span className="required">*</span>
                                                </label>
                                                <textarea name="" id="" className="m-3 col-md-4 col-12" style={{ height: "200px", borderColor: "#ccc" }} onChange={(e) => setContent(e.target.value)}></textarea>
                                            </div>

                                        </div>
                                        <button type="button" onClick={() => { if (checkComment) { handleRating() } }} className={`px-5 pb-2 pt-2 mb-3 btn btn-solid-primary ${checkComment ? "" : "not-allowed"}`} style={{ borderRadius: "2px" }} disabled={!checkComment}>
                                            <span><strong>Gửi đi</strong></span>
                                        </button>
                                    </form>
                                </div>

                            </div>
                        </div>
                        <div className="container mb-5 mt-3" style={{ background: "#fff" }}>
                <div className="row">
                    <div className="text-center clearfix">
                        <h2>Sản phẩm tương tự</h2>

                    </div>
                    {recommend?.map(product => (
                        <div className="col-md-auto product-item" key={product.id}>
                            <div className="product-img">
                                <Link to="#">
                                    <img
                                        src={`${APIENDPOINT}/product/images/${product.imageUrl}`}
                                        alt={product.productName}

                                    />
                                </Link>
                            </div>
                            <div className='product-info'>
                                <div className="product-title">
                                    <Link to="">{product.productName}
                                    </Link>
                                </div>
                                <div className="product-price">
                                    <span>{formatPrice(product.price, 0)} VNĐ</span>
                                </div>
                                <div className='text-center product-action'>
                                    <Link to="#">
                                        <button>CHI TIẾT</button>
                                    </Link>
                                </div>
                            </div>


                        </div>
                    ))}
                </div>
            </div>


                    </div>

                    <div className="col4" style={{ background: "#fff" }}>
                    {recommend1?.map(product => (
                        <div className="col-md-auto product-item" key={product.id}>
                            <div className="">
                                <Link to="#">
                                    <img
                                        src={`${APIENDPOINT}/product/images/${product.imageUrl}`}
                                        alt={product.productName}
                                        style={{width:"100%",height:"230px"}}
                                    />
                                </Link>
                            </div>
                            <div className='product-info'>
                                <div className="product-title">
                                    <Link to="">{product.productName}
                                    </Link>
                                </div>
                                <div className="product-price">
                                    <span>{formatPrice(product.price, 0)} VNĐ</span>
                                </div>
                                <div className='text-center product-action'>
                                    <Link to="#">
                                        <button>CHI TIẾT</button>
                                    </Link>
                                </div>
                            </div>


                        </div>
                    ))}                          
                    </div>
                </div>
            </div>
            
        </>
    )
}

export default Product1
