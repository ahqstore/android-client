import { useEffect, useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";

import "./app.css"
import BottomNavBar from "./bottom-nav"
import HomePage from "./pages/home";
import { get_app, get_home, get_map, getSha } from "./data";
import Loading from "./pages/loading";
import SettingsPage from "./pages/settings";
import { getAboutInfomation } from "../utils/android";

export default function App() {
  const [page, setPage] = useState("home");
  const [load, setLoad] = useState<string | boolean>(false),
    [apps, setApps] = useState<[string, string[]][]>([]),
    [_map, setMap] = useState<{ [key: string]: Object }>({});

  const data = useMemo(() => {
    switch (page) {
      case "home":
        return <HomePage home={apps} />;
      case "settings":
        return <SettingsPage />;
      default:
        return <>{page}</>;
    }
  }, [load, page, apps]);

  // Pre Start
  useEffect(() => {
    const delay = (ms: number) => new Promise((r) => setTimeout(() => r(undefined), ms));
    (async () => {
      await getAboutInfomation();
      await delay(500);

      setLoad("Fetching SHA...");
      await getSha();

      setLoad("Getting search...");
      const search = await get_home();
      console.log(typeof (search), search);

      for (let i = 0; i < search.length; i++) {
        for (let j = 0; j < search[i][1].length; j++) {
          setLoad(`Caching ${search[i][1][j].substring(0, 16)}...`);
          await get_app(search[i][1][j]);
        }
      }

      setApps(search);

      setLoad("Fetching map...");
      setMap(await get_map<{ [key: string]: Object }>());

      setLoad(false);
      await delay(2500);
      setLoad(true);
    })()
  }, []);

  return (
    <div className="app-main">
      {load == true &&
        <div className="container">
          {data}
          <BottomNavBar {...{ page, setPage }} />
        </div>
      }
      <AnimatePresence>
        {load != true && <Loading load={load} />}
      </AnimatePresence>
    </div>
  )
}
