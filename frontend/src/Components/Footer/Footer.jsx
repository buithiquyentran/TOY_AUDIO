import React from 'react'
import { BsInstagram } from "react-icons/bs";
import { FaTwitter } from "react-icons/fa6";
import { FaFacebookF } from "react-icons/fa";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './Footer.css'
const Footer = ()=>{
    return (
        <div className='footer'>
            <div className= 'footer-link'>
                    <div className= 'footer-link-cpn'>
                        <div className= 'footer-link-name'>Công Ty</div>
                        <a className="footer-link-item" href="/">Giới thiệu</a>
                        <a className="footer-link-item" href="/">Việc làm</a>
                        <a className="footer-link-item" href="/">For the record</a>
                    </div>
                    <div className= 'footer-link-community'>
                        <div className= 'footer-link-name'>Cộng Đồng</div>
                        <a className="footer-link-item" href="/">Dành cho các Nghệ sĩ</a>
                        <a className="footer-link-item" href="/">Nhà phát triển</a>
                        <a className="footer-link-item" href="/">Quảng cáo</a>
                        <a className="footer-link-item" href="/">Nhà đầu tư</a>
                        <a className="footer-link-item" href="/">Nhà cung cấp</a>
                        
                    </div>
                    <div className= 'footer-link-helpful'>
                        <div className= 'footer-link-name'>Liên kết hữu ích</div>
                        <a className="footer-link-item" href="/">Hỗ trợ</a>
                        <a className="footer-link-item" href="/">Ứng dụng Di dộng Miễn phí</a>
                    </div>
                    <div className= 'footer-link-packages'>
                        <div className= 'footer-link-name'>Các gói của ToyAudio</div>
                        <a className="footer-link-item" href="/">Premium Individual</a>
                        <a className="footer-link-item" href="/">Premium Student</a>
                        <a className="footer-link-item" href="/">ToyAudio Free</a>
                    </div>
                    <div className= 'footer-link-socials'>
                        <a className="footer-socials-link" href="/"><BsInstagram className='footer-social-icon'/></a>
                        <a className="footer-socials-link" href="/"><FaTwitter className='footer-social-icon'  /></a>
                        <a className="footer-socials-link" href="/"><FaFacebookF className='footer-social-icon'  /></a>
                    </div>
            </div>
            <div className='footer-policy'>
                <a className="footer-link-item" href="/">Pháp lý</a>
                <a className="footer-link-item" href="/">Trung tâm an toàn và quyền riêng tư</a>
                <a className="footer-link-item" href="/">Chính sách quyền riêng tư</a>
                <a className="footer-link-item" href="/">Cookie</a>
                <a className="footer-link-item" href="/">Giới thiệu quảng cáo</a>
                <a className="footer-link-item" href="/">Hỗ trợ tiếp cận</a>
                <a className="footer-link-item" href="/">© 2024 ToyAudio</a>
            </div>
        </div>
    )
}
export default Footer