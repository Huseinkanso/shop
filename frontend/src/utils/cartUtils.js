export const addDecimal = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2);
};

export const updateCart=(state)=>{      
      //  calculate items price
      state.itemsPrice = addDecimal(
        state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
      );

      //  calculate shipping price   if order > 100 then free else then 10$ shipping
      state.shippingPrice = addDecimal(state.itemsPrice > 100 ? 0 : 10);

      // calculate tax price 15% of items price
      state.taxPrice = addDecimal(Number((0.15 * state.itemsPrice).toFixed(2)));

      // calculate total price
      state.totalPrice = addDecimal(
        Number(state.itemsPrice) +
          Number(state.shippingPrice) +
          Number(state.taxPrice)
      );

      localStorage.setItem("cart", JSON.stringify(state));
      return state;
}