import { useEffect, useState } from 'react'
import './CategoryTable.scss'
import { Category, Sale } from '../../../utils/IVegetable'
import axios from 'axios'
import { APIENDPOINT } from '../../../configs/constant'
import { Link } from 'react-router-dom'

const CategoryTable = () => {
    const [category, setCategory] = useState<Category[]>([])
    const [sale, setSale] = useState<Sale[]>([])
    const [activeTab,setActiveTab] = useState<number|undefined>();
    const [activeTabSale,setActiveTabSale] = useState<number|undefined>();
    const [activeTabAll,setActiveTabAll] = useState<number|undefined>();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [categoryRes, saleRes] = await Promise.all([
                    axios.get(`${APIENDPOINT}/product/api/productcategory/getall`),
                    axios.get(`${APIENDPOINT}/product/api/Sale/active`)
                ]);
    
                setCategory(categoryRes.data);
                setSale(saleRes.data);
            } catch (err) {
                console.error("Lỗi khi lấy dữ liệu:", err);
            }
        };
    
        fetchData();
    }, []);
    return (
        <>
            <div className="product-category_tb " >
                <div className="product-category-title text-center">
                    <h3>Danh Mục Sản Phẩm</h3>
                </div>
                <ul className='category-ul' style={{background:"#fff"}}>
                    <li><Link className={`${activeTabAll === 1 ? "active1" : ""}`} to={"/danh-muc-san-pham"} onClick={() => {setActiveTabSale(undefined); setActiveTab(undefined);setActiveTabAll(1)}}> Tất cả</Link></li>
                    {category.map((categoryItem) => (
                        
                            <li key={categoryItem.id}><Link 
                            state={{ id: categoryItem.id,name:categoryItem.productCategoryName,category:1}}
                             onClick={()=>{setActiveTab(categoryItem.id); setActiveTabSale(undefined);setActiveTabAll(undefined)}} 
                             className={`${activeTab == categoryItem.id?"active1":""}`}
                             to={"/danh-muc-san-pham/" + categoryItem.productCategoryName}>{categoryItem.productCategoryName}</Link></li>
                        
                    ))}
                    {sale.map(item => {
    return (
        <li key={item?.id}> 
            <Link  
                state={{ id: item?.id, name: item?.saleName,category:2 }}
                onClick={() => {setActiveTabSale(item?.id); setActiveTab(undefined);setActiveTabAll(undefined)}} 
                className={`${activeTabSale === item?.id ? "active1" : ""}`}
                to={`/danh-muc-san-pham/sale/${item?.id}`}>
                {item?.saleName}
            </Link>
        </li>
    );
})}
                </ul>
            </div>
            
        </>
    )
}

export default CategoryTable
