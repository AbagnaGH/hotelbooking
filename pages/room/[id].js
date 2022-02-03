import React from 'react';
import RoomDetails from '../../components/room/RoomDetails';
import Layout from '../../components/layout/Layout';

import { getRoomDetails } from '../../redux/actions/roomActions';

import { wrapper } from '../../redux/store';

export default function RoomDetailsPage() {
  return (
    <Layout>
      <RoomDetails title="Room Details" />
    </Layout>
  );
}

// export const getServerSideProps = wrapper.getServerSideProps(
//   async ({ store, req, params }) => {
//     store.dispatch(getRoomDetails(req, params.roomId));

//     return {
//       props: {
//         roomId: params.roomId,
//       },
//     };
//   },
// );

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ req, res, params }) => {
      await store.dispatch(getRoomDetails(req, params.id));
    },
);


