import  { useState } from 'react'
import NavDrawer from '../../components/AppBar/NavDrawer/NavDrawer'
import Header from '../../components/AppBar/Header/Header'
import Footer from '../../components/AppBar/Footer/Footer'
import BackToTop from '../../components/AppBar/BackTop/BackToTop'
import Contact from '../../components/AppBar/ContactIcon/ContactButton'
import AccountNav from './AccountNav'
import AccountProfile from './AccountProfile'
import './Account.scss'
import { Route, Routes } from 'react-router-dom'
import AccountAddress from './AccountAddress'
import AccountOrder from './AccountOrder'
import AccountOrderDetails from './AccountOrderDetails'
const Account = () => {
 const [isDrawerOpen, setIsDrawerOpen] = useState(false);
 
 const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
    };
  return (
    <>
            <NavDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
            <Header onMenuClick={toggleDrawer} />
            <div className="page-content">
                <div role='main' className=''>
                    
                    <div className="container">
                        <div className="row p-5">
                            <div className="col-12 col-md-3">
                                <AccountNav/>
                            </div>
                            
                            <div className="col-12 col-md-9">
                                <Routes>
                                    <Route path="profile" element={<AccountProfile/>} />
                                    <Route path='dia-chi' element={<AccountAddress/>}/>
                                    <Route path='don-hang/*' element={<AccountOrder/>}/>
                                    <Route path='don-hang/details' element={<AccountOrderDetails/>}/>
                                </Routes>
                                
                            </div>
                        </div>
                    </div>
                    
                    
                </div>
            </div>
            <Footer />
            <BackToTop />
            <Contact />
        </>
  )
}

export default Account
