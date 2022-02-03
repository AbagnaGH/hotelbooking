import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { MDBDataTable } from 'mdbreact';
import Loader from '../layout/Loader';

import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import {
  getAllUsersByAdmin,
  deleteUser,
  clearErrors,
} from '../../redux/actions/userActions';
import { DELETE_USER_RESET } from '../../redux/constants/userConstants';

const AllUsers = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const { loading, error, users } = useSelector((state) => state.getAllUsers);
  const { error: deleteError, isDeleted } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(getAllUsersByAdmin());

    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (deleteError) {
      toast.erroe(deleteError);
      dispatch(clearErrors());
    }

    if (isDeleted) {
      toast.success('User Deleted Successfully');
      router.push('/admin/users');
      dispatch({ type: DELETE_USER_RESET });
    }
  }, [dispatch, router, error, isDeleted, deleteError]);

  const setUsers = () => {
    const data = {
      columns: [
        {
          label: 'User Image',
          field: 'avatar',
          sort: 'asc',
        },
        // {
        //   label: 'User ID',
        //   field: 'id',
        //   sort: 'asc',
        // },
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

    users &&
      users.forEach((user) => {
        data.rows.push({
          avatar: (
            <Image
              src={user.avatar.url}
              alt="customer image"
              className="img-fluid avatar avatar-128 img-circle img-thumbnail bg-info"
              width="40"
              height="40"
            />
          ),
          // id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          actions: (
            <>
              <Link href={`/admin/users/${user._id}`}>
                <a className="btn btn-primary">
                  <i className="fa fa-pencil"></i>
                </a>
              </Link>

              <button
                className="btn btn-danger mx-2"
                onClick={() => deleteUserHandler(user._id)}
              >
                <i className="fa fa-trash"></i>
              </button>
            </>
          ),
        });
      });

    return data;
  };

  const deleteUserHandler = (id) => {
    dispatch(deleteUser(id));
  };

  return (
    <div className=" container-fluid">
      {loading ? (
        <Loader />
      ) : (
        <>
          <h1 className="my-5 btn btn-primary">{`${
            users && users.length
          } Staff Members`}</h1>

          <MDBDataTable
            data={setUsers()}
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

export default AllUsers;
