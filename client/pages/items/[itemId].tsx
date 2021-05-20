import Router, { useRouter } from 'next/router';
import { ClientRoutes, ServerRoutes } from '../../config/routes';
import useRequest from '../../hooks/use-request';

const ItemShow = ({ item }) => {
  const router = useRouter();

  const { doRequest, errors } = useRequest({
    url: ServerRoutes.orders,
    method: 'post',
    body: { itemId: item.id },
    onSuccess: (order) => Router.push(
      `${ClientRoutes.orders}/[orderId]`,
      `${ClientRoutes.orders}/${order.id}`,
    ),
  });

  return (
    <div>
      <h1>{item.title}</h1>
      <h4>Price: {item.price}</h4>
      {errors}
      <button className="btn btn-primary" onClick={() => doRequest()}>
        Purchase
      </button>
    </div>
  );
};

ItemShow.getInitialProps = async (context, client) => {
  const { itemId } = context.query;
  const { data } = await client.get(`${ServerRoutes.items}/${itemId}`);

  return { item: data };
};

export default ItemShow;
