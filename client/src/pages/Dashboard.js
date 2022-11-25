import { useState, useEffect } from "react";
import TinderCard from "react-tinder-card";
import ChatContainer from "../components/ChatContainer";
import { useCookies } from "react-cookie";
import axios from "axios";

const Dashboard = ()=>{

    const [genderedUser, setGenderedUsers]= useState(null)
    const [user, setUser]= useState('')
    const[cookies, setCookie, removeCookie]= useCookies(['user'])
    const [lastDirection, setLastDirection] = useState()

    const userId = cookies.UserId;

    const getUser = async()=>{
        try{
            const response = await axios.get('http://localhost:8000/user', {params:{userId}})
            setUser(response.data)
        } catch(e){
            console.log(e)
        }
    }

    const getGenderedUsers = async()=>{
        try{
            const response = await axios.get('http://localhost:8000/gendered-users',{ 
                params: { gender: user.gender_interest }
            });
            setGenderedUsers(response.data)
        } catch(e){
            console.log(e)
        }
    }

    useEffect(()=>{
        getUser()
    }, []);

    useEffect(()=>{
        if(user){
            getGenderedUsers()
        }
    }, [user])

    
    const updateMatches = async(matchedUserId) =>{
        try{
            await axios.put('http://localhost:8000/addmatch', {
                userId,
                matchedUserId
            })
            getUser()
        } catch(error){
            console.log(error)
        }
    }



    const swiped = (direction, swipedUserId)=>{
        if(direction === 'right'){
            updateMatches(swipedUserId)
        }
        setLastDirection(direction)
    }

    const outOfFrame = (name)=>{
        console.log(name + 'left the screen!')
    }

    // console.log(user.matches)

    const matchedUserIds = user.matches?.map(({user_id}) => user_id).concat(userId)

    const filteredGenderedUsers = genderedUser?.filter(
        onegenderedUser => !matchedUserIds.includes(onegenderedUser.user_id)
    )
    return(
        <>
        {user && 
            <div className="dashboard">
                <ChatContainer user={user}/>
                <div className="swiper-container">
                    <div className="card-container">

                        {filteredGenderedUsers && filteredGenderedUsers.map((genderedUser)=>
                            <TinderCard
                                className="swipe" 
                                key={genderedUser.first_name} 
                                onSwipe={(dir) => swiped(dir,genderedUser.user_id)} 
                                onCardLeftScreen={()=> outOfFrame(genderedUser.first_name)}>

                                <div style={{backgroundImage: `url(`+ genderedUser.url +`)`}} className='card'>
                                    <h3>{genderedUser.first_name}</h3>
                                </div>
                            </TinderCard>
                        )}
                        <div className="swipe-info">
                            {lastDirection ? <p>You Swipe {lastDirection}</p> : <p/>}
                        </div>
                    </div>
                </div>
            </div>
        }
        </>
    );
};

export default Dashboard;