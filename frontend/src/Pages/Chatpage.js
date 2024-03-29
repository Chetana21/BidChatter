// import React, { useEffect, useState } from "react";
// import axios from "axios";
import { ChatState } from "../Context/ChatProvider";
import { Box } from "@chakra-ui/layout";
import { useState } from "react";
import SideDrawer from "../components/miscellaneous/SideDrawer";
import MyChats from "../components/MyChats";
import ChatBox from "../components/ChatBox";
const Chatpage = () => {
  //This commented part is for accesing the dummy data and the other is actually used to creae a chats page
  // //UseState allows functionl components to manage state. State in React
  // // represents data that can change over time and can affect what is
  // //rendered in the user interface. UseState returns a pair of values:the
  // // current value (stored in a variable), and a function to update that value.
  // //Here we have initialozed state with a value of an empty array.
  // const [chats, setChats] = useState([]);
  // const fetchChats = async () => {
  //   const responsedata = await axios.get("/api/chat");
  //   //console.log(data);
  //   //
  //   setChats(responsedata.data);
  // };
  // //useEffect is a Hook that enables side effects in functional components. Side effects are actions that occur as a result of changes in the component's state, props, or lifecycle. These can include data fetching, subscriptions, or manually changing the DOM.
  // //When you call useEffect, you pass it a function that contains the code you want to run as a side effect.
  // useEffect(() => {
  //   fetchChats();
  // }, []);

  //Actual Code for Chatpage
  //Take User state form context API adn destructure the User state inside it.

  const { user } = ChatState();

  //
   const [fetchAgain, setFetchAgain] = useState(false);
  //Check if user is there and accordingly render the below components.
  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}
      <Box
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          height: "91.5vh",
          padding: "10px",
        }}
      >
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
  );
};

export default Chatpage;
