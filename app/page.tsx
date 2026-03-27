import Image from "next/image";
import Chat from "./components/Chat";
export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-white font-sans dark:bg-black">
      <main
        className="flex flex-1 w-screen max-w-[680px] bg-amber-400 relative
      flex-col items-center justify-between mt-16 px-1 sm:px-0 bg-white
      dark:bg-black sm:items-start"
      >
        <Chat />
      </main>
    </div>
  );
}
