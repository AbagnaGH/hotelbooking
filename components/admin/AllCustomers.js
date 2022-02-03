import React, { useEffect } from 'react';
import Link from 'next/link';
import { MDBDataTable } from 'mdbreact';
import Loader from '../layout/Loader';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Image from 'next/image';
import {
  getAllCustomersByAdmin,
  clearErrors,
} from '../../redux/actions/userActions';

const AllCustomers = () => {
  const dispatch = useDispatch();

  const { loading, error, customers } = useSelector(
    (state) => state.getAllCustomers,
  );
  console.log(customers);

  useEffect(() => {
    dispatch(getAllCustomersByAdmin());
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
  }, [dispatch, error]);

  const setCustomers = () => {
    const data = {
      columns: [
        {
          label: 'User Image',
          field: 'avatar',
          sort: 'asc',
        },
        {
          label: 'JOINED DATE',
          field: 'created',
          sort: 'asc',
        },
        {
          label: 'Name',
          field: 'name',
          sort: 'asc',
        },
        {
          label: 'Email',
          field: 'email',
          sort: 'asc',
        },
        {
          label: 'Role',
          field: 'role',
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

    customers &&
      customers.forEach((customer) => {
        data.rows.push({
          avatar: (
            <Image
              src={customer.avatar.url}
              alt="customer image"
              className="img-fluid avatar avatar-128 img-circle img-thumbnail bg-info"
              width="40"
              height="40"
            />
          ),
          created: new Date(customer.createdAt).toLocaleString('en-US'),
          name: customer.name,
          email: customer.email,
          role: customer.role,
          actions: (
            <>
              <Link href={`/admin/customers/${customer._id}`}>
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
    <div className=" container-fluid">
      {loading ? (
        <Loader />
      ) : (
        <>
          <h1 className="my-5 btn btn-primary">{`${
            customers && customers.length
          } Customers`}</h1>

          <MDBDataTable
            data={setCustomers()}
            className="px-3 table-responsive"
            bordered
            striped
            hover
          />
        </>
      )}
    </div>
  );
};

export default AllCustomers;
