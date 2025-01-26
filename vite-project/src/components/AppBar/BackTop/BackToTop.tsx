
import './BackToTop.scss'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDoubleUp } from "@fortawesome/free-solid-svg-icons";
const BackToTop = () => {

    
    const handleBackToTop = () => {
        // Cuộn lên đầu trang khi click vào nút
        window.scrollTo({
            top: 0,
            behavior: 'smooth'  // Hiệu ứng cuộn mượt
        });
    };
    return (
        <div id='back-to-top' onClick={handleBackToTop} style={{cursor:"pointer"}}>
            <div className="back-circle">
                <div className="circle"></div>
                <div className="circle"></div>
                <div className="circle"></div>
                
                <FontAwesomeIcon icon={faAngleDoubleUp}/>
                

            </div>
        </div>
    )
}

export default BackToTop
