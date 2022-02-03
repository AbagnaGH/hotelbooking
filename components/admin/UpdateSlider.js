import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import ButtonLoader from '../layout/ButtonLoader';
import Loader from '../layout/Loader';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Image from 'next/image';
import {
  updateSlider,
  getSliderDetails,
  clearErrors,
} from '../../redux/actions/sliderActions';
import { UPDATE_SLIDER_RESET } from '../../redux/constants/sliderConstants';

const UpdateSlider = () => {
  const [name, setName] = useState('');
  const [images, setImages] = useState([]);
  const [oldImages, setOldImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);

  const dispatch = useDispatch();
  const router = useRouter();

  const { loading, error, isUpdated } = useSelector((state) => state.slider);
  const {
    loading: sliderDetailsLoading,
    error: sliderDetailsError,
    slider,
  } = useSelector((state) => state.getSliderDetails);

  const { id } = router.query;

  useEffect(() => {
    if (slider && slider._id !== id) {
      dispatch(getSliderDetails('', id));
    } else {
      setName(slider.name);
      setOldImages(slider.images);
    }

    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (sliderDetailsError) {
      toast.sliderDetailsError(error);
      dispatch(clearErrors());
    }

    if (isUpdated) {
      dispatch(getSliderDetails('', id));
      router.push('/admin/sliders');
      dispatch({ type: UPDATE_SLIDER_RESET });
    }
  }, [dispatch, router, error, sliderDetailsError, isUpdated, slider, id]);

  const submitHandler = (e) => {
    e.preventDefault();

    const sliderData = {
      name,
    };

    if (images.length !== 0) sliderData.images = images;

    dispatch(updateSlider(slider._id, sliderData));
  };

  const onChange = (e) => {
    const files = Array.from(e.target.files);

    setImages([]);
    setOldImages([]);
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
    <>
      {sliderDetailsLoading ? (
        <Loader />
      ) : (
        <div className="container container-fluid">
          <div className="row wrapper">
            <div className="col-10 col-lg-8">
              <form
                className="shadow-lg"
                onSubmit={submitHandler}
                encType="multipart/form-data"
              >
                <h1 className="mb-4">Update Slider</h1>
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

                  {oldImages &&
                    oldImages.map((img) => (
                      <Image
                        src={img.url}
                        key={img.public_id}
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
                  {loading ? <ButtonLoader /> : 'UPDATE'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UpdateSlider;
