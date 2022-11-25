import axios from "axios";
import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";

const MatchesDisplay = ({matches, setClickedUser})=>{

    const [ matchedProfile , setMatchedProfile] = useState(null)
    const [cookies, setCookie, removeCookie] = useCookies('')

    const matchedUserIds = matches.map(({user_id}) => user_id)
    const userId = cookies.UserId

    const getMatches = async ()=>{
        try{
            const response = await axios.get('http://localhost:8000/users', 
            {params:{userIds: JSON.stringify(matchedUserIds)}})
            setMatchedProfile(response.data)
        } catch(e){
            console.log(e)
        }
    }

    useEffect(()=>{
        getMatches()
    }, [matches])

 const filteredMatchedProfiles = matchedProfile?.filter(
    (onematchedProfile) =>
      onematchedProfile.matches.filter((profile) => profile.user_id === userId)
        .length > 0
  );

    return (
    <div className="matches-display">
        {filteredMatchedProfiles && filteredMatchedProfiles?.map((match, _index) => (
            <div key={match.user_id} className="match-card" onClick={() => setClickedUser(match)}>
                <div className="img-container">
                    <img src={match?.url} alt={match?.first_name + " Profile"} />
                </div>
                <h3>{match?.first_name} </h3>
            </div>
        )) }
    </div>)
}

export default MatchesDisplay;