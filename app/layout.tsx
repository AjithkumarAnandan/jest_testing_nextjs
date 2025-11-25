"use client";
import "./globals.css";
import { Provider } from "react-redux";
import store from "@/Redux/store";
import { ToastContainer } from 'react-toastify';


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body> 
        <Provider store={store}>
        {children}
         <ToastContainer />
        </Provider>
      </body>
    </html>
  );
}
