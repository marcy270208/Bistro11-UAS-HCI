import { useApp } from "../lib/store.jsx";
import { shortDate, safeAvatar } from "../lib/format.js";
import Ico from "../lib/icons.jsx";
import Stars from "./Stars.jsx";
import ReviewForm from "./modals/ReviewForm.jsx";

export default function ReviewSection() {
  const app = useApp();
  const live = app.data.reviews.filter(r => !r.hidden);
  const avg = live.length ? live.reduce((t, r) => t + r.stars, 0) / live.length : 0;

  return (
    <section className="reviews" id="reviews">
      <div className="wrap">
        <header className="sec-head">
          <div>
            <span className="eyebrow reveal" data-reveal><i className="eyebrow__dot" /> Guest book</span>
            <h2 className="reveal" data-reveal>What people said</h2>
          </div>
          <div className="rating-summary reveal" data-reveal>
            <strong>{avg.toFixed(1)}</strong>
            <div>
              <Stars value={avg} />
              <small>{`${live.length} ${live.length === 1 ? "review" : "reviews"} · last 30 days`}</small>
            </div>
          </div>
        </header>

        <div className="review-grid">
          {live.slice(0, 8).map((r, i) => (
            <article className="review" key={r.id || `rv-${i}`} data-reveal>
              <div className="review__head">
                {(() => {
                  const acc = r.email ? app.findAccount(r.email) : null;
                  const pic = acc?.avatar ? safeAvatar(acc.avatar) : "";
                  return pic ? (
                    <img src={pic} className="avatar" alt={r.name} />
                  ) : (
                    <span className="avatar">{r.name[0] || "G"}</span>
                  );
                })()}
                <span className="review__who">
                  <b>{r.name}</b>
                  <span>{shortDate(r.date)}</span>
                </span>
                <Stars value={r.stars} />
              </div>
              <p className="review__body">{`“${r.text}”`}</p>
              {r.dish && <span className="review__dish">{`ordered · ${r.dish}`}</span>}
            </article>
          ))}
        </div>

        <div className="reviews__cta reveal" data-reveal>
          <p>Been by the table? Tell the kitchen how it went.</p>
          <button className="btn btn--primary"
                  onClick={() => {
                    if (app.asCustomer("Sign in to leave a review - we keep them tied to your account.")) {
                      app.openModal(<ReviewForm />);
                    }
                  }}>
            <Ico name="pen" /> Write a review
          </button>
        </div>
      </div>
    </section>
  );
}
