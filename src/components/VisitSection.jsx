import { useApp } from "../lib/store.jsx";
import { BIZ } from "../data/biz.js";
import { pic, AMBIENCE } from "../data/photos.js";
import Photo from "./Photo.jsx";
import { t } from "../lib/i18n.js";

export default function VisitSection() {
  const app = useApp();
  const lang = app.ui.lang;

  return (
    <section className="visit" id="visit">
      <div className="wrap visit__grid">
        <div className="visit__card reveal" data-reveal>
          <h3>{t(lang, "visit.title")}</h3>
          <dl className="visit__dl">
            <div><dt>{t(lang, "visit.address", "Address")}</dt><dd>{BIZ.street.join(", ")}</dd></div>
            <div>
              <dt>{t(lang, "visit.hours", "Hours")}</dt>
              <dd>{BIZ.hours.map(([day, time]) => <div key={day}>{day} {time}</div>)}</dd>
            </div>
            <div><dt>{t(lang, "visit.phone", "Phone")}</dt><dd><a href={`tel:${BIZ.phoneTel}`}>{BIZ.phoneShow}</a></dd></div>
            <div><dt>{t(lang, "visit.email", "Email")}</dt><dd><a href={`mailto:${BIZ.email}`}>{BIZ.email}</a></dd></div>
          </dl>
          <div className="visit__acts">
            <a className="btn btn--primary" href={BIZ.mapQuery} target="_blank" rel="noopener">{t(lang, "visit.dir")}</a>
          </div>
        </div>
        <div className="visit__map reveal" data-reveal>
          <Photo src={pic(AMBIENCE.room, 1000, 600)} alt="The dining room" cat="Mains" />
          <span className="visit__pin">{`${BIZ.name} · ${BIZ.street[0]}`}</span>
        </div>
      </div>
    </section>
  );
}
