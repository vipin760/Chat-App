import React, { useEffect, useState } from 'react'
import { ChatState } from '../../../Context/ChatProvider'

import axios from 'axios'
import { USER_API_URI } from '../../../api'
import { Box, useToast, Spinner, Stack, Text } from '@chakra-ui/react'
import { Button } from "@chakra-ui/button"
import { AddIcon } from '@chakra-ui/icons'
import { getSender } from '../../../config/chatLogic'
import GroupChatModel from '../GroupChatModel/GroupChatModel'

const MyChat = ({fetchAgain}) => {
  const [ loggedUser, setLoggedUser] = useState()
  const { user, setUser, selectedChat, setSelectedChat, chats, setChats } = ChatState()

  const toast = useToast()
  const fetchChats = async()=>{
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`${USER_API_URI}/chat`,config);
      setChats(data.data);

    } catch (error) {
      toast({
        title: `${error.response.data.message}`,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }
  }

  useEffect(()=>{
    setLoggedUser(JSON.parse(localStorage.getItem("token")));
    fetchChats()
  },[fetchAgain])
  return (
    <Box
    display={{base:selectedChat? "none" : "flex",md:"flex"}}
    flexDir={"column"}
    alignItems={"center"}
    p={3}
    bg={"white"}
    width={{base:"100%", md:"31%"}}
    borderRadius={"lg"}
    borderWidth={"1px"}
    >
<Box pb={3} px={3} fontSize={{base:"28px" ,md:"30px"}}
fontFamily={"Work sans"}
display={"flex"}
width={"100%"}
justifyContent={"space-between"}
alignItems={"center"}
>
My Chat
<GroupChatModel>
<Button display={"flex"} fontSize={{base:"17px", md:"10px", lg:"17px"}} rightIcon={<AddIcon/>}>
  New Group Chat
</Button>
</GroupChatModel>
</Box>

<Box
display={"flex"} flexDir={"column"} p={3} bg={"#F8F8F8"} w={"100%"} h={"100%"} borderRadius={"lg"} overflowY={"hidden"} >
{chats?(
<Stack overflowY={"scroll"}>
{
  chats.map((chat)=>(
    <Box onClick={()=> setSelectedChat(chat)} cursor={"pointer"} bg={selectedChat===chat?"#38B2AC":"#E8E8E8"}
    color={selectedChat===chat?"white":"black"}
    px={3}
    py={3}
    borderRadius={"lg"}
    key={chat._id}
    >
      <Text>
        {
          !chat.isGroupChat ?getSender(loggedUser,chat.users):chat.chatName
        }
      </Text>
</Box>
  ))
}
</Stack>
):(<Spinner/>)}
</Box>
    </Box>
  )
}

export default MyChat
