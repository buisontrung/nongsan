import { useState } from 'react'
import Footer from '../../components/AppBar/Footer/Footer'
import BackToTop from '../../components/AppBar/BackTop/BackToTop'
import Contact from '../../components/AppBar/ContactIcon/ContactButton'
import SlickSlider from '../../components/AppBar/SlickSlider/SlickSlider'
import NavDrawer from '../../components/AppBar/NavDrawer/NavDrawer'
import Header from '../../components/AppBar/Header/Header'
import './Checkout.scss'
import CheckoutAddress from '../../components/AppBar/CheckoutAppbar/CheckoutAddress'
import CheckoutCart from '../../components/AppBar/CheckoutAppbar/CheckoutCart'
import CheckoutTitle from '../../components/AppBar/CheckoutAppbar/CheckoutTitle'
import { ShoppingCartType } from '../../utils/IVegetable'
import { useLocation } from 'react-router-dom'
import CheckoutPaymet from '../../components/AppBar/CheckoutAppbar/CheckoutPaymet'
const Checkout = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const location = useLocation();
    const cartItems: ShoppingCartType[] = location.state;
    const toggleDrawer = () => {
        setIsDrawerOpen(!isDrawerOpen);
    };
    
    return (
        <>
            <NavDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
            <Header onMenuClick={toggleDrawer} />
            <div className="page-content">
                <SlickSlider />
                <CheckoutTitle/>
                <div role='main' className=''>
                    
                    <div className="container">
                        <CheckoutAddress/>
                        <CheckoutCart cartItems={cartItems}/>
                        <CheckoutPaymet/>
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
