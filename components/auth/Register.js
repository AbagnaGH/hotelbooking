import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import ButtonLoader from '../layout/ButtonLoader';
import { registerUser, clearErrors } from '../../redux/actions/userActions';

const Register = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const [avatar, setAvatar] = useState('');
  const [preview, setPreview] = useState('/images/default_avatar.jpg');

  const { success, error, loading } = useSelector((state) => state.auth);

  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '',
    avatar:
      'https://res.cloudinary.com/codesmart/image/upload/v1638015768/bookit/avatars/default_avatar_uqikgw.jpg',
  });
  const { name, email, password } = user;

  useEffect(() => {
    if (success) {
      toast.success('Registration Success');
      router.push('/login');
    }
    if (error) {
      dispatch(clearErrors());
    }
  }, [dispatch, success, error, loading, router]);

  const submithandler = (e) => {
    e.preventDefault();
    const userData = {
      name,
      email,
      password,
      // avatar,
    };
    dispatch(registerUser(userData));
  };

  const onChange = (e) => {
    if (e.target.name === 'avatar') {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setAvatar(reader.result);
          setPreview(reader.result);
        }
      };

      reader.readAsDataURL(e.target.files[0]);
    } else {
      setUser({ ...user, [e.target.name]: e.target.value });
    }
  };

  return (
    <div className=" container-fluid">
      <div className="row wrapper">
        <div className="col-10 col-lg-5">
          <form className="shadow-lg" onSubmit={submithandler}>
            <h1 className="mb-3">Join Us</h1>

            <div className="form-group">
              <label htmlFor="name_field">Full Name</label>
              <input
                type="text"
                id="name_field"
                className="form-control"
                name="name"
                value={name}
                onChange={onChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email_field">Email</label>
              <input
                type="email"
                name="email"
                id="email_field"
                className="form-control"
                value={email}
                onChange={onChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password_field">Password</label>
              <input
                type="password"
                name="password"
                id="password_field"
                className="form-control"
                value={password}
                onChange={onChange}
              />
            </div>

            {/* <div className="form-group">
              <label htmlFor="avatar_upload">Avatar</label>
              <div className="d-flex align-items-center">
                <div>
                  <figure className="avatar mr-3 item-rtl">
                    <img src={preview} className="rounded-circle" alt="image" />
                  </figure>
                </div>
                <div className="custom-file">
                  <input
                    type="file"
                    name="avatar"
                    className="custom-file-input"
                    id="customFile"
                    accept="images/*"
                    onChange={onChange}
                  />
                  <label className="custom-file-label" htmlFor="customFile">
                    Choose Avatar
                  </label>
                </div>
              </div>
            </div> */}

            <button
              id="login_button"
              type="submit"
              disabled={!name || !email || !password || loading ? true : false}
              className="btn btn-block py-3"
            >
              {loading ? <ButtonLoader /> : 'REGISTER'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
