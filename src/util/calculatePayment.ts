import { ShopCartItem } from '../data/cart/dto/get-cart.dto';

export const calculatePayment = (cartItems: Array<ShopCartItem>) => {
  let subtotal = 0;
  cartItems.forEach((item) => {
    subtotal += item.quantity * item.product.price;
  });
  return {
    subtotal: subtotal,
    tax: Math.round(subtotal * 0.1),
    total: Math.round(subtotal * 1.1),
    shipping: 0,
  };
};
