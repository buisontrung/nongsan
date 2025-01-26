import { useState } from "react";
import Header from "../../components/AppBar/Header/Header"
import NavDrawer from "../../components/AppBar/NavDrawer/NavDrawer"

import Footer from "../../components/AppBar/Footer/Footer";
import BackToTop from "../../components/AppBar/BackTop/BackToTop";
import Contact from "../../components/AppBar/ContactIcon/ContactButton";
import BreadCrumb from "../../components/AppBar/BreadCrumb/BreadCrumb";

import IntroduceWrapper from "../../components/AppBar/IntroduceComponents/IntroduceWrapper";



const Introduce = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const toggleDrawer = () => {
        setIsDrawerOpen(!isDrawerOpen);
    };
    return (
        <>
            <NavDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
            <Header onMenuClick={toggleDrawer} />
            <BreadCrumb />
            <div className="page-content">
            
            <div className="container" style={{minHeight:"100vh"}}>
                <div className="row justify-content-between" style={{minHeight:"90vh"}}>

                    <div className="col-12 px-4" style={{background:"#fff"}}>
                    <IntroduceWrapper />
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

export default Introduce
