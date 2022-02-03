import React from 'react';
import { getSession } from 'next-auth/client';

import CustomerUpdate from '../../../components/admin/UpdateCustomer';
import Layout from '../../../components/layout/Layout';

const UpdateCustomerPage = () => {
  return (
    <Layout title="Update Customer">
      <CustomerUpdate />
    </Layout>
  );
};

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });

  if (!session || session.user.role !== 'admin') {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}

export default UpdateCustomerPage;
