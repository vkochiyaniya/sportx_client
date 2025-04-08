import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCart, removeItem, updateQuantity } from '../redux/CartReducer/action';

const Cart = () => {
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const { userId } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userId) dispatch(fetchCart());
  }, [userId, dispatch]);

  const handleRemove = (cartItemId) => {
    dispatch(removeItem(cartItemId));
  };

  const handleQuantityChange = (cartItemId, newQuantity) => {
    if (newQuantity > 0) {
      dispatch(updateQuantity(cartItemId, newQuantity));
    }
  };

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>
      {cart.map(item => (
        <div key={item.cartItemId} className="cart-item">
          <h3>{item.product.name}</h3>
          <div className="quantity-controls">
            <button 
              onClick={() => handleQuantityChange(item.cartItemId, item.quantity - 1)}
              disabled={item.quantity <= 1}
            >
              -
            </button>
            <span>{item.quantity}</span>
            <button 
              onClick={() => handleQuantityChange(item.cartItemId, item.quantity + 1)}
              disabled={item.quantity >= 10} // Set max quantity limit
            >
              +
            </button>
          </div>
          <button 
            onClick={() => handleRemove(item.cartItemId)}
            className="remove-btn"
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
};

export default Cart;