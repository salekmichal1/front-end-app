import style from './LightGalleryItem.module.css';

export default function LightGalleryItem(props: { src: string }) {
  return (
    <div className="image-container">
      <a href={props.src} className="gallery-item">
        <img src={props.src} style={{ maxWidth: '200px' }} />
      </a>
      <button>Dupa</button>
    </div>
  );
}
