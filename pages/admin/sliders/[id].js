import React from 'react';
import { getSession } from 'next-auth/client';

import UpdateSlider from '../../../components/admin/UpdateSlider';
import Layout from '../../../components/layout/Layout';

const UpdateSliderPage = () => {
  return (
    <Layout title="Update Slider">
      <UpdateSlider />
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

export default UpdateSliderPage;
