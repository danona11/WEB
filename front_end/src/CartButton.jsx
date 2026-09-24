import ShoppingCart from './assets/Shopping_cart.png'


export default function CartButton() {

    return(
        <div className="cart" >
            <button className="cart-button" onClick={() => alert('Cart button clicked!')}>    
                <img className="cart-image" src={ShoppingCart} alt="shopping cart" />
                <p className="cart-title">My Cart</p>
            </button>
        </div>


    );

}


