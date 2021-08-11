import styled from "styled-components";
import { useRouter } from "next/dist/client/router";
import Sidebar from "../../components/Sidebar";
import ChatScreen from "../../components/ChatScreen";
import { db } from "../../firebase";

function ChatIdPage({ messages, chat }) {
  console.log("messages", messages);
  console.log("chat", chat);
  const router = useRouter();
  console.log("router", router);
  console.log("query chatId", router.query.chatId);
  return (
    <Container>
      <Sidebar />
      <ChatContainer>
        <ChatScreen chat={chat} messages={messages} />
      </ChatContainer>
    </Container>
  );
}

export default ChatIdPage;

export async function getServerSideProps(context) {
  // whatsapp-clone-chat/[eachCoupleConvoDocument]/[messages]/[eachMessage]
  const ref = db.collection("whatsapp-clone-chat").doc(context.query.chatId);

  //prepare the messages for rendering messages in ChatScreen
  //notice that we use get(), bc we will be tracking realtime messages in ChatScreen
  const messagesRef = await ref
    .collection("messages")
    .orderBy("timestamp", "asc")
    .get();

  //turn messagesSnapshot into messages history
  const messages = messagesRef.docs
    .map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }))
    .map((message) => ({
      ...message,
      timestamp: message.timestamp.toDate().getTime(),
    }));

  //chat data for identify in ChatScreen, who is the sender, reciever
  const chatDoc = await ref.get();
  const chat = {
    id: chatDoc.id,
    ...chatDoc.data(),
  };

  return { props: { chat, messages } };
}

const Container = styled.div`
  display: flex;
`;
const ChatContainer = styled.div`
  flex: 1;
  overflow-y: scroll;
  height: 100vh;
`;
