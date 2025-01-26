
import axios from 'axios';
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { APIENDPOINT } from '../../configs/constant';
import { useAuth } from '../../Context/useAuth';

const Register = () => {
    const [check, setCheck] = useState<boolean>(false);
    const [firstName, setFirstName] = useState<string>(''); // State for first name
    const [lastName, setLastName] = useState<string>(''); // State for last name
    const [otpMessage, setOtpMessage] = useState<string>(''); // State để lưu thông báo OTP
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [password2, setPassword2] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [passwordError, setPasswordError] = useState<string>(''); // State để lưu thông báo lỗi mật khẩu
    const [password2Error, setPassword2Error] = useState<string>('');
    const [checkotp,setCheckOtp] =useState(false);
    const [otp, setOtp] = useState("");
    const {login} = useAuth();
    const navigate = useNavigate();
    const validatePassword = (password: string) => {
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*?])[A-Za-z\d!@#$%^&*?]{6,}$/;
        if (!passwordRegex.test(password)) {
            setPasswordError('Mật khẩu phải có ít nhất 6 ký tự, bao gồm chữ hoa, số và ký tự đặc biệt!');
        } else {
            setPasswordError('');
        }
    }
    const validatePassword2 = (password2: string, password: string) => {
        if (!password2) {
            setPassword2Error('Mật khẩu xác nhận không được để trống');
        } else if (password2 !== password) {
            setPassword2Error('Mật khẩu không trùng khớp');
        } else {
            setPassword2Error('');
        }
    }
    const handleSendOtp = () => {

        if (email && username && password) {
            axios.post(`${APIENDPOINT}/auth/api/Auth/VerifiedEmail`, {
                email: email,
                username: username
            })
                .then(res => {
                    if (res.status == 200) {
                        setCheck(true);

                        setOtpMessage('Mã OTP đã được gửi!');
                    }
                })
                .catch(err => {
                    console.log(err);

                })
            // Hiển thị thông báo
        } else {
            setOtpMessage('Vui lòng điền đầy đủ thông tin!');
        }
    }

    const handleVerifyOtp = () => {
        axios.post(`${APIENDPOINT}/auth/api/Auth/VerifyOtp`, {
            email: email,
            otp: otp
        })
            .then(res => {
                if (res.status == 200) {
                    setCheck(true);
                    setCheckOtp(true)
                    setOtpMessage('Mã OTP đã được gửi!');
                }
            })
            .catch(err => {
                console.log(err);

            })
        setOtpMessage('OTP hợp lệ!');
    }


    const handleRegister = () => {
        if(checkotp){
            axios.post(`${APIENDPOINT}/auth/api/Auth/Register`, {
                firstName: firstName,
                lastName: lastName,
                username: username,
                password: password,
                email: email
            })
            .then(res => {
                
                    alert('Đăng ký thành công!');
                    login({token:res.data.token,refreshToken:res.data.refreshToken})
                    
                    navigate('/')
            })
            .catch(err => {
                console.log(err);
                alert('Đăng ký thất bại. Vui lòng thử lại.');
            });
        }

        else{
            return;
        }
       
    };

    return (
        <section className="p-3 p-md-4 p-xl-5 login-page">
            <div className="container">
                <div className="card border-light-subtle shadow-sm col-12 col-md-5 m-auto">
                    <div className="row g-0">
                        <div className="card-body p-3 p-md-4 p-xl-5">
                            <div className="row">
                                <div className="col-12">
                                    <div className="mb-5">
                                        <h3>Đăng Kí</h3>
                                    </div>
                                </div>
                            </div>
                            <form action="#!">
                                <div className="row gy-3 gy-md-4 overflow-hidden">
                                    <div className="col-6">
                                        <label htmlFor="firstName" className="form-label">Tên <span className="text-danger">*</span></label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="firstName"
                                            id="firstName"
                                            placeholder="First Name"
                                            required
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                        />
                                    </div>
                                    <div className="col-6">
                                        <label htmlFor="lastName" className="form-label">Họ <span className="text-danger">*</span></label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="lastName"
                                            id="lastName"
                                            placeholder="Last Name"
                                            required
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                        />
                                    </div>
                                    <div className="col-12">
                                        <label htmlFor="username" className="form-label">Tên đăng nhập <span className="text-danger">*</span></label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="username"
                                            id="username"
                                            placeholder="username"
                                            required
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                        />
                                    </div>
                                    <div className="col-12">
                                        <label htmlFor="password" className="form-label">Mật khẩu <span className="text-danger">*</span></label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            name="password"
                                            id="password"
                                            required
                                            value={password}
                                            onChange={(e) => {
                                                setPassword(e.target.value);
                                                validatePassword(e.target.value); // Kiểm tra mật khẩu khi người dùng nhập
                                            }}
                                        />
                                        {passwordError && <small className="text-danger">{passwordError}</small>} {/* Hiển thị thông báo lỗi */}
                                    </div>
                                    <div className="col-12">
                                        <label htmlFor="password" className="form-label">Nhập lại mật khẩu <span className="text-danger">*</span></label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            name="password2"
                                            id="password2"
                                            required
                                            value={password2}
                                            onBlur={() => validatePassword2(password2, password)}
                                            onChange={(e) => {
                                                setPassword2(e.target.value)
                                            }
                                            }
                                        />
                                        {password2Error && <small className="text-danger">{password2Error}</small>}
                                    </div>
                                    <div className="col-12">
                                        <label htmlFor="email" className="form-label">Email <span className="text-danger">*</span></label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            name="email"
                                            id="email"
                                            required
                                            placeholder="example@gmail.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                    <div className="col-8">
                                        <label htmlFor="otp" className="form-label">OTP <span className="text-danger">*</span></label>
                                        <div className='d-flex'>
                                            <input
                                                type="number"
                                                className="form-control"
                                                name="otp"
                                                id="otp"
                                                required={check}
                                                placeholder="Mã OTP"
                                                onChange={(e) => setOtp(e.target.value)}
                                            />
                                            {!check ? (
                                                <button
                                                    className='ms-3'
                                                    style={{ padding: "0 20px", backgroundColor: "blue", borderRadius: "5px", whiteSpace: 'nowrap' }}
                                                    onClick={() => {handleSendOtp()}}
                                                    type="button"
                                                >
                                                    Gửi mã
                                                </button>
                                            ) : (
                                                <button
                                                    className='ms-3'
                                                    style={{ padding: "0 20px", backgroundColor: "blue", borderRadius: "5px", whiteSpace: 'nowrap' }}
                                                    onClick={() => handleVerifyOtp()}
                                                    type='button'
                                                >
                                                    Kiểm tra
                                                </button>
                                            )}
                                        </div>
                                        {otpMessage && <small className="text-danger">{otpMessage}</small>} {/* Hiển thị thông báo dưới ô OTP */}
                                    </div>
                                    <div className="col-12">
                                        <div className="form-check">
                                            <input className="form-check-input" type="checkbox" value="" name="remember_me" id="remember_me" />
                                            <label className="form-check-label text-secondary" htmlFor="remember_me">
                                                Nhớ tài khoản
                                            </label>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="d-grid">
                                            <button className="btn bsb-btn-xl bg-login" type="button" disabled={!checkotp} onClick={handleRegister}>Đăng ký</button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                            <div className="row">
                                <div className="col-12">
                                    <hr className="mt-5 mb-4 border-secondary-subtle" />
                                    <div className="d-flex gap-2 gap-md-4 flex-column flex-md-row justify-content-md-end">
                                        <Link to="/dang-nhap" className="link-secondary text-decoration-none">Đăng nhập</Link>
                                        <Link to="#!" className="link-secondary text-decoration-none">Quên mật khẩu</Link>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-12">
                                    <p className="mt-5 mb-4">Or sign in with</p>
                                    <div className="d-flex gap-3 flex-column flex-xl-row ju">
                                        <Link to="#!" className="btn bsb-btn-xl bg-login">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-google" viewBox="0 0 16 16">
                                                <path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.442-2.374H8v-2h7.545z" />
                                            </svg>
                                            <span className="ms-2 fs-6">Google</span>
                                        </Link>
                                        <Link to="#!" className="btn bsb-btn-xl bg-login">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-facebook" viewBox="0 0 16 16">
                                                <path d="M15.498 8.354c0-3.5-2.92-6.355-6.527-6.355-2.648 0-4.913 1.623-5.68 3.857h-1.04v2.748h1.327v5.65h3.197v-5.65h2.35l.356-2.748h-2.707v-1.508c0-.629.315-1.246 1.307-1.246h1.527v-2.973c-1.171 0-2.523-.135-3.825-.135-4.031 0-6.527 2.548-6.527 6.355 0 4.014 2.726 7.347 6.573 7.951v-5.625h-1.875l-.356-2.746h2.231v-1.508h-1.008c-.993 0-1.307.617-1.307 1.246v1.508h2.231l-.356 2.746h-1.875v5.625c3.824-.606 6.75-3.938 6.75-7.951z" />
                                            </svg>
                                            <span className="ms-2 fs-6">Facebook</span>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Register;
