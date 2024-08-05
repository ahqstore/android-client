import { useEffect, useState } from "react";
import { get_app } from "../../../data";
import { ApplicationData } from "../../../data/fetchApps";

export default function Grid({ id }: { id: string }) {
  const [app, setApp] = useState<ApplicationData>();

  useEffect(() => {
    get_app(id).then(setApp);
  }, [id]);

  const supported = app?.install.android != undefined;

  return <div className="max-w-[10rem] min-w-[10rem] min-h-[15rem] max-h-[15rem] rounded-md flex flex-col items-center text-center justify-center hover:bg-base-100">
    {app?.icon ?
      <img style={{ "width": "5em", "height": "5em", filter: supported ? "" : "grayscale(100%)" }} src={app?.icon} />
      :
      <div className="loading loading-ring" />
    }

    <h1 className="mt-3 px-5">{app?.appDisplayName || "Please wait"}</h1>
  </div>;
}