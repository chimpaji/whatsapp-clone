import "../styles/globals.css";

import { auth, db, serverTimeStamp } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import Login from "./login";
import Loading from "../components/Loading";
import { useEffect } from "react";
import { useDocumentDataOnce } from "react-firebase-hooks/firestore";
import getRecipientEmail from "../utils/getRecipientEmail";

function MyApp({ Component, pageProps }) {
  const [user, loading] = useAuthState(auth);

  console.log("user", user);

  useEffect(() => {
    if (user) {
      db.collection("whatsapp-clone").doc(user.uid).set(
        {
          email: user.email,
          lastSeen: serverTimeStamp(),
          photoURL: user.photoURL,
        },
        { merge: true }
      );
    }
  }, [user]);

  if (loading) return <Loading />;
  if (!user) return <Login />;

  return <Component {...pageProps} />;
}

export default MyApp;
