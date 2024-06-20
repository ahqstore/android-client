import { useEffect, useState } from "react";
import { get_app } from "../../../data";
import { ApplicationData } from "../../../data/fetchApps";

export default function Grid({ id }: { id: string }) {
  const [app, setApp] = useState<ApplicationData>();

  useEffect(() => {
    setApp(undefined);

    get_app(id).then(setApp);
  }, [id]);

  return <div className="max-w-[44vw] min-w-[44vw] min-h-[20vh] max-h-[20vh] bg-base-content rounded-md">

  </div>;
}