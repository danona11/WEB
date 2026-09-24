import shopping_cart from './assets/shopping_cart.png'


export default function Cart_button() {

    return( //switch to (href) link to cart page when implemented
        <div className="cart" >
            <button className="cart-button" onClick={() => alert('Cart button clicked!')}>    
                <img className="cart-image" src={shopping_cart} alt="shopping cart" />
                <p className="cart-title">My Cart</p>
            </button>
        </div>


    );

}


