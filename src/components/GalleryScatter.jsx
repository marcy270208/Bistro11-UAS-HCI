import { GALLERY, scatterPic } from "../data/photos.js";
import Photo from "./Photo.jsx";

export default function GalleryScatter() {
  return (
    <section className="gallery" id="gallery">
      <div className="wrap">
        <h2 className="reveal" data-reveal>From the pass</h2>
        <div className="scatter">
          {GALLERY.map((g, i) => (
            <figure key={g.slug} data-cap={g.cap}>
              <Photo src={scatterPic(g.slug, i)} alt={g.cap} cat="Mains" />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
