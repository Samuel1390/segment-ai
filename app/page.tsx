import Header from "./components/Header";
import ThemeProvider from "./components/context/ThemeProvider";
import Chat from "./components/Chat";
export default function Home() {
  return (
    <>
      <ThemeProvider>
        <Header />
        <div className="flex flex-col flex-1 items-center justify-center bg-white font-sans dark:bg-black">
          <main
            className="flex flex-1 w-screen max-w-[780px] bg-amber-400 relative
        flex-col items-center justify-between mt-16 bg-white
        dark:bg-black sm:items-start"
          >
            <Chat />
          </main>
        </div>
      </ThemeProvider>
    </>
  );
}
