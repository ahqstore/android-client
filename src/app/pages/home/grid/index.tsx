import { useEffect, useState } from "react";
import { get_app } from "../../../data";
import { ApplicationData, get_app_asset_url } from "../../../data/fetchApps";

export default function Grid({ id }: { id: string }) {
  const [app, setApp] = useState<ApplicationData>();

  const [icon, setIcon] = useState<string>();

  useEffect(() => {
    (async () => {
      await get_app(id).then(async (app) => {
        if (app.appId != "") {
          await get_app_asset_url(id, 0).then((i) => {
            setIcon(i);
          });
        } else {
          setIcon("/android.png")
        }

        setApp(app)
      })
    })();
  }, [id]);

  const supported = app?.install.android != undefined;

  return <div className="max-w-[10rem] min-w-[10rem] min-h-[15rem] max-h-[15rem] rounded-md flex flex-col items-center text-center justify-center hover:bg-base-100">
    {icon ?
      <img style={{ "width": "5em", "height": "5em", filter: supported ? "" : "grayscale(100%)", "marginTop": "auto" }} src={
        icon
      } />
      :
      <div className="mt-auto loading loading-ring" />
    }

    <h1 className="mt-3 px-5">{app?.appDisplayName || "Please wait"}</h1>

    {supported ?
      <h2 className="text-xs mt-auto mb-2">{app?.source || app?.appId}</h2>
      : <h2 className="text-xs mt-auto mb-2 italic text-error">Android Unsupported</h2>
    }
  </div>;
}