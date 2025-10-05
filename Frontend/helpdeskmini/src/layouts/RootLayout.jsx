import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import styles from './Root.module.css'
export default function RootLayout() {
  return (
    <div className={styles.rootlayout}>
      <Navbar /> 
      <main className={styles.root_main}>
        <Outlet /> {/* Render child routes here */}
      </main>
    </div>
  );
}
