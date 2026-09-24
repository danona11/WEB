function Button(){
    /*inline styling - good fo isolated components, but not for reusability.
        For reusability, CSS modules are better. 
    */

    const styles = {
            backgroundColor: '#08809d',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            padding: '10px 20px',
            cursor: 'pointer'
        }

    return (
        <button style={styles}>Click me</button>

    );
}

export default Button;
