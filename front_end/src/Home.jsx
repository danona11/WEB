import CartButton from './CartButton.jsx'

export default function Home() {
    return (
        <div className="home" style={{textAlign: 'center', marginTop: '50px'}}>
            
            <h>Football Kits</h>
            
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