import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import "./app.css"
import BottomNavBar from "./bottom-nav"
import HomePage from "./pages/home";
import { get_home, get_map, getSha } from "./data";
import Loading from "./pages/loading";



export default function App() {
  const [page, setPage] = useState("home");
  const [load, setLoad] = useState(false),
    [_apps, setApps] = useState<any>(),
    [_map, setMap] = useState<any>();

  const data = useMemo(() => {
    switch (page) {
      case "home":
        return <HomePage />;
      default:
        return <>{page}</>;
    }
  }, [page]);

  // Pre Start
  useEffect(() => {
    const delay = (ms: number) => new Promise((r) => setTimeout(() => r(undefined), ms));
    (async () => {
      await getSha();

      setApps(await get_home());
      setMap(await get_map<{ [key: string]: Object }>());

      await delay(500);
      setLoad(true);
    })()
  }, []);

  return (
    <div className="app-main">
      <AnimatePresence>
        {load && <><motion.div className="container">
          {data}
        </motion.div>
          <BottomNavBar {...{ setPage }} /> </>}
      </AnimatePresence>
      <AnimatePresence>
        {!load && <Loading />}
      </AnimatePresence>
    </div>
  )
}
