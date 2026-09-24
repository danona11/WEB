import profilePic from './assets/bibi.png'
function Card() {
    return (
        <div className="card" >
            <button>
                <img className="card-image" src={profilePic} alt="profile picture" />   
                <h2 className="card-title">Daniel</h2>
                <p className="card-description">Software Engineer and play football</p>
            </button>
        </div>
    );
}

export default Card;