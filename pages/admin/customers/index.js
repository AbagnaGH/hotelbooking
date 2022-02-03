import React from 'react';
import { getSession } from 'next-auth/client';

import Layout from '../../../components/layout/Layout';
import AllCustomers from '../../../components/admin/AllCustomers';

const AllCustomersPage = () => {
  return (
    <Layout title="All Users">
      <AllCustomers />
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

export default AllCustomersPage;
