import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Product } from '../../../utils/IVegetable';
import axios from 'axios';
import { APIENDPOINT } from '../../../configs/constant';
import './Product.scss'


const ProductSale1 = () => {
const location = useLocation();
    const categoryName = location.state?.name;
    const id = location.state?.id || 0;
    const [products, setProducts] = useState<Product[]>([]);
    const [quantity,setQuantity]= useState(0);
    const [orderbyIndex, setOrderbyIndex] = useState(1);
    const [pageNumber,setPageNumber] =useState(1);

    // Function to handle ordering
    const handleOrderbySubmit = (index: number) => {
        setOrderbyIndex(index);
    }
    useEffect(()=>{
        const fetchQuantity = async () => {
            try {
                const res = await axios.get(`${APIENDPOINT}/product/api/Product/getcountproduct/$${id}`);
                setQuantity(res.data);
            } catch (err) {
                console.log(err);
            }
        };

        fetchQuantity();
    },[id])
    // Function to get the appropriate API endpoint for sorting
    

    useEffect(() => {
        const getSortingEndpoint = () => {
            let endpoint = `${APIENDPOINT}/product/api/Product/saleid=${id}`;
            switch (orderbyIndex) {
                case 1:
                    endpoint += '&getbyorder=default';
                    break;
                case 2:
                    endpoint += '&getbyorder=popularity';
                    break;
                case 3:
                    endpoint += '&getbyorder=rating';
                    break;
                case 4:
                    endpoint += '&getbyorder=date';
                    break;
                case 5:
                    endpoint += '&getbyorder=price';
                    break;
                case 6:
                    endpoint += '&getbyorder=price_desc';
                    break;
                default:
                    endpoint += '';
            }
            return endpoint;
        };

        const fetchProducts = async () => {
            try {
                const endpoint = getSortingEndpoint();
                const res = await axios.get(endpoint+`&pz=6&pn=${pageNumber}`);
                setProducts(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        
        fetchProducts();
    }, [orderbyIndex, id,pageNumber]);
    const handlePageChange = (page: number) => {
        setPageNumber(page);

    };
    const formatPrice = (price: number): string => {
        return price.toLocaleString('vi-VN'); // Vietnamese formatting with dot separators
    };
    const renderPaginationItems = () => {
        const items = [];
        for (let i = 0; i <= quantity / 6; i += 1) {
            const a = i + 1;
            items.push(
                <li key={a} onClick={() => handlePageChange(a)} className={a === pageNumber ? 'active' : 'page'}>
                    {a}
                </li>
            );

        }
        return items;
    }
    return (
        <>
            <header><h1>{categoryName}</h1></header>
            <div className="d-flex justify-content-between"><p className='result-count'>Hiển thị {products.length}/{quantity} kết quả</p>
                <form className='text-end'>
                    <select
                        name="orderby"
                        className="orderby"
                        aria-label="Đơn hàng của cửa hàng"
                        onChange={(e) => handleOrderbySubmit(Number(e.target.value))} // Handle select change
                    >
                        <option value="1">Thứ tự mặc định</option>
                        <option value="3">Thứ tự theo điểm đánh giá</option>
                        <option value="5">Thứ tự theo giá: thấp đến cao</option>
                        <option value="6">Thứ tự theo giá: cao xuống thấp</option>
                    </select>
                </form></div>
            <div className='row'>
                {products.map((product) => (

                    <div className="col3 product-item" key={product.id}>
                        <Link to={`/san-pham/${product.id}`}>
                            <div className="product-img text-center">
                                {product.sale && (
                                    <div className="sale-tag">
                                        <span>{product.sale.discountPercentage}% OFF</span>
                                    </div>
                                )}
                                <a href="#/">
                                    <img src={`https://localhost:7000/product/images/${product.imageUrl}`} alt={product.productName} style={{ width: "100%" }} loading="lazy" />
                                </a>
                            </div>
                            <div className="product-info">
                                <div className="product-title">
                                    <Link to={`/san-pham/${product.id}`}>{product.productName.length > 16 ? product.productName.slice(0, 16) + "..." : product.productName}</Link>
                                </div>
                                <div className="product-price">
                                    <span>{product.minPrice ? formatPrice(product.minPrice) : ""} VNĐ</span>


                                </div>
                                <div className="text-center product-action">
                                    <a href="#/">
                                        <button>CHI TIẾT</button>
                                    </a>
                                </div>
                            </div>
                        </Link>
                    </div>

                ))}

            </div>

            <nav className='woocommerce-pagination'>

                <ul>{renderPaginationItems()}</ul>
            </nav>
        </>
    )
}

export default ProductSale1;
