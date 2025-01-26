import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import Introduce from './pages/Introduce/Introduce';
import "./global.scss";
import ProductCategory from './pages/Product/ProductCategory';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import { AuthProvider } from './Context/AuthContext';
import Post from './pages/Post/Post';
import PostDetail from './pages/Post/PostDetail';
import ProductDetail from './pages/Product/ProductDetail';
import ShoppingCart from './pages/ShoppingCart/ShoppingCart';


import './global.scss'
  import Checkout from './pages/Checkout/Checkout';
import Account from './pages/Account/Account';

import ContactPage from './pages/Contact/ContactPage';
import ProductSale from './pages/Product/ProductSale';




const App = () => {
  return (
    <AuthProvider>
      
        <Router>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/gioi-thieu" element={<Introduce />} />
              <Route path="/danh-muc-san-pham/*" element={<ProductCategory />} />
              <Route path="/danh-muc-san-pham/sale/*" element={<ProductSale />} />
              <Route path="/san-pham/:id" element={<ProductDetail />} />
              <Route path="/dang-nhap" element={<Login />} />
              <Route path="/dang-ki" element={<Register />} />
              <Route path="/danh-muc-bai-viet" element={<Post />} />
              <Route path="/danh-muc-bai-viet/:id" element={<PostDetail />} />
              <Route path="/gio-hang" element={<ShoppingCart />} />
              <Route path="/check-out" element={<Checkout />} />
              <Route path="/tai-khoan/*" element={<Account />} />
              <Route path='/ve-chung-toi' element={<ContactPage/>}/>
            </Routes>
          
        </Router>
      
    </AuthProvider>
  );
};

export default App;