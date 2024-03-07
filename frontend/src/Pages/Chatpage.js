import React, { useEffect, useState } from "react";
import axios from "axios";
const Chatpage = () => {
  const [chats, setChats] = useState([]);
  const fetchChats = async () => {
    const responsedata = await axios.get("/api/chat");
    //console.log(data);
    //
    setChats(responsedata.data);
  };

// const fetchChats = async () => {
//   try {
//     const response = await axios.get("/api/chat");
//     setChats(response.data); // Assuming response.data is an array
//   } catch (error) {
//     console.error("Error fetching chats:", error);
//     // Handle error gracefully (e.g., display error message to user)
//   }
// };

  useEffect(() => {
    fetchChats();
  }, []);

  return (
    <div>
      {chats.map((chat) => (
        <div key={chat._id}>{chat.chatName}</div>
      ))}
    </div>
  );
};

export default Chatpage;
