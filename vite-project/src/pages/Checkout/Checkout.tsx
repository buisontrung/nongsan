import { useState } from 'react'
import Footer from '../../components/AppBar/Footer/Footer'
import BackToTop from '../../components/AppBar/BackTop/BackToTop'
import Contact from '../../components/AppBar/ContactIcon/ContactButton'
import NavDrawer from '../../components/AppBar/NavDrawer/NavDrawer'
import Header from '../../components/AppBar/Header/Header'
import './Checkout.scss'
import CheckoutAddress from '../../components/AppBar/CheckoutAppbar/CheckoutAddress'
import CheckoutCart from '../../components/AppBar/CheckoutAppbar/CheckoutCart'
import CheckoutTitle from '../../components/AppBar/CheckoutAppbar/CheckoutTitle'
import { Address, ShoppingCartType } from '../../utils/IVegetable'
import { useLocation } from 'react-router-dom'
import CheckoutPaymet from '../../components/AppBar/CheckoutAppbar/CheckoutPaymet'
const Checkout = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const location = useLocation();
    const cartItems: ShoppingCartType[] = location.state?.cartItemsChecked || [];
    const totalPrice:number = location.state?.totalPrice  || 0;
    const [addressActive, setAddressActive] = useState<Address>();
    const toggleDrawer = () => {
        setIsDrawerOpen(!isDrawerOpen);
    };
    const handleAddressActiveChange = (isActive: Address) => {
        setAddressActive(isActive);
    };
    return (
        <>
            <NavDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
            <Header onMenuClick={toggleDrawer} />
            <div className="page-content">
                
                <CheckoutTitle/>
                <div role='main' className=''>
                    
                    <div className="container">
                        <CheckoutAddress onActiveChange={handleAddressActiveChange}/>
                        <CheckoutCart cartItems={cartItems}/>
                        <CheckoutPaymet totalPrice={totalPrice} address={addressActive} cartItems={cartItems}/>
                    </div>
                    
                    
                </div>
            </div>
            <Footer />
            <BackToTop />
            <Contact />
        </>
    )
}

export default Checkout
