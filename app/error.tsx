"use client";
import Logo from "./components/Logo";
import { Button } from "@/components/ui/button";
import { Inter, Mona_Sans } from "next/font/google";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});
const monaSans = Mona_Sans({
  variable: "--font-mona-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const ErrorPage = () => {
  return (
    <html className={`${inter.className} ${monaSans.className}`}>
      <body
        style={{ padding: 0, margin: 0 }}
        className="size-screen dark overflow-hidden flex items-center justify-center"
      >
        <Card className="p-0 w-full max-w-[380px]">
          <CardHeader>
            <CardTitle className="flex py-2 items-center border-b border-neutral-700 w-full justify-center">
              <Logo size={32} />
              <span className="text-md">Segment</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex p-4 flex-col items-center justify-center gap-4">
            <h1 className="text-2xl font-bold">Error</h1>
            <p className="text-muted-foreground text-center">
              Lo sentimos, hubo un error interno e intentaremos solucionarlo lo
              antes posible. Inténtalo de nuevo más tarde.
            </p>
          </CardContent>
          <CardFooter className="flex p-4 justify-end">
            <Button onClick={() => window.location.reload()}>Recargar</Button>
          </CardFooter>
        </Card>
      </body>
    </html>
  );
};

export default ErrorPage;
