import { Avatar, Button, IconButton } from "@material-ui/core";
import ChatIcon from "@material-ui/icons/chat";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import SearchIcon from "@material-ui/icons/Search";
import styled from "styled-components";
import * as EmailValidator from "email-validator";
import { auth, db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import Chat from "./Chat";
import { useRouter } from "next/dist/client/router";

function Sidebar() {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const userChatsRef = db
    .collection("whatsapp-clone-chat")
    .where("users", "array-contains", user?.email);
  console.log("logged in user email", user.email);
  const [chatsSnapshot] = useCollection(userChatsRef);

  //Ask reciepient email address
  const createChat = () => {
    const input = prompt("Enter email address to start convo");
    if (!input) return null;
    if (
      EmailValidator.validate(input) &&
      input !== user.email &&
      !chatAlreadyExist(input)
    ) {
      console.log("legit email");
      // add chat to firestore
      db.collection("whatsapp-clone-chat").add({ users: [user.email, input] });
    }
  };

  function chatAlreadyExist(reciepientEmail) {
    return !!chatsSnapshot?.docs.find(
      (chat) =>
        chat.data().users.find((email) => email === reciepientEmail)?.length > 0
    );
  }

  const chats = chatsSnapshot?.docs.map((chat) => chat.data());
  console.log("all chat here:", chats);

  return (
    <Container>
      <Header>
        <UserAvatar
          src={user.photoURL}
          onClick={() => {
            auth.signOut();
            //router push cause a bug T-T
            // router.push("/");
          }}
        />
        <IconsContainer>
          <IconButton>
            <ChatIcon />
          </IconButton>
          <IconButton>
            <MoreVertIcon />
          </IconButton>
        </IconsContainer>
      </Header>
      <Search>
        <SearchIcon />
        <SearchInput />
      </Search>
      <SidebarButton onClick={createChat}>Start a new Chat</SidebarButton>
      {/* List of chat */}
      {chatsSnapshot?.docs.map((chat) => (
        <Chat key={chat.id} id={chat.id} users={chat.data().users} />
      ))}
    </Container>
  );
}

export default Sidebar;

const Container = styled.div`
  border-right: 1px solid whitesmoke;
  height: 100vh;
  min-width: 300px;
  max-width: 350px;
  overflow-y: scroll;
  ::-webkit-scrollbar {
    display: none;
  }
`;
const Header = styled.div`
  display: flex;
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 1;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  height: 80px;
  border-bottom: 1px solid whitesmoke;
`;
const UserAvatar = styled(Avatar)`
  cursor: pointer;
  :hover {
    opacity: 0.8;
  }
`;
const IconsContainer = styled.div``;
const Search = styled.div`
  display: flex;
  align-items: center;
  border-radius: 2px;
  padding: 20px;
`;
const SearchInput = styled.input`
  outline-width: 0;
  border: none;
  flex: 1;
`;

const SidebarButton = styled(Button)`
  width: 100%;
  &&& {
    border-top: 2px solid whitesmoke;
    border-top: 2px solid whitesmoke;
  }
`;
