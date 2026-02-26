import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import DashboardWrapper from "@/components/layouts/DashboardWrapper";
import StoreProvider from "@/lib/redux/store";
import { GoeyToaster } from "@/components/ui/goey-toaster"
// import ToasterProvider from "@/components/ToasterProvider";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Project Management",
    description: "Project Management",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-dark-bg`}
            >
                <StoreProvider>
                    < DashboardWrapper>
                        {children}
                    </DashboardWrapper>
                    <GoeyToaster position="top-center" />
                    {/* <ToasterProvider /> */}
                </StoreProvider>
            </body>
        </html>
    );
}
