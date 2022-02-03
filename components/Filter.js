import React, { useState } from 'react';
import { useRouter } from 'next/router';

function Filter() {
  const router = useRouter();
  const [location, setLocation] = useState('');
  const [guests, setGuests] = useState('');
  const [category, setCategory] = useState('');

  const submitHandler = (e) => {
    e.preventDefault();
    if (location.trim()) {
      router.push(
        `/?location=${location}&guests=${guests}&category=${category}`,
      );
    } else {
      router.push('/');
    }
  };

  return (
    <div className="container-fluid">
      <form className="m-3" onSubmit={submitHandler}>
        <div className="row">
          <div className="col-md-3 m-1">
            <select
              className="form-control"
              id="room_type_field"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {['Kings', 'Queens', 'twins', 'Single'].map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-3 m-1">
            <input
              type="text"
              className="form-control"
              id="location_field"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div className="col-md-3 m-1">
            <select
              className="form-control"
              id="guest_field"
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
            >
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-3 m-1">
            <button type="submit" className="btn btn-danger btn-block">
              Search
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Filter;
