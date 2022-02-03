import React from 'react';
import { getSession } from 'next-auth/client';
import CreateNewSlider from '../../../components/admin/CreateNewSlider';
import Layout from '../../../components/layout/Layout';

const NewSliderPage = () => {
  return (
    <Layout title="New Slider">
      <CreateNewSlider />
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

export default NewSliderPage;
