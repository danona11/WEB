import { Link } from "react-router-dom";

export default function PageNotFound() {
    
    return(
        <div className="page-not-found" style={{textAlign: 'center', marginTop: '50px'}}>
            <h1> Page Not Found </h1>
            <Link to={"/Home"}>
                <button>Go Back To Home Page🔙</button>
            </Link>
        </div>    
    );
};

