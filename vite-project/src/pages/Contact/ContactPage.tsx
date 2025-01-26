import { useState } from "react"
import BackToTop from "../../components/AppBar/BackTop/BackToTop"
import BreadCrumb from "../../components/AppBar/BreadCrumb/BreadCrumb"
import Footer from "../../components/AppBar/Footer/Footer"
import Header from "../../components/AppBar/Header/Header"
import NavDrawer from "../../components/AppBar/NavDrawer/NavDrawer"
import Contact from "../../components/AppBar/ContactIcon/ContactButton"

import './Contact.scss'
const ContactPage = () => {
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

                <div className="container pb-5">
                    <div className="row justify-content-between" >

                        <div className="col-12 px-4 pb-4" style={{ background: "#fff" }}>

                            <header><h1 style={{fontSize:"28px",fontWeight:"700"}}>NÔNG SẢN XANH</h1></header>

                            <div className="w-100 d-flex ">
                                <div className="hd-content col-7">
                                    <div className="aboutme">
                                        <p className="mb-0">Từ những ngày đầu khi đất trời giao hòa, những mảnh đất xanh tươi của quê hương đã chứng kiến sự bắt đầu của hành trình đặc biệt mà chúng tôi – Nông Sản Xanh – đã và đang theo đuổi. Tại Nông Sản Xanh, chúng tôi không chỉ trồng những loại cây trái tươi ngon mà còn chăm sóc, bảo vệ môi trường và xây dựng một tương lai bền vững cho cộng đồng.

                                            Câu chuyện bắt đầu từ một niềm tin vững chắc: Nông sản phải là sạch
                                            và an toàn cho sức khỏe người tiêu dùng. Chúng tôi hiểu rằng
                                            việc trồng trọt và sản xuất không chỉ đơn thuần là công việc, mà là
                                            rách nhiệm với trái đất và con người. Chính vì vậy, mỗi sản phẩm Nông Sản X
                                            nh ra đời đều được đảm bảo theo tiêu chuẩn khắt khe nhất về chất lượng và an toàn,
                                            từ khâu gieo trồng cho đến thu hoạch và vận chuyển.</p>
                                    </div>

                                </div>
                                <div className="col-5" style={{ paddingLeft: "65px" }}>
                                    <div className="how-bor1 ">
                                        <div className="hov-img0 zoom-image">
                                            <img src="nong-san.jpg" alt="IMG" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="w-100 d-flex"  style={{marginTop:"130px"}}>
                                <div className="col-5" style={{paddingRight:"85px",paddingTop:"7px"}}>
                                    <div className="how-bor2">
                                        <div className="hov-img0 zoom-image">
                                            <img src="rc-bc.jpg" alt="IMG" />
                                        </div>
                                    </div>
                                </div>
                                <div className="hd-content col-7" style={{ paddingLeft: "65px" }}>
                                <header ><h1 style={{fontSize:"28px",fontWeight:"700"}}>SỨ MỆNH CỦA CHÚNG TÔI</h1></header>
                                    <p>Sứ mệnh của chúng tôi là mang đến những sản phẩm nông sản sạch, an toàn và bền vững, không chỉ vì sức khỏe của người tiêu dùng mà còn vì tương lai của hành tinh này. Chúng tôi cam kết bảo vệ môi trường, duy trì sự cân bằng của thiên nhiên và phát triển bền vững trong mọi bước đi của mình. Bằng việc áp dụng các phương pháp canh tác hữu cơ và sử dụng công nghệ nông nghiệp tiên tiến, Nông Sản Xanh giúp giảm thiểu tác động tiêu cực lên môi trường.

                                        Không chỉ chú trọng đến sản phẩm, Nông Sản Xanh còn mong muốn nâng cao đời sống của các hộ nông dân. Chúng tôi mang đến những cơ hội phát triển bền vững cho nông dân, giúp họ tiếp cận những kỹ thuật canh tác mới, đồng thời cải thiện thu nhập và đời sống. Chính từ những người nông dân tận tâm này, những sản phẩm chất lượng cao mới được ra đời, góp phần xây dựng một cộng đồng nông thôn phát triển vững mạnh.

                                        Sứ mệnh của chúng tôi là không chỉ cung cấp thực phẩm an toàn cho mỗi gia đình, mà còn tạo ra sự thay đổi tích cực, bền vững cho cộng đồng và hành tinh. Chúng tôi trồng, bạn tiêu dùng, và cùng nhau, chúng ta bảo vệ hành tinh này.</p>
                                </div>

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

export default ContactPage
