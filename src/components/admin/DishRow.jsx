import { useEffect, useState } from "react";
import { useApp } from "../../lib/store.jsx";
import { thumbPic } from "../../data/photos.js";
import Ico from "../../lib/icons.jsx";
import Photo from "../Photo.jsx";
import EditDishForm from "../modals/EditDishForm.jsx";

export default function DishRow({ d }) {
  const app = useApp();
  const on = d.available !== false;
  const [pv, setPv] = useState(String(d.price));
  useEffect(() => setPv(String(d.price)), [d.price]);

  const commitPrice = value => {
    const v = parseFloat(value);
    if (!isFinite(v) || v < 0) return;
    app.patchDish(d.id, { price: Math.round(v) });
  };

  const remove = () => {
    app.removeDish(d.id);
    app.toast(`${d.name} removed from the board`, "🗑️");
  };

  const angles = (d.imgs || []).length;

  return (
    <div className="da-row" data-drow={d.id}>
      <Photo src={d.imgs?.[0] ? thumbPic(d.imgs[0]) : ""} alt={d.name} cat={d.cat} />
      <div>
        <div className="da-name">{d.name}</div>
        <div className="da-cat">{d.cat} · ★{Number(d.rating).toFixed(1)} · {angles} {angles === 1 ? "angle" : "angles"}</div>
      </div>
      <input className="da-price" type="number" step="1000" min="0" value={pv} aria-label={`${d.name} price`}
             onChange={e => { setPv(e.target.value); commitPrice(e.target.value); }} />
      <span className="da-stock">{on ? "● on the board" : "○ off the board"}</span>
      <button className={`da-btn ${on ? "is-on-av" : "is-off"}`} onClick={() => app.toggleDish(d.id)}
              aria-label={`${on ? "Take" : "Put"} ${d.name} ${on ? "off" : "on"} the board`}
              title={on ? "Take off the board" : "Put back on the board"}>
        <Ico name={on ? "eye" : "eyeOff"} />
      </button>
      <button className="da-btn" title="Edit dish"
              onClick={() => app.openModal(<EditDishForm dish={d} />, "modal--wide")}>
        <Ico name="pen" />
      </button>
      <button className="da-btn danger" title="Remove from board" onClick={remove}>
        <Ico name="trash" />
      </button>
    </div>
  );
}
