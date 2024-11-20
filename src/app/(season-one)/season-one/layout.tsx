import Head from "next/head";
import { MainGameContextProvider } from "../main-game-context";
import { SocketContextProvider } from "../main-game-socket-context";

export default function SeasonOneLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <Head>
                <link
                    rel="preload"
                    href="/images/floating-panel.png"
                    as="image"
                />
            </Head>
            <MainGameContextProvider>
                <SocketContextProvider>{children}</SocketContextProvider>
            </MainGameContextProvider></>
    );
}
