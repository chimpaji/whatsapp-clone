import { useRouter } from "next/dist/client/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db, serverTimeStamp } from "../firebase";
import styled from "styled-components";
import { Avatar } from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import {
  useCollection,
  useDocument,
  useDocumentData,
} from "react-firebase-hooks/firestore";
import Message from "./Message";
import { InsertEmoticonOutlined, Mic } from "@material-ui/icons";
import { useRef, useState } from "react";
import getRecipientEmail from "../utils/getRecipientEmail";
import Timeago from "timeago-react";

function ChatScreen({ chat, messages }) {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const [input, setInput] = useState("");
  //we alraedy have getServerSideProps fetch messages history in [chatId] but now we will hydrate this page with real time fetching
  const [messagesSnapshot] = useCollection(
    db
      .collection("whatsapp-clone-chat")
      .doc(router.query.chatId)
      .collection("messages")
      .orderBy("timestamp", "asc")
  );

  const reciepientEmail = getRecipientEmail(chat.users, user);
  console.log("reciepientEmail", reciepientEmail);
  //pulling reciepient last seen data, beware that reciepient might be "null"
  const [reciepientSnapshot] = useDocument(
    db.collection("whatsapp-clone").where("email", "==", reciepientEmail)
  );

  const reciepient = reciepientSnapshot?.docs[0]?.data();
  console.log("reciepient", reciepient);

  const showMessage = () => {
    if (messagesSnapshot) {
      return messagesSnapshot.docs.map((message) => (
        <Message
          key={message.id}
          user={message.data().user}
          message={{
            ...message.data(),
            timestamp: message.data().timestamp?.toDate().getTime(),
          }}
        />
      ));
    } else {
      return messages.map((message) => (
        <Message key={message.id} user={message.user} message={message} />
      ));
    }
  };

  //refer to endOfMessageRef element so we can do a function that refer this element
  const endOfMessageRef = useRef(null);
  const ScrollToBottom = () => {
    endOfMessageRef.current.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const sendMessage = (e) => {
    e.preventDefault();
    //update this user last seen to now
    db.collection("whatsapp-clone")
      .doc(user.uid)
      .set({ lastSeen: serverTimeStamp() }, { merge: true });

    db.collection("whatsapp-clone-chat")
      .doc(router.query.chatId)
      .collection("messages")
      .add({
        timestamp: serverTimeStamp(),
        message: input,
        user: user.email,
        photoURL: user.photoURL,
      });
    setInput("");
    ScrollToBottom();
  };

  return (
    <Container>
      <Header>
        {reciepient ? (
          <Avatar src={reciepient.photoURL} />
        ) : (
          <Avatar>{reciepientEmail[0]}</Avatar>
        )}
        <HeaderInformations>
          <h3>{reciepientEmail}</h3>
          <p>
            Last active
            {reciepient ? (
              <Timeago datetime={reciepient.lastSeen?.toDate()} />
            ) : (
              " Unavailable"
            )}
          </p>
        </HeaderInformations>
        <HeaderIcon>
          <MoreVertIcon />
          <AttachFileIcon />
        </HeaderIcon>
      </Header>

      <MessageContainer>
        {/* show mesage */}
        {showMessage()}
        <EndOfMessage ref={endOfMessageRef} />
      </MessageContainer>

      <InputContainer onSubmit={sendMessage}>
        <InsertEmoticonOutlined />
        <Input value={input} onChange={(e) => setInput(e.target.value)} />
        <button type="submit" hidden disabled={!input}>
          Send Message
        </button>
        <Mic />
      </InputContainer>
    </Container>
  );
}

export default ChatScreen;

const Container = styled.div``;

const Header = styled.div`
  position: sticky;
  background-color: white;
  z-index: 100;
  top: 0;
  display: flex;
  padding: 11px;
  height: 80px;
  align-items: center;
  border-bottom: 1px solid whitesmoke;
`;
const HeaderInformations = styled.div`
  margin-left: 15px;
  flex: 1;

  > h3 {
    margin-bottom: 3px;
  }
  > p {
    font-size: 14px;
    color: gray;
  }
`;
const HeaderIcon = styled.div``;

const MessageContainer = styled.div`
  padding: 30px;
  background-color: #e5ded8;
  min-height: 90vh;
`;
const EndOfMessage = styled.div``;
const InputContainer = styled.form`
  display: flex;
  align-items: center;
  padding: 10px;
  position: sticky;
  bottom: 0;
  background-color: white;
  z-index: 100;
`;
const Input = styled.input`
  flex: 1;
  outline: 0;
  border: none;
  border-radius: 10px;
  background-color: whitesmoke;
  padding: 20px;
  margin-left: 15px;
  margin-right: 15px;
`;
