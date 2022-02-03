import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Pagination from 'react-js-pagination';
import RoomItems from './room/RoomItems';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { clearErrors } from '../redux/actions/roomActions';
import FilterSearch from './Filter';

const Home = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const { rooms, resPerPage, roomsCount, filteredRoomsCount, error } =
    useSelector((state) => state.getAllRooms);

  let { location, page = 1 } = router.query;
  page = Number(page);

  useEffect(() => {
    toast.error(error);
    dispatch(clearErrors());
  }, [dispatch, error]);

  const handlePagination = (pageNumber) => {
    if (location) {
      let url = window.location.search;

      url.includes('&page')
        ? (url = url.replace(/(page=)[^\&]+/, '$1' + pageNumber))
        : (url = url.concat(`&page=${pageNumber}`));

      router.push(url);
    } else {
      router.push(`/?page=${pageNumber}`);
      // window.location.href = `/?page=${pageNumber}`
    }
  };

  let count = roomsCount;
  if (location) {
    count = filteredRoomsCount;
  }

  return (
    <>
      {/* <div className="container-fluid">
        <div className="row">
          <div className="col-md-12"> */}
      <div className="slider">
        <div className="load"></div>
        <div className="content">
          <div className="principal">
            <h1>Welcome to Blue Planet Hotel</h1>
            <p>The team of Blue Planet Hotel welcomes you.</p>
            <p>Start relaxing yourself and enjoy your stay</p>
            <h4 className="text-warning">Search the Best Rooms we have</h4>
            <FilterSearch />
          </div>
        </div>
      </div>
      {/* </div>
        </div>
      </div> */}
      <section className="container-fluid">
        {/* Search Starts */}
        {/* Search Ends  */}
        <div className="row">
          {rooms && rooms.length === 0 ? (
            <div className="alert alert-danger mt-5 w-100">
              <b>No Rooms.</b>
            </div>
          ) : (
            rooms &&
            rooms.map((room) => <RoomItems key={room._id} room={room} />)
          )}
        </div>
      </section>

      {resPerPage < roomsCount && (
        <div className="d-flex justify-content-center mt-5">
          <Pagination
            activePage={page}
            itemsCountPerPage={resPerPage}
            totalItemsCount={roomsCount}
            onChange={handlePagination}
            nextPageText={'Next'}
            prevPageText={'Prev'}
            firstPageText={'First'}
            lastPageText={'Last'}
            itemClass="page-item"
            linkClass="page-link"
          />
        </div>
      )}
    </>
  );
};

export default Home;
