import React from 'react';

import ForgotPassword from '../../components/user/ForgotPassword';
import Layout from '../../components/layout/Layout';
import { getSession } from 'next-auth/client';

const ForgotPasswordPage = () => {
  return (
    <Layout title="Forgot Password">
      <ForgotPassword />
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

export default ForgotPasswordPage;
