import {useState} from 'react'

const AuthModal = ({setShowModal, isSignUp})=>{

    const [email, setEmail]=useState('')
    const [password, setPassword]=useState('')
    const [confirmPassword, setConfirmPassword]=useState('')
    const [error, setError] = useState('')

    console.log(email, password, confirmPassword)


    const handleClick = ()=>{
       setShowModal(false) 
    }

    const handleSubmit = (e)=>{
        e.preventDefault()
        try{
            if(isSignUp && (password !== confirmPassword)){
                setError("Password need to match")
            }
            console.log('make a post request to database')
        } catch(e){
            console.log(e)
        }
    }

    return(
        <div className="auth-modal">
            <div className="close-icon" onClick={handleClick}>X</div>
            <h2>
                {isSignUp ? "CREATE ACCOUNT" : "LOG IN"}
            </h2>
            <p>By clicking Log In, you agree to our Terms. Learn how we process your data in our Privacy Policy and Cookie Policy.</p>
                <form action="" onSubmit={handleSubmit}>
                    <input type='email' id='email' name='email' placeholder='Email' required onChange={(e)=>setEmail(e.target.value)} />

                    <input type='password' id='password' name='password' placeholder='password' required onChange={(e)=>setPassword(e.target.value)} />

                   {isSignUp && <input type='password' id='password-check' name='password-check' placeholder='Confirm password' required onChange={(e)=>setConfirmPassword(e.target.value)} />}

                    <input className='secondary-button' type='submit' />
                </form>
                <hr />
                <h2>GET THE APP</h2>
            
        </div>
    );
};

export default AuthModal;