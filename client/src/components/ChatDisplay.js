import axios from "axios";
import { useEffect, useState } from "react";
import Chat from "./Chat";
import ChatInput from "./ChatInput";

const ChatDisplay = ({user, clickedUser })=>{
    const userId = user?.user_id
    const clickedUserId = clickedUser?.user_id

    const [usersMessages, setUsersMessages] = useState(null)
    const [clickedUsersMessages, setClickedUsersMessages] = useState(null)

    const getUserMessages = async() =>{
        try{
            const response = await axios.get('http://localhost:8000/messages', {
            params: {userId: userId, correspondingUserId: clickedUserId }
        })
        setUsersMessages(response.data)
    } catch(e){
        console.log(e)
    }}

    const getClickedUserMessages = async() =>{
        try{
            const response = await axios.get('http://localhost:8000/messages', {
            params: {userId: clickedUserId, correspondingUserId: clickedUserId }
        })
        setClickedUsersMessages(response.data)
    } catch(e){
        console.log(e)
    }}

    useEffect(()=>{
         getUserMessages()
        getClickedUserMessages()
    }, [])
    
    const messages = []

    usersMessages?.forEach(message=>{
        const formattedMessages = {}
        formattedMessages['name'] = user?.first_name
        formattedMessages['img'] = user?.url
        formattedMessages['message'] = message.message
        formattedMessages['timestamp'] = message.timestamp
        messages.push(formattedMessages)
    }) 

    clickedUsersMessages?.forEach(message=>{
        const formattedMessages = {}
        formattedMessages['name'] = clickedUser?.first_name
        formattedMessages['img'] = clickedUser?.url
        formattedMessages['message'] = message.message
        formattedMessages['timestamp'] = message.timestamp
        messages.push(formattedMessages)
    }) 

    const descendingOrderMessages = messages?.sort((a,b)=> a.timestamp.localeCompare(b.timestamp))
    
    return (
   <>
   <Chat descendingOrderMessages = {descendingOrderMessages} />

   <ChatInput 
        user={user}
        clickedUser={clickedUser}
        getUserMessages={getUserMessages}
        getClickedUserMessages={getClickedUserMessages}
    />
   </>
)}

export default ChatDisplay;