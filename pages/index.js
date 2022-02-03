import Layout from '../components/layout/Layout';
import Home from '../components/Home';
import { wrapper } from '../redux/store';
import { getAllRooms } from '../redux/actions/roomActions';

export default function Index() {
  return (
    <Layout>
      <Home />
    </Layout>
  );
}

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ req, query }) => {
      await store.dispatch(
        getAllRooms(
          req,
          query.page,
          query.location,
          query.guests,
          query.category,
        ),
      );
    },
);
