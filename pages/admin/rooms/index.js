import React from 'react';
import Layout from '../../../components/layout/Layout';
import AllRooms from '../../../components/admin/AllRooms';
import { getSession } from 'next-auth/client';

const AllRoomsPage = () => {
  return (
    <Layout>
      <AllRooms title="All Rooms" />
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

export default AllRoomsPage;
