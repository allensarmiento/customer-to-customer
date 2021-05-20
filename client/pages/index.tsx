import Link from 'next/link';
import { ClientRoutes, ServerRoutes } from '../config/routes';

const Home = ({ items }) => {
  const itemList = items.map((item) => {
    return (
      <tr key={item.id}>
        <td>{item.title}</td>
        <td>{item.price}</td>
        <td>
          <Link
            href={`${ClientRoutes.items}/[itemId]`}
            as={`${ClientRoutes.items}/${item.id}`}
          >
            <a className="nav-link">View</a>
          </Link>
        </td>
      </tr>
    );
  });

  return (
    <div>
      <h1>Items</h1>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>
          {itemList}
        </tbody>
      </table>
    </div>
  );
};

Home.getInitialProps = async (context, client) => {
  const { data } = await client.get(ServerRoutes.items);

  return { items: data };
};

export default Home;
