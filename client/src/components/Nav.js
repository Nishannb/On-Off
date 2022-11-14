import colorlogo from "../images/color-logo-tinder.png"
import whitelogo from '../images/tinder_logo_white.png'

const Nav = ({minimal, setShowModal, showModal, setIsSignUp})=>{

    const handleClick =()=>{
        setShowModal(true)
        setIsSignUp(false)
    }

    const authToken = false
    return(
        <nav>
            <div className="logo-container">
                <img className="logo" src={minimal ? colorlogo : whitelogo} />
            </div>

            {!authToken && !minimal && <button className="nav-button"
            onClick={handleClick}
            disabled={showModal}>Log in</button>}
        </nav>
    );
};

export default Nav;