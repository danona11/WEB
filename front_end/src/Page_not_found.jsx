import { Link } from "react-router-dom";

const Page_not_found = () => {
    return(
        <div className="page_not_found" style={{textAlign: 'center', marginTop: '50px'}}>
            <h1> Page Not Found </h1>
            <Link to={"/home"}>
                <button>Go Back To Home Page🔙</button>
            </Link>
        </div>    
    );
};

export default Page_not_found; 