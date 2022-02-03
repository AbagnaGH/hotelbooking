import { useState } from 'react';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { signIn } from 'next-auth/client';
import ButtonLoader from '../layout/ButtonLoader';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const submithandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    setLoading(false);
    // console.log(result);
    if (result.error) {
      toast.error(result.error);
    } else {
      window.location.href = '/';
      toast.success('SignIn Success');
    }
  };
  return (
    <div className="container-fluid">
      <div className="row wrapper">
        <div className="col-10 col-lg-5">
          <form className="shadow-lg" onSubmit={submithandler}>
            <h1 className="mb-3">Login</h1>
            <div className="form-group">
              <label htmlFor="email_field">Email</label>
              <input
                type="email"
                id="email_field"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password_field">Password</label>
              <input
                type="password"
                id="password_field"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Link href="/password/forgot">
              <a className="float-right mb-4">Forgot Password?</a>
            </Link>

            <button
              id="login_button"
              type="submit"
              disabled={!email || !password || loading ? true : false}
              className="btn btn-block py-3"
            >
              {loading ? <ButtonLoader /> : 'LOGIN'}
            </button>
            <Link href="/register" className="float-right mt-3">
              <a> New User?</a>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
