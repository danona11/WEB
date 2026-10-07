import { useState } from "react";




export default function Cart() {

    const [cart, setCart] = useState(<Cart />);
















    return (
        <div className="cart">
            <h1>Your Cart</h1>
            <p>your cart size: 0</p>
        </div>
    );
}