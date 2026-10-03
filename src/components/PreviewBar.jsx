import { useApp } from "../lib/store.jsx";
import { STAFF } from "../data/biz.js";
import Ico from "../lib/icons.jsx";

/* Shown only while a signed-in chef is browsing the public site. */
export default function PreviewBar() {
  const app = useApp();
  if (!(app.isStaff && app.ui.view === "guest")) return null;

  return (
    <div className="preview-bar">
      <Ico name="eye" />
      <span>Guest preview · <b>{STAFF.name}</b> · looking only</span>
      <button className="btn btn--primary btn--sm" onClick={app.backToConsole}>Service board</button>
    </div>
  );
}
