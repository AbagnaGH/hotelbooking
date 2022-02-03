import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import Loader from '../layout/Loader';

import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import {
  getCustomerDetails,
  UpdateCustomer,
  clearErrors,
} from '../../redux/actions/userActions';
import { UPDATE_CUSTOMER_RESET } from '../../redux/constants/userConstants';
import ButtonLoader from '../layout/ButtonLoader';

const CustomerUpdate = () => {
  const [role, setRole] = useState('');
  const dispatch = useDispatch();
  const router = useRouter();

  const { error, isUpdated } = useSelector((state) => state.customer);
  const { customer, loading } = useSelector((state) => state.customerDetails);

  const customerId = router.query.id;

  useEffect(() => {
    if (customer && customer._id !== customerId) {
      dispatch(getCustomerDetails(customerId));
    } else {
      setRole(customer.role);
    }

    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (isUpdated) {
      toast.success('Customer Updated Successfully');
      router.push('/admin/customers');
      dispatch({ type: UPDATE_CUSTOMER_RESET });
    }
  }, [dispatch, isUpdated, customerId, customer, error, router]);

  const submitHandler = (e) => {
    e.preventDefault();

    const custormerData = {
      role,
    };

    dispatch(UpdateCustomer(customer._id, custormerData));
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className=" container-fluid">
          <div className="row wrapper">
            <div className="col-10 col-lg-5">
              <form className="shadow-lg" onSubmit={submitHandler}>
                <h1 className="mt-2 mb-5">Update Customer</h1>
                <div className="form-group">
                  <label htmlFor="role_field">Role</label>
                  <select
                    id="role_field"
                    className="form-control"
                    name="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="customer">customer</option>
                    {/* <option value="staff">staff</option> */}
                    <option value="admin">admin</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="btn update-btn btn-block mt-4 mb-3"
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

export default CustomerUpdate;
