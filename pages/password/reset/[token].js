import React from 'react';

import NewPassword from '../../../components/user/NewPassword';
import Layout from '../../../components/layout/Layout';
import { getSession } from 'next-auth/client';

const NewPasswordPage = () => {
  return (
    <Layout title="New Password">
      <NewPassword />
    </Layout>
  );
};

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });

  if (session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}

export default NewPasswordPage;
