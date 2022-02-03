import React from 'react';
import Layout from '../../../components/layout/Layout';
import { getSession } from 'next-auth/client';
import AllStatstics from '../../../components/admin/AllStatstics';

const AllStatsticsPage = () => {
  return (
    <Layout>
      <AllStatstics title="Statistics" />
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

export default AllStatsticsPage;
