
import { useEffect, useState } from 'react'
import { ReactSearchAutocomplete } from 'react-search-autocomplete'
import { Product } from '../../../utils/IVegetable'
import axios from 'axios'
import { APIENDPOINT } from '../../../utils/constant'
import './SearchInput.scss'
import { useNavigate } from 'react-router-dom'

const SearchInput:React.FC = () => {
    const navigate = useNavigate();
    const [products,setProducts] = useState<Product[]>([])
    useEffect(() => {
        axios.get(`${APIENDPOINT}/product/api/product/getall`)
          .then(res => {
            
            setProducts(res.data)
            
          })
          .catch(err => {
            console.log(err);
          })
      }, [])
     const HandleOnSelect = (item: Product) => {
        
      
      navigate(`/san-pham/${item.id}`)
      
      }
    
    //   // Hàm được gọi khi người dùng tìm kiếm
    //   const handleOnSearch = (string: string, results: Item[]) => {
    //     console.log("Tìm kiếm:", string)
    //     console.log("Kết quả:", results)
    //   }
    
    //   // Hàm được gọi khi tìm kiếm bị xóa
    //   const handleOnClear = () => {
    //     console.log("Tìm kiếm bị xóa")
    //   }
    const formatResult = (item:Product) => {
        return (
          <div style={{ padding: '5px', backgroundColor: '#f9f9f9', borderRadius: '5px',cursor:"pointer" }}>
            <img src={`${APIENDPOINT}/product/images/${item.imageUrl}`} alt="" style={{width:"50px", height:"50px",marginRight:"5px"}}/>
            <strong>{item.productName}</strong>
            
          </div>
        );
    }
  return (
    <div style={{ width: "400px" }} className='width-search'>
      
      <ReactSearchAutocomplete
        items={products}
        // onSearch={handleOnSearch}
         onSelect={HandleOnSelect}
        // onClear={handleOnClear}
        showIcon={false}
        fuseOptions={{ keys: ["productName"] }}
        resultStringKeyName="productName" 
        autoFocus
        formatResult={formatResult} 
        placeholder="Nhập tên sản phẩm..."
        styling={{
          borderRadius: "4px",
          backgroundColor: "#f2f2f2",
          hoverBackgroundColor: "#e9e9e9",
          color: "#333",
          fontSize: "16px",
          iconColor: "#333",
          
        }}
      />
    </div>
  )
}

export default SearchInput
