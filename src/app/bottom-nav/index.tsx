import '@mdui/icons/apps';
import '@mdui/icons/library-books';
import '@mdui/icons/settings';
import '@mdui/icons/refresh';
import '@mdui/icons/system-update-alt';

interface Props {
  page: string;
  setPage: (_: string) => void;
}

export default function BottomNavBar({ page, setPage }: Props) {
  return (
    <div className="bg-base-300">
      <mdui-navigation-bar full-width label-visibility='selected' value={page} >
        <mdui-navigation-bar-item value='home' onClick={() => { setPage("home") }}>
          <mdui-icon-apps slot="icon"></mdui-icon-apps>
          Apps
        </mdui-navigation-bar-item>
        <mdui-navigation-bar-item value="library" onClick={() => { setPage("library") }}>
          <mdui-icon-library-books slot="icon"></mdui-icon-library-books>
          Library
        </mdui-navigation-bar-item>
        <mdui-navigation-bar-item value="updates" onClick={() => { setPage("updates") }}>
          <mdui-icon-system-update-alt slot="icon"></mdui-icon-system-update-alt>
          Updates
        </mdui-navigation-bar-item>
        <mdui-navigation-bar-item value="settings" onClick={() => { setPage("settings") }}>
          <mdui-icon-settings slot="icon"></mdui-icon-settings>
          Settings
        </mdui-navigation-bar-item>
        {import.meta.env.DEV && <mdui-navigation-bar-item value="ref" onClick={() => { window.location.reload() }}>
          <mdui-icon-refresh slot="icon"></mdui-icon-refresh>
          Reload
        </mdui-navigation-bar-item>}
      </mdui-navigation-bar>
    </div>
  );
}