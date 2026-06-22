import { useState } from 'react';
import { cx } from '@/shared/lib/cx';
import { squareImage } from '@/shared/lib/image';
import styles from './ImageGallery.module.css';

export type TImageGalleryProps = {
  images: string[];
  alt: string;
};

const MAIN_WIDTH = 800;
const THUMB_WIDTH = 200;

export const ImageGallery = ({ images, alt }: TImageGalleryProps) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const imagesKey = images[0] ?? '';
  const [activeKey, setActiveKey] = useState(imagesKey);
  if (imagesKey !== activeKey) {
    setActiveKey(imagesKey);
    setActiveIndex(0);
  }

  const mainImage = images[activeIndex] ?? images[0];

  return (
    <div className={styles.root}>
      <div className={styles.mainWrap}>
        {mainImage && (
          <img
            src={squareImage(mainImage, MAIN_WIDTH)}
            alt={alt}
            className={styles.main}
            decoding="async"
          />
        )}
      </div>

      {images.length > 1 && (
        <div className={styles.thumbs}>
          {images.map((url, index) => (
            <button
              key={url}
              type="button"
              className={cx(styles.thumb, index === activeIndex && styles.thumbActive)}
              aria-label={`View image ${index + 1} of ${images.length}`}
              aria-current={index === activeIndex}
              onClick={() => setActiveIndex(index)}
            >
              <img
                src={squareImage(url, THUMB_WIDTH)}
                alt=""
                className={styles.thumbImage}
                loading="lazy"
                decoding="async"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
