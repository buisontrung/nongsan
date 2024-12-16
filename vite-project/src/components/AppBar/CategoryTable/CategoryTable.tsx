import { useEffect, useState } from 'react'
import './CategoryTable.scss'
import { Category } from '../../../utils/IVegetable'
import axios from 'axios'
import { APIENDPOINT } from '../../../utils/constant'
import { Link } from 'react-router-dom'

const CategoryTable = () => {
    const [category, setCategory] = useState<Category[]>([])
    const [activeTab,setActiveTab] = useState<number|undefined>();
    useEffect(() => {
        axios.get(`${APIENDPOINT}/product/api/productcategory/getall`)
            .then(res => {
                setCategory(res.data);
            })
            .catch(err => {
                console.log(err);
            })
    }, [])
    return (
        <>
            <div className="product-category_tb " >
                <div className="product-category-title text-center">
                    <h3>Danh Mục Sản Phẩm</h3>
                </div>
                <ul className='category-ul' style={{background:"#fff"}}>
                    {category.map((categoryItem) => (
                        
                            <li key={categoryItem.id}><Link 
                            state={{ id: categoryItem.id,name:categoryItem.productCategoryName}}
                             onClick={()=>setActiveTab(categoryItem.id)} 
                             className={`${activeTab == categoryItem.id?"active1":""}`}
                             to={"/danh-muc-san-pham/" + categoryItem.productCategoryName}>{categoryItem.productCategoryName}</Link></li>
                        
                    ))}
                </ul>
            </div>
            
        </>
    )
}

export default CategoryTable
