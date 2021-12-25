import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import {
  Button,
  Container,
  Grid,
  GridItem,
  Heading,
  Flex,
} from "@chakra-ui/react";
import NextLink from "next/link";

const socket = io("http://localhost:4000");

export default function Home() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [room, setRoom] = useState("");

  useEffect(() => {
    socket.on("connect", () => {
      console.log(`connected with id: ${socket.id}`);
      setMessages((prevState) => [
        ...prevState,
        `Your room id is: ${socket.id}`,
      ]);

      socket.on("receive-message", (message) => {
        setMessages((prevState) => [...prevState, message]);
      });
    });
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    setMessages((prevState) => [...prevState, message]);

    socket.emit("send-message", message, room);
    setMessage("");
  }

  function onJoin(e) {
    e.preventDefault();

    socket.emit("join-room", room, (message) => {
      setMessages((prevState) => [...prevState, message]);
    });
  }

  return (
    <Container maxW="container.md" h="100vh">
      <Flex justifyContent="center" alignItems="center" h="100%">
        <Grid gridTemplateColumns="1fr 1fr" gap="5rem" alignItems="center">
          <GridItem justifyContent="center">
            <NextLink href="/global">
              <Button w="100%" h="100px">
                <Heading>Global chat</Heading>
              </Button>
            </NextLink>
          </GridItem>
          <GridItem>
            <NextLink href="/private">
              <Button w="100%" h="100px">
                <Heading>Private chat</Heading>
              </Button>
            </NextLink>
          </GridItem>
        </Grid>
      </Flex>
    </Container>
  );
}
