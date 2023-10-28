import "@/styles/globals.css";
import type { AppProps } from "next/app";
import NavBar from "../components/navbar/index";
import Footer from "../components/footer/page";
export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <NavBar />
      <Component {...pageProps} />
      <Footer />
    </>
  );
}
