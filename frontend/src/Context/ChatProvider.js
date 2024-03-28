import { createContext, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
//Create context
const ChatContext = createContext();
//Create a chat  provider that provides the state and methods to interact with it and which is going to wrap all our app
const ChatProvider = ({ children }) => {
  //Creating a  state
  const [selectedChat, setSelectedChat] = useState();
  const [user, setUser] = useState();
  const [chats, setChats] = useState([]);
   const history = useHistory();
  //We stored the userInfo value in our local storaage so we will fetch that value and as that was stored using stringify, we will parse it as a json file
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);
    //Check if the user is  not logged  in its gonna get redirected to the home page.
    if (!userInfo) {
      history.push("/");
    }
  }, [history]);
  //Create value prop which takes an object with all of the above states
  return (
    <ChatContext.Provider
      value={{
        selectedChat,
        setSelectedChat,
        user,
        setUser,
        chats,
        setChats,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
  
};
export const ChatState = () => {
  return useContext(ChatContext);
};

//useContext(ChatContext);
export default ChatProvider;
