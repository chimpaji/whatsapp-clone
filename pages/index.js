import Head from "next/head";
import Image from "next/image";
import Sidebar from "../components/Sidebar";
import { auth } from "../firebase";

export default function Home() {
  return (
    <div>
      <Head>
        <title>Whatsapp with Chimpaji</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <Sidebar />
    </div>
  );
}
