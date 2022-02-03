import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { MDBDataTable } from 'mdbreact';

import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Loader from '../layout/Loader';

import {
  getAllSlidersByAdmin,
  clearErrors,
} from '../../redux/actions/sliderActions';


const AllSlider = () => {
  const dispatch = useDispatch();

  const router = useRouter();

  const { loading, sliders, error } = useSelector(
    (state) => state.getAllSliders,
  );


  useEffect(() => {
    dispatch(getAllSlidersByAdmin());
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
  }, [dispatch, error, ]);

  const setSliders = () => {
    const data = {
      columns: [
        {
          label: 'Slider ID',
          field: 'id',
          sort: 'asc',
        },
        {
          label: 'Name',
          field: 'name',
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

    sliders &&
      sliders.forEach((slider) => {
        data.rows.push({
          id: slider._id,
          name: slider.name,

          actions: (
            <>
              <Link href={`/admin/sliders/${slider._id}`}>
                <a className="btn btn-primary">
                  <i className="fa fa-pencil"></i>
                </a>
              </Link>

            
            </>
          ),
        });
      });

    return data;
  };

  return (
    <div className="container container-fluid">
      {loading ? (
        <Loader />
      ) : (
        <>
          {/* <h1 className="my-5">{`${rooms && rooms.length}  Rooms`}</h1> */}
          <Link href="/admin/sliders/new">
            <a className="mt-3 btn text-white float-right new-room btn-success">
              {' '}
              Create New Slider
            </a>
          </Link>
          <MDBDataTable
            data={setSliders()}
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

export default AllSlider;
