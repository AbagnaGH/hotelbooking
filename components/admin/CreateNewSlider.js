import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import ButtonLoader from '../layout/ButtonLoader';

import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Image from 'next/image';
import { newSlider, clearErrors } from '../../redux/actions/sliderActions';
import { NEW_SLIDER_RESET } from '../../redux/constants/sliderConstants';

const NewSlider = () => {
  const [name, setName] = useState('');
  const [images, setImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);

  const dispatch = useDispatch();
  const router = useRouter();

  const { loading, error, success } = useSelector(
    (state) => state.createNewSlider,
  );

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (success) {
      toast.success('Slider Created Successfully');
      router.push('/admin/sliders');
      dispatch({ type: NEW_SLIDER_RESET });
    }
  }, [dispatch, error, success, router]);

  const submitHandler = (e) => {
    e.preventDefault();

    const sliderData = {
      name,
      images,
    };

    if (images.length === 0) return toast.error('Please upload images.');

    dispatch(newSlider(sliderData));
  };

  const onChange = (e) => {
    const files = Array.from(e.target.files);

    setImages([]);
    setImagesPreview([]);

    files.forEach((file) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setImages((oldArray) => [...oldArray, reader.result]);
          setImagesPreview((oldArray) => [...oldArray, reader.result]);
        }
      };

      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="container container-fluid">
      <div className="row wrapper">
        <div className="col-10 col-lg-8">
          <form
            className="shadow-lg"
            onSubmit={submitHandler}
            encType="multipart/form-data"
          >
            <h1 className="mb-4">New Slider</h1>
            <div className="form-group">
              <label htmlFor="name_field">Name</label>
              <input
                type="text"
                id="name_field"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-group mt-4">
              <label>Images</label>
              <div className="custom-file">
                <input
                  type="file"
                  name="slider_images"
                  className="custom-file-input"
                  id="customFile"
                  onChange={onChange}
                  multiple
                />
                <label className="custom-file-label" htmlFor="customFile">
                  Choose Images
                </label>
              </div>

              {imagesPreview.map((img) => (
                <Image
                  src={img}
                  key={img}
                  alt="Images Preview"
                  className="mt-3 mr-2"
                  width="55"
                  height="52"
                />
              ))}
            </div>
            <button
              type="submit"
              className="btn btn-block new-room-btn py-3"
              disabled={loading ? true : false}
            >
              {loading ? <ButtonLoader /> : 'CREATE'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewSlider;
