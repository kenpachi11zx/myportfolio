import { type AppType } from "next/dist/shared/lib/utils";

import "@/styles/globals.css";
import "@/styles/locomotive-scroll.css";
import ChatBox from "@/components/ChatBox";
import Game from "@/components/Game";

import { DM_Sans } from "next/font/google";

const dmSans = DM_Sans({
  display: "swap",
  subsets: ["latin"],
});

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <div lang={"en"} className={dmSans.className}>
      <Component {...pageProps} />
      <ChatBox />
      <Game />
    </div>
  );
};

export default MyApp;
