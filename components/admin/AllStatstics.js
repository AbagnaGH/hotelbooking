/* eslint-disable no-new */
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Chart from 'react-google-charts';
import toast from 'react-toastify';
import Loader from '../layout/Loader';

import {
  summaryBooking,
  clearErrors,
} from '../../redux/actions/bookingActions';

const AllStatstics = () => {
  const dispatch = useDispatch();

  const { loading, summary, error } = useSelector(
    (state) => state.bookingSummary,
  );
  // console.log('DATA===>', summary && summary);
  useEffect(() => {
    dispatch(summaryBooking());
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
  }, [dispatch, error]);

  return (
    <div className="container-fluid">
      {loading ? (
        <Loader />
      ) : (
        <>
          <h1 className="btn btn-primary mt-2">Statistics Page</h1>
          <div className="row statistics">
            <div className="col-md-3">
              <div className="card text-white bg-primary">
                <div className="card-body">
                  <h5 className="card-title">
                    {' '}
                    <span>
                      <i className="fa fa-users" /> Total Customers
                    </span>
                  </h5>
                  <p className="card-text">
                    <h1>
                      {summary.customers[0]
                        ? summary.customers[0].numCustomers
                        : 0}
                    </h1>
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card text-white bg-success">
                <div className="card-body">
                  <h5 className="card-title">
                    {' '}
                    <span>
                      <i className="fa fa-money" /> Total Sales
                    </span>
                  </h5>
                  <p className="card-text">
                    <h1>
                      <pre>
                        GHS {''}
                        {summary.bookings[0]
                          ? summary.bookings[0].totalSales * (0.01).toFixed(2)
                          : 0}
                      </pre>
                    </h1>
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card text-white bg-info">
                <div className="card-body">
                  <h5 className="card-title">
                    {' '}
                    <span>
                      <i className="fa fa-hotel" /> Total Rooms
                    </span>
                  </h5>

                  <p className="card-text">
                    <h1>
                      {summary.roomstotal[0]
                        ? summary.roomstotal[0].totalRooms
                        : 0}
                    </h1>
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card text-white bg-danger">
                <div className="card-body">
                  <h5 className="card-title">
                    <span>
                      <i className="fa fa-book" /> Total Bookings
                    </span>
                  </h5>
                  <p className="card-text">
                    <h1>
                      {summary.bookings[0]
                        ? summary.bookings[0].numBookings
                        : 0}
                    </h1>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="row mt-5">
            <div className="col-md-6 mt-5">
              <h2 className="btn btn-success">Daily Sales</h2>
              {summary.dailyBookings.length === 0 ? (
                <Loader />
              ) : (
                <Chart
                  width="100%"
                  height="400px"
                  chartType="Bar"
                  // chartType="LineChart"
                  // chartType="AreaChart"
                  // chartType="PieChart"
                  // chartType="ColumnChart"
                  loader={<div>Loading Chart.....</div>}
                  data={[
                    [
                      'Date',
                      'Sales',
                      'Bookings',
                      'Average Price',
                      'Max. Price',
                      'Min. Price',
                      'Total Days of Stay',
                    ],
                    ...summary.dailyBookings.map((x) => [
                      x._id,
                      x.sales * 0.01,
                      x.bookings,
                      x.avgPrice * 0.01,
                      x.maxPrice * 0.01,
                      x.minPrice * 0.01,
                      x.numDaysOfStay,
                    ]),
                  ]}
                ></Chart>
              )}
            </div>

            <div className="col-md-6 mt-5">
              <h2 className="btn btn-info">Rooms Base Categories</h2>
              {summary.roomstats.length === 0 ? (
                <Loader />
              ) : (
                <Chart
                  width="100%"
                  height="400px"
                  // chartType="PieChart"
                  chartType="Bar"
                  loader={<div>Loading Chart...</div>}
                  data={[
                    [
                      'Category',
                      'Number of Rooms',
                      'Max. Price',
                      'Average Price',
                      'Min. Price',
                      'Total of Rattings',
                    ],
                    ...summary.roomstats.map((x) => [
                      x._id,
                      x.numRooms,
                      x.maxPrice,
                      x.avgPrice,
                      x.minPrice,
                      x.numRatings,
                    ]),
                  ]}
                />
              )}
            </div>

            {/* ************************************************************************** */}
            <div className="col-md-6 mt-5">
              <h2 className="btn btn-danger">Daily Customers</h2>
              {summary.roomstats.length === 0 ? (
                <Loader />
              ) : (
                <Chart
                  width="100%"
                  height="400px"
                  chartType="PieChart"
                  // chartType="Bar"
                  loader={<div>Loading Chart...</div>}
                  data={[
                    ['Customers', 'Number Customers'],
                    ...summary.dailyCustomers.map((x) => [
                      x._id,
                      x.numCustomers,
                    ]),
                  ]}
                />
              )}
            </div>
            {/* ****************************************************************** */}
            <div className="col-md-6 mt-5">
              <h2 className="btn btn-primary">Daily Bookings</h2>
              {summary.roomstats.length === 0 ? (
                <Loader />
              ) : (
                <Chart
                  width="100%"
                  height="400px"
                  chartType="PieChart"
                  // chartType="Bar"
                  loader={<div>Loading Chart...</div>}
                  data={[
                    ['Bookings', 'Number of Bookings'],
                    ...summary.dailyReservation.map((x) => [
                      x._id,
                      x.numReservation,
                    ]),
                  ]}
                />
              )}
            </div>
            {/* ****************************************************************** */}
            <div className="col-md-11 mt-5">
              <h2 className="btn btn-primary">Monthly Bookings</h2>
              {summary.roomstats.length === 0 ? (
                <Loader />
              ) : (
                <Chart
                  width="100%"
                  height="500px"
                  // chartType="LineChart"
                  chartType="AreaChart"
                  loader={<div>Loading Chart...</div>}
                  options={{
                    hAxis: {
                      title: 'Months',
                    },
                    vAxis: {
                      title: 'Sales',
                    },
                  }}
                  data={[
                    ['Months', 'Sales'],
                    ...summary.mothlyIncome.map((x) => [x._id, x.total * 0.01]),
                  ]}
                />
              )}
            </div>
            {/* ****************************************************************** */}
          </div>
        </>
      )}
    </div>
  );
};

export default AllStatstics;
