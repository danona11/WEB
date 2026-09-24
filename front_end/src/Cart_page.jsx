export default function Cart_page(props) {

    return (
        <>
        <div className="cart-page">
            <h1>Your Cart</h1>
            <p>your cart size: {props.cartSize}</p>
        </div>

        <button className="back-button" onClick={props.onClose}>
            Back to Shopping
        </button>

        </>
    );

}