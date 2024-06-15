import { useEffect, useMemo, useState } from "react";

import "./app.css"
import BottomNavBar from "./bottom-nav"
import HomePage from "./pages/home";



export default function App() {
  const [page, setPage] = useState("home");

  const data = useMemo(() => {
    switch (page) {
      case "home":
        return <HomePage />;
      default:
        return <>{page}</>;
    }
  }, [page]);

  return (
    <div className="app-main">
      <div className="container">
        {data}
      </div>
      <BottomNavBar {...{ setPage }} />
    </div>
  )
}