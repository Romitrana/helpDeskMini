import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";

export default function RootLayout() {
  return (
    <div>
      <Navbar /> 
      <main style={{ padding: "1rem" }}>
        <Outlet /> {/* Render child routes here */}
      </main>
    </div>
  );
}
