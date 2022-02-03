import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { MDBDataTable } from 'mdbreact';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Loader from '../layout/Loader';

import {
  getAllRoomsByAdmin,
  deleteRoom,
  clearErrors,
} from '../../redux/actions/roomActions';

import { DELETE_ROOM_RESET } from '../../redux/constants/roomConstants';

const AllRooms = () => {
  const dispatch = useDispatch();

  const router = useRouter();

  const { loading, rooms, error } = useSelector(
    (state) => state.getAllRoomsByAdmin,
  );
  const { error: deleteError, isDeleted } = useSelector((state) => state.room);

  useEffect(() => {
    dispatch(getAllRoomsByAdmin());
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (deleteError) {
      toast.error(deleteError);
      dispatch(clearErrors());
    }

    if (isDeleted) {
      toast.success('Room Deleted Successfully');
      router.push('/admin/rooms');
      dispatch({ type: DELETE_ROOM_RESET });
    }
  }, [dispatch, deleteError, isDeleted, router, error]);

  const setRooms = () => {
    const data = {
      columns: [
        {
          label: 'Room ID',
          field: 'id',
          sort: 'asc',
        },
        {
          label: 'Name',
          field: 'name',
          sort: 'asc',
        },
        {
          label: 'Price/Night',
          field: 'price',
          sort: 'asc',
        },
        {
          label: 'Category',
          field: 'category',
          sort: 'asc',
        },
        {
          label: 'Actions',
          field: 'actions',
          sort: 'asc',
        },
      ],
      rows: [],
    };

    rooms &&
      rooms.forEach((room) => {
        data.rows.push({
          id: room._id,
          name: room.name,
          price: `GH ${room.pricePerNight}.00`,
          category: room.category,

          actions: (
            <>
              <Link href={`/admin/rooms/${room._id}`}>
                <a className="btn btn-primary">
                  <i className="fa fa-pencil"></i>
                </a>
              </Link>

              <button
                className="btn btn-danger mx-2"
                onClick={() => deleteRoomHandler(room._id)}
              >
                <i className="fa fa-trash"></i>
              </button>
            </>
          ),
        });
      });

    return data;
  };

  const deleteRoomHandler = (id) => {
    dispatch(deleteRoom(id));
  };
  return (
    <div className="container-fluid">
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="row">
            <div className="col-md-6">
              <h1 className="my-5">{`${rooms && rooms.length}  Rooms`}</h1>
            </div>
            <div className="col-md-6">
              <Link href="/admin/rooms/new">
                <a className="mt-5 btn text-white float-right new-room btn-success">
                  {' '}
                  Create New Room
                </a>
              </Link>
            </div>
          </div>
          <MDBDataTable
            data={setRooms()}
            className="px-3"
            bordered
            striped
            hover
          />
        </>
      )}
    </div>
  );
};

export default AllRooms;
