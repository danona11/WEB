import CartButton from './CartButton.js'

export default function Home() {
    return (
        <div className="home" style={{textAlign: 'center', marginTop: '50px'}}>
            
            <h1>Football Kits</h1>
            
            <br></br>
            
            <form className="search-bar" style={{display: 'flex', alignItems: 'center' , justifyContent: 'center'}} 

                onSubmit={(e) => { e.preventDefault(); console.log("Search submitted"); }}>
                    
                <input type="text" placeholder="Search..." />
                <button type="submit" >🔍</button>
                <CartButton />
            </form>
        </div>
        

        
    )

}