import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import ButtonLoader from '../layout/ButtonLoader';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { newRoom, clearErrors } from '../../redux/actions/roomActions';
import { NEW_ROOM_RESET } from '../../redux/constants/roomConstants';

const NewRoom = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState(
    'Find plenty of space for a family or a large group at this picturesque Wells home, the perfect spot for a relaxing getaway in charming, quintessential Maine style! Spend your days on the beautiful nearby beaches, and come home to a large backyard and orchard where your kids can play, as well as a patio with a gas grill for barbecues on summer afternoons.',
  );
  const [address, setAddress] = useState('Sunyani');
  const [category, setCategory] = useState('Kings');
  const [guestCapacity, setGuestCapacity] = useState(1);
  const [numOfBeds, setNumOfBeds] = useState(1);
  const [internet, setInternet] = useState(false);
  const [breakfast, setBreakfast] = useState(false);
  const [airConditioned, setAirConditioned] = useState(false);
  const [gym, setGym] = useState(false);
  const [swimmingPool, setSwimmingPool] = useState(false);

  const [images, setImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);

  const dispatch = useDispatch();
  const router = useRouter();

  const { loading, error, success } = useSelector(
    (state) => state.createNewRoom,
  );

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (success) {
      toast.success('Room Created Successfully');
      router.push('/admin/rooms');
      dispatch({ type: NEW_ROOM_RESET });
    }
  }, [dispatch, error, success, router]);

  const submitHandler = (e) => {
    e.preventDefault();

    const roomData = {
      name,
      pricePerNight: price,
      description,
      address,
      category,
      guestCapacity: Number(guestCapacity),
      numOfBeds: Number(numOfBeds),
      internet,
      breakfast,
      airConditioned,
      gym,
      swimmingPool,
      images,
    };

    if (images.length === 0) return toast.error('Please upload images.');

    dispatch(newRoom(roomData));
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
            <h1 className="mb-4">New Room</h1>
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
            <div className="form-group">
              <label htmlFor="price_field">Price</label>
              <input
                type="text"
                id="price_field"
                className="form-control"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="description_field">Description</label>
              <textarea
                className="form-control"
                id="description_field"
                rows="8"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              ></textarea>
            </div>
            <div className="form-group">
              <label htmlFor="address_field">Address</label>
              <input
                type="text"
                id="address_field"
                className="form-control"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="category_field">Category</label>
              <select
                className="form-control"
                id="room_type_field"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {['Kings', 'Queens', 'Single', 'Twins'].map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="category_field">Guest Capacity</label>
              <select
                className="form-control"
                id="guest_field"
                value={guestCapacity}
                onChange={(e) => setGuestCapacity(e.target.value)}
              >
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="category_field">Number of Beds</label>
              <select
                className="form-control"
                id="numofbeds_field"
                value={numOfBeds}
                onChange={(e) => setNumOfBeds(e.target.value)}
              >
                {[1, 2, 3].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </div>

            <label className="mb-3">Room Features</label>
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="internet_checkbox"
                value={internet}
                onChange={(e) => setInternet(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="internet_checkbox">
                Internet
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="breakfast_checkbox"
                value={breakfast}
                onChange={(e) => setBreakfast(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="breakfast_checkbox">
                Breakfast
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="airConditioned_checkbox"
                value={airConditioned}
                onChange={(e) => setAirConditioned(e.target.checked)}
              />
              <label
                className="form-check-label"
                htmlFor="airConditioned_checkbox"
              >
                Air Conditioned
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="gym_checkbox"
                value={gym}
                onChange={(e) => setGym(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="gym_checkbox">
                Gym Allowed
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="swimmingPool_checkbox"
                value={swimmingPool}
                onChange={(e) => setSwimmingPool(e.target.checked)}
              />
              <label
                className="form-check-label"
                htmlFor="swimmingPool_checkbox"
              >
                Swimming Pool Allowed
              </label>
            </div>

            <div className="form-group mt-4">
              <label>Images</label>
              <div className="custom-file">
                <input
                  type="file"
                  name="room_images"
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

export default NewRoom;
