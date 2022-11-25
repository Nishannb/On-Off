import { useState } from "react";
import Nav from "../components/Nav";
import { useCookies } from 'react-cookie'
import axios from "axios";
import { useNavigate } from "react-router-dom";

const OnBoarding = ()=>{

    let navigate = useNavigate('')

    const [cookies, setCookie, removeCookie] = useCookies(['user']);
    const[formData, setFormData] = useState({
        user_id: cookies.UserId,
        firstname: '',
        dob_day:"",
        dob_month: "",
        dob_year: "",
        show_gender: false,
        gender_identity: "man",
        gender_interest: "woman",
        url:"",
        about:"",
        matches:[]
    })

    const handleSubmit =async(e)=>{
        e.preventDefault();
        try {
            const response = await axios.put('http://localhost:8000/user', {formData});
            const success = response.status === 200;
            if(success) navigate('/dashboard');
        } catch(e){
            console.log(e)
        }
    }

    const handleChange =(e)=>{
        console.log(e)
        const value = e.target.type ==='checkbox' ? e.target.checked : e.target.value
        const name = e.target.name

        setFormData((prevState)=>({
            ...prevState,
            [name]: value,
        }))
    }

    return(
        <>
            <Nav minimal={true} setShowModal={()=>{}} showModal={false} />
            
            <div className="onboarding">
                <h2>CREATE ACCOUNT</h2>

                <form action="" onSubmit={handleSubmit}>
                    <section>
                        <label htmlFor="firstname">First Name: </label>
                        <input type="text" id="firstname" name="firstname" placeholder="First Name" required value={formData.firstname} onChange={handleChange} />

                        <label>Birthday: </label>
                        <div className="multiple-input-container">
                            <input type="number" id="dob_day" name="dob_day" placeholder="DD" required value={formData.dob_day} onChange={handleChange} />

                            <input type="number" id="dob_month" name="dob_month" placeholder="MM" required value={formData.dob_month} onChange={handleChange} />

                            <input type="number" id="dob_year" name="dob_year" placeholder="YYYY" required value={formData.dob_year} onChange={handleChange} />
                        </div>

                        <label>Gender: </label>
                         <div className="multiple-input-container">
                            <input type="radio" id="man-gender-identity" name="gender_identity"required value='man' onChange={handleChange}
                            checked={formData.gender_identity ==='man'} />
                            <label htmlFor="man-gender-identity">Man</label>

                            <input type="radio" id="woman-gender-identity" name="gender_identity"required value='woman' onChange={handleChange}
                            checked={formData.gender_identity ==='woman'} />
                            <label htmlFor="woman-gender-identity">Woman</label>

                            <input type="radio" id="more-gender-identity" name="gender_identity"required value='more' onChange={handleChange}
                            checked={formData.gender_identity ==='more'} />
                            <label htmlFor="more-gender-identity">More</label>
                        </div>

                        <label htmlFor="show-gender">Show gender on my profile</label>
                         <input 
                            type="checkbox" id="show-gender" name="show_gender" value='more' onChange={handleChange}
                            checked={formData.show_gender} 
                         />

                         <label>Show me</label>
                         <div className="multiple-input-container">
                            <input type="radio" id="man-gender-interest" name="gender_interest"required value='man' onChange={handleChange}
                            checked={formData.gender_interest ==='man'} />
                            <label htmlFor="man-gender-interest">Man</label>

                            <input type="radio" id="woman-gender-interest" name="gender_interest"required value='woman' onChange={handleChange}
                            checked={formData.gender_interest ==='woman'} />
                            <label htmlFor="woman-gender-interest">Woman</label>

                            <input type="radio" id="everyone-gender-interest" name="gender_interest"required value='everyone' onChange={handleChange}
                            checked={formData.gender_interest ==='everyone'} />
                            <label htmlFor="everyone-gender-interest">Everyone</label>

                         </div>

                         <label htmlFor="about">About me</label>
                         <input 
                            type="text" 
                            id="about"
                            name="about"
                            required = {true}
                            placeholder='I like long walks..'
                            value={formData.about}
                            onChange={handleChange}
                        />

                        <input type="submit" />
                    </section>

                    <section>
                    <label htmlFor="profile-photos">Profile Photo</label>
                    <input 
                        type="url" 
                        id="url"
                        name="url"
                        required={true}
                        onChange={handleChange}
                    />
                    <div className="photo-container">
                        {formData.url && <img src={formData.url} alt='Profile pic' />}
                    </div>
                    </section>
                </form>
            </div>
        </>
    );
};

export default OnBoarding;