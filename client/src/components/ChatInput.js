import { useState } from "react";
import axios from "axios";

const ChatInput = ({user, clickedUser, getUserMessages, getClickedUserMessages})=>{
    const [textarea, setTextArea] = useState('')
    const userId = user?.user_id
    const clickedUserId = clickedUser?.user_id

    const addMessage = async()=>{
        const message = {
            timestamp: new Date().toISOString(),
            from_userId: userId,
            to_userId: clickedUserId,
            message: textarea
        }

        try{
            await axios.post("http://localhost:8000/message", {message})
            getUserMessages()
            getClickedUserMessages()
            setTextArea("")
        } catch(e){
            console.log(e)
        }
    }

    return (
    <div className="chat-input">
        <textarea value={textarea} onChange={(e)=> setTextArea(e.target.value)} />
        <button className="secondary-button" onClick={addMessage}>Submit</button>
    </div>)
}

export default ChatInput;