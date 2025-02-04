import { Link, useNavigate } from 'react-router-dom'
import './Login.scss'
import { useEffect, useState } from 'react';
import axios from 'axios';
import { APIENDPOINT } from '../../configs/constant';

import { useAuth } from '../../Context/useAuth';
const Login = () => {
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const {login,isAuthenticated} = useAuth();
  
  const navigate = useNavigate();
  
    useEffect(()=>{
      if(isAuthenticated){
        navigate('/')
      }
    },[isAuthenticated,navigate])
  
  const handlesubmit =(event: React.FormEvent)=>{
    event.preventDefault();
    axios.post(APIENDPOINT+'/Auth/api/Auth/Login',{
      userName:username,
      password:password
    }).then((res)=>{
      console.log(res.data);
      const { token, refreshToken} = res.data.tokenresult;
      sessionStorage.setItem("user", JSON.stringify(res.data.userdto));
      login({token,refreshToken});
      
      window.location.href = "/";
      
    }).catch(err=>{
      console.log(err);
    })
  }
  return (
    <section className="p-3 p-md-4 p-xl-5 login-page">
  <div className="container">
    <div className="card border-light-subtle shadow-sm">
      <div className="row g-0">
        <div className="col-12 col-md-6 bg-login">
          <div className="d-flex align-items-center justify-content-center h-100">
            <div className="col-10 col-xl-8 py-3">
              <img className="img-fluid rounded mb-4" loading="lazy" src="logo_11.png" width="245" height="80" alt="BootstrapBrain Logo" />
              <hr className="border-primary-subtle mb-4" />
              <h2 className="h1 mb-4">We make digital products that drive you to stand out.</h2>
              <p className="lead m-0">We write words, take photos, make videos, and interact with artificial intelligence.</p>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-6">
          <div className="card-body p-3 p-md-4 p-xl-5">
            <div className="row">
              <div className="col-12">
                <div className="mb-5">
                  <h3>Đăng Nhập</h3>
                </div>
              </div>
            </div>
            <form action="#!" onSubmit={handlesubmit}>
              <div className="row gy-3 gy-md-4 overflow-hidden">
                <div className="col-12">
                  <label htmlFor="username" className="form-label">Tên đăng nhập <span className="text-danger">*</span></label>
                  <input 
                  type="text"
                   className="form-control"
                    name="username" id="username" 
                    placeholder="username" 
                    required
                    onChange={(e)=>{setUsername(e.target.value)}}/>
                </div>
                <div className="col-12">
                  <label htmlFor="password" className="form-label">Mật Khẩu <span className="text-danger">*</span></label>
                  <input 
                  type="password" 
                  className="form-control" 
                  name="password" 
                  id="password" 
                  
                  required
                  onChange={(e)=>{setPassword(e.target.value)}}
                  />
                </div>
                <div className="col-12">
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" value="" name="remember_me" id="remember_me"/>
                    <label className="form-check-label text-secondary" htmlFor="remember_me">
                      Nhớ tài khoản
                    </label>
                  </div>
                </div>
                <div className="col-12">
                  <div className="d-grid">
                    <button className="btn bsb-btn-xl bg-login" type="submit">Đăng nhập ngay</button>
                  </div>
                </div>
              </div>
            </form>
            <div className="row">
              <div className="col-12">
                <hr className="mt-5 mb-4 border-secondary-subtle"/>
                <div className="d-flex gap-2 gap-md-4 flex-column flex-md-row justify-content-md-end">
                  <Link to="/dang-ki" className="link-secondary text-decoration-none">Tạo tài khoản</Link>
                  <Link to="#!" className="link-secondary text-decoration-none">Quên mật khẩu</Link>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <p className="mt-5 mb-4">Or sign in with</p>
                <div className="d-flex gap-3 flex-column flex-xl-row">
                  <Link to="#!" className="btn bsb-btn-xl bg-login">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-google" viewBox="0 0 16 16">
                      <path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z" />
                    </svg>
                    <span className="ms-2 fs-6">Google</span>
                  </Link>
                  <Link to="#!" className="btn bsb-btn-xl bg-login">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-facebook" viewBox="0 0 16 16">
                      <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z" />
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
  </div>
</section>
  )
}

export default Login
