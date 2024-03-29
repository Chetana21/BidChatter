import React from "react";
// import { FormControl } from "@chakra-ui/form-control";
// import { Input } from "@chakra-ui/input";
import { Box, Text } from "@chakra-ui/layout";
// import "./styles.css";
import { IconButton, Spinner, useToast } from "@chakra-ui/react";
 import { getSender, getSenderFull } from "../config/ChatLogics";
// import { useEffect, useState } from "react";
// import axios from "axios";
import { ArrowBackIcon } from "@chakra-ui/icons";
 import ProfileModal from "./miscellaneous/ProfileModal";
// import ScrollableChat from "./ScrollableChat";
// import Lottie from "react-lottie";
// import animationData from "../animations/typing.json";

// import io from "socket.io-client";
  import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal";
import { ChatState } from "../Context/ChatProvider";
const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat, setSelectedChat, user } = ChatState();
  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            d="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              d={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              //   After clicking in the back arrow icon the setSelected chat becomes empty
              onClick={() => setSelectedChat("")}
            />
            {/* Check if selected chat is not a group chat then do following  */}
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
              </>
            ) : (
              //   But if its a groupChat then
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                  //fetchMessages={fetchMessages}
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                />
              </>
            )}
          </Text>
          <Box
            d="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {/* {Messeges here} */}
          </Box>
        </>
      ) : (
        <Box d="flex" alignItems="center" justifyContent="center" h="100%">
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
