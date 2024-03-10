import React, { useEffect, useState } from "react";
import axios from "axios";
const Chatpage = () => {
  //UseState allows functionl components to manage state. State in React
  // represents data that can change over time and can affect what is
  //rendered in the user interface. UseState returns a pair of values:the
  // current value (stored in a variable), and a function to update that value.
  //Here we have initialozed state with a value of an empty array.
  const [chats, setChats] = useState([]);
  const fetchChats = async () => {
    const responsedata = await axios.get("/api/chat");
    //console.log(data);
    //
    setChats(responsedata.data);
  };
  //useEffect is a Hook that enables side effects in functional components. Side effects are actions that occur as a result of changes in the component's state, props, or lifecycle. These can include data fetching, subscriptions, or manually changing the DOM.
  //When you call useEffect, you pass it a function that contains the code you want to run as a side effect.
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
