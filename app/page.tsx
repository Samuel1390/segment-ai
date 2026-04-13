import Header from "./components/Header";
import ThemeProvider from "./components/context/ThemeProvider";
import Chat from "./components/Chat";
import LateralFilePreviewProvider from "./components/context/LateralFilePreviewProvider";
import LateralFilePreview from "./components/LateralFilePreview";

export default function Home() {
  return (
    <>
      <ThemeProvider>
        <Header />

        <LateralFilePreviewProvider>
          <div
            className={`flex flex-1 w-full justify-evenly
          bg-white font-sans dark:bg-black gap-6
            `}
          >
            <main
              className="flex flex-1 w-full min-w-0 max-w-[780px] bg-white relative
            flex-col items-center justify-between pt-16 pb-4.5
            dark:bg-black sm:items-start"
            >
              <Chat />
            </main>
            <LateralFilePreview />
          </div>
        </LateralFilePreviewProvider>
      </ThemeProvider>
    </>
  );
}
