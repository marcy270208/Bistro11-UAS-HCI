import { useState } from "react";
import { useApp } from "../../lib/store.jsx";
import { uid } from "../../lib/format.js";
import Ico from "../../lib/icons.jsx";
import ModalHead from "../ModalHead.jsx";

export default function ReviewForm() {
  const app = useApp();
  const [stars, setStars] = useState(0);
  const [hover, setHover] = useState(0);
  const [name, setName] = useState(app.me?.name || "");
  const [dish, setDish] = useState("");
  const [text, setText] = useState("");
  const [errs, setErrs] = useState({});

  const post = () => {
    const bad = { stars: !stars, name: name.trim().length < 2, text: text.trim().length < 12 };
    setErrs(bad);
    if (bad.stars || bad.name || bad.text) {
      app.toast("Still missing a star rating, name and a sentence", "⭐");
      return;
    }
    app.addReview({
      id: uid("R"), email: app.me?.email || "", name: name.trim(), stars,
      text: text.trim(), dish, date: new Date().toISOString().slice(0, 10), hidden: false
    });
    app.closeModal();
    app.toast("Review posted - thank you, the kitchen will read it", "⭐");
    app.goSection("reviews");
  };

  return (
    <>
      <ModalHead title="Tell the kitchen" sub="Reviews go straight to the pass. Be honest - the chef reads them at midnight." />
      <div className="modal__body">
        <div className={`field${errs.stars ? " err" : ""}`}>
          <label>How was it?</label>
          <div className="picker" onMouseLeave={() => setHover(0)}>
            {[1, 2, 3, 4, 5].map(i => (
              <button key={i} type="button" className={i <= (hover || stars) ? "on" : ""}
                      aria-label={`${i} stars`}
                      onClick={() => { setStars(i); setErrs(e => ({ ...e, stars: false })); }}
                      onMouseEnter={() => setHover(i)}>
                <Ico name="star" />
              </button>
            ))}
          </div>
          <small className="field__err">Pick a star count first.</small>
        </div>

        <div className="row2">
          <div className={`field${errs.name ? " err" : ""}`}>
            <label htmlFor="rv-name">Your name</label>
            <input id="rv-name" value={name} placeholder="How the table knows you" autoFocus
                   onChange={e => { setName(e.target.value); setErrs(x => ({ ...x, name: false })); }} />
            <small className="field__err">A name, please.</small>
          </div>
          <div className="field">
            <label htmlFor="rv-dish">What did you order?</label>
            <select id="rv-dish" value={dish} onChange={e => setDish(e.target.value)}>
              <option value="">Just the room</option>
              {app.onSale.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
            </select>
          </div>
        </div>

        <div className={`field${errs.text ? " err" : ""}`}>
          <label htmlFor="rv-text">Your review</label>
          <textarea id="rv-text" value={text} placeholder="The food, the noise, the wait - all of it helps."
                    onChange={e => { setText(e.target.value); setErrs(x => ({ ...x, text: false })); }} />
          <small className="field__err">Give us at least a sentence (12 characters).</small>
        </div>
      </div>

      <div className="modal__foot">
        <button className="btn btn--ghost" onClick={app.closeModal}>Not now</button>
        <button className="btn btn--primary" onClick={post}>Post the review</button>
      </div>
    </>
  );
}
