export default function CartButton() {
    return (
        <div className="cart">
            <button className="cart-button" onClick={() => alert('Cart button clicked!')}>
                <svg
                    className="cart-image"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    focusable="false"
                >
                    <path
                        d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2S15.9 22 17 22s2-.9 2-2-.9-2-2-2zM7.17 14h9.92c.75 0 1.41-.41 1.75-1.03L22 6H6.21l-.94-2H2v2h2l3.6 7.59-1.35 2.44C5.52 16.37 6.48 18 8 18h12v-2H8l1.1-2z"
                        fill="currentColor"
                    />
                </svg>
                <p className="cart-title">My Cart</p>
            </button>
        </div>
    );
}


