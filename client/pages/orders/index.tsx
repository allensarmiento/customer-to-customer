import { ServerRoutes } from '../../config/routes';

const OrderIndex = ({ orders }) => {
  return (
    <ul>
      {orders.map((order) => (
        <li key={order.id}>
          {order.item.title} - {order.status}
        </li>
      ))}
    </ul>
  );
};

OrderIndex.getInitialProps = async (context, client) => {
  const { data } = await client.get(ServerRoutes.orders);

  return { orders: data };
};

export default OrderIndex;
