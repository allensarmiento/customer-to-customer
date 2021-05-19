import Router from 'next/router';
import { ClientRoutes, ServerRoutes } from '../../config/routes';
import useRequest from '../../hooks/use-request';

const ItemShow = ({ item }) => {
  const { doRequest, errors } = useRequest({
    url: ServerRoutes.orders,
    method: 'post',
    body: { itemId: item.id },
    onSuccess: (order) => Router.push(
      `${ClientRoutes.orders}/[orderId]`,
      `$${ClientRoutes.orders}${order.id}`,
    ),
  });

  return (
    <div></div>
  );
};

export default ItemShow;
