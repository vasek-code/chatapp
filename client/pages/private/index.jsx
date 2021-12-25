import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import {
  Box,
  Input,
  Button,
  Text,
  Container,
  VStack,
  HStack,
} from "@chakra-ui/react";

import NextLink from "next/link";

const socket = io("http://localhost:4000");

export default function Home() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [room, setRoom] = useState("");
  const [displayRoom, setDisplayRoom] = useState("");
  const [error, setErrormessage] = useState("");
  const lastMessageRef = useRef(null);

  useEffect(() => {
    socket.on("connect", () => {
      socket.on("receive-message", (message) => {
        setMessages((prevState) => [...prevState, message]);
        lastMessageRef.current.scrollIntoView();
      });
    });
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    lastMessageRef.current.scrollIntoView();
    if (!displayRoom) {
      return;
    }

    setMessages((prevState) => [...prevState, message]);
    socket.emit("send-message", message, displayRoom);
    setMessage("");
  }

  function onJoin(e) {
    e.preventDefault();
    if (!room) {
      setErrormessage("Please enter room");
      return;
    }

    socket.emit("join-room", room);

    setDisplayRoom(room);
    setRoom("");
  }

  return (
    <Container py="50px" maxW="container.lg">
      <VStack>
        <Box>
          <Text fontWeight="500" fontSize="1.4rem" mb={5}>
            {displayRoom ? (
              <span>Your current room is: {displayRoom}</span>
            ) : (
              <span>PLEASE ENTER CUSTOM ROOM NAME</span>
            )}
          </Text>
          {messages.map((message, index) => (
            <Text key={index}>{message}</Text>
          ))}
        </Box>
        <HStack>
          <form onSubmit={handleSubmit}>
            <HStack>
              <Input
                type="text"
                onChange={(e) => setMessage(e.target.value)}
                value={message}
                placeholder="enter message"
              />
              <Button type="submit">SEND</Button>
            </HStack>
          </form>
          <form onSubmit={onJoin}>
            <HStack>
              <Input
                type="text"
                onChange={(e) => setRoom(e.target.value)}
                value={room}
                placeholder="enter custom room name"
              />
              <Button type="submit">JOIN</Button>
            </HStack>
          </form>
        </HStack>
        <NextLink href="/">
          <Button ref={lastMessageRef}>Return Home</Button>
        </NextLink>
      </VStack>
    </Container>
  );
}
