import styled from "styled-components";
import { Avatar } from "@material-ui/core";
import { auth, db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  useDocumentDataOnce,
  useDocumentOnce,
} from "react-firebase-hooks/firestore";
import getRecipientEmail from "../utils/getRecipientEmail";
import { useRouter } from "next/dist/client/router";

function Chat({ users, id }) {
  const router = useRouter();

  const [user] = useAuthState(auth);
  const reciepientEmail = getRecipientEmail(users, user);
  console.log("reciepEmailxx", reciepientEmail);
  //find reciepient account data to pull image url from
  const [reciepientSnapshot] = useDocumentOnce(
    db.collection("whatsapp-clone").where("email", "==", reciepientEmail)
  );
  const reciepient = reciepientSnapshot?.docs.map((rec) => rec.data())[0];

  return (
    <Container onClick={() => router.push(`/chat/${id}`)}>
      {reciepient ? (
        <UserAvatar src={reciepient?.photoURL} />
      ) : (
        <UserAvatar>{reciepientEmail[0]}</UserAvatar>
      )}
      <p>{reciepientEmail}</p>
    </Container>
  );
}

export default Chat;

const Container = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: start;
  :hover {
    background-color: whitesmoke;
  }
`;
const UserAvatar = styled(Avatar)`
  background-color: whitesmoke;
`;
