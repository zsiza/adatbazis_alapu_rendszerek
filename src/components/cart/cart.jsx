import React from "react";
import "./cart.css";

function Cart() {
  return (
    <div className="cart-container">
      <h2 className="cart-title">Shopping Cart</h2>
      <div className="cart-content">
        <p className="empty-message">Your cart is empty.</p>
      </div>
    </div>
  );
}

export default Cart;
