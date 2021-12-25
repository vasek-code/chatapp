import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { Box, Input, Button, Text, Container, Flex } from "@chakra-ui/react";
import NextLink from "next/link";

const socket = io("http://localhost:4000/global");

export default function Home() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const lastMessageRef = useRef(null);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected to global");

      socket.on("receive-message", (message) => {
        setMessages((prevState) => [...prevState, message]);
        lastMessageRef.current.scrollIntoView();
      });
    });
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    setMessages((prevState) => [...prevState, message]);
    socket.emit("send-message", message);
    setMessage("");
    lastMessageRef.current.scrollIntoView();
  }

  return (
    <Container pt="50px" maxW="container.lg" pb="50px">
      <Flex justifyContent="center">
        <Box w="500px">
          <Box>
            {messages.map((message, index) => (
              <Text key={index}>{message}</Text>
            ))}
          </Box>
          <Box mt={5}>
            <form onSubmit={handleSubmit}>
              <Flex justifyContent="space-between">
                <Input
                  type="text"
                  onChange={(e) => setMessage(e.target.value)}
                  value={message}
                  placeholder="enter message"
                  w="300px"
                />
                <Button type="submit">SEND MESSAGE</Button>
              </Flex>
              <NextLink href="/">
                <Button ref={lastMessageRef} mt={5}>
                  Return to home
                </Button>
              </NextLink>
            </form>
          </Box>
        </Box>
      </Flex>
    </Container>
  );
}
