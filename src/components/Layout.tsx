import Nav from "./Nav";
import Footer from "./Footer";
import { Toaster } from "react-hot-toast";

export default function Layout({ children }) {
  return (
    <div className="flex flex-col items-stretch min-h-screen">
      <Nav />
      <Toaster position="top-center" reverseOrder={false} />
      <main className="flex w-full max-w-4xl mx-auto grow shrink-0">
        {children}
      </main>
      <Footer className="shrink-0 mt-auto flex w-full max-w-4xl mx-auto p-3 md:p-0 my-6 md:my-12 gap-3 " />
    </div>
  );
}
