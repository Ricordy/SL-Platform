import Nav from "./Nav";
import Footer from "./Footer";

export default function Layout({ children }) {
  return (
    <>
      <Nav />
      <main className="max-w-4xl mx-auto">{children}</main>
      <Footer />
    </>
  );
}
