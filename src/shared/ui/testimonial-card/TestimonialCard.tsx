import { FC, useId } from 'react';
import styles from './TestimonialCard.module.css';

export interface TestimonialCardProps {
  authorName: string;
  authorUsername: string;
  authorImage: string;
  testimonialText: string;
}

export const TestimonialCard: FC<TestimonialCardProps> = ({
  authorName,
  authorUsername,
  authorImage,
  testimonialText,
}) => {
  // useId() ensures unique IDs when multiple TestimonialCard instances are rendered
  // Each card instance gets a unique base ID, preventing ID collisions
  const cardId = useId();
  const authorId = `${cardId}-author`;
  const testimonialId = `${cardId}-testimonial`;

  return (
    <figure
      className={styles.card}
      role="article"
      aria-labelledby={authorId}
      aria-describedby={testimonialId}
    >
      <figcaption className={styles.author} id={authorId}>
        <img
          src={authorImage}
          alt={`${authorName}'s profile picture`}
          className={styles.authorImage}
        />
        <div className={styles.authorInfo}>
          <div className={styles.authorName}>
            {authorName}
          </div>
          <div className={styles.authorUsername} aria-label={`Username: ${authorUsername}`}>
            {authorUsername}
          </div>
        </div>
      </figcaption>
      <blockquote
        id={testimonialId}
        aria-label={`Testimonial by ${authorName}`}
      >
        <p>{testimonialText}</p>
      </blockquote>
    </figure>
  );
};
