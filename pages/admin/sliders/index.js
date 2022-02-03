import React from 'react';
import Layout from '../../../components/layout/Layout';
import AllSliders from '../../../components/admin/AllSliders';
import { getSession } from 'next-auth/client';

const AllSlidersPage = () => {
  return (
    <Layout>
      <AllSliders title="All Sliders" />
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

export default AllSlidersPage;
