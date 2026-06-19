import { FC, useId, useRef, useState } from 'react';
import { cx } from '@/shared/lib/cx';
import { useMediaQuery } from '@/shared/lib/useMediaQuery';
import styles from './Navbar.module.css';
import { CloseIcon, MenuIcon, ShoppingBagIcon, StyleNestLogo } from './icons';

export interface NavbarLink {
  label: string;
  href: string;
}

export interface NavbarProps {
  /** Navigation links shown inline on desktop and stacked in the mobile drawer. */
  links?: NavbarLink[];
  /** Destination for the logo. */
  brandHref?: string;
  /** Accessible label for the logo link. */
  brandLabel?: string;
  /** Destination for the shopping bag / cart action. */
  cartHref?: string;
  /** Accessible label for the cart action. */
  cartLabel?: string;
}

const DEFAULT_LINKS: NavbarLink[] = [
  { label: 'Shop all', href: '#' },
  { label: 'Latest arrivals', href: '#' },
];

export const Navbar: FC<NavbarProps> = ({
  links = DEFAULT_LINKS,
  brandHref = '#',
  brandLabel = 'StyleNest home',
  cartHref = '#',
  cartLabel = 'Shopping bag',
}) => {
  const drawerId = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);

  // `open` mirrors the native dialog and is changed only from events (no sync
  // Effect). The drawer is unmounted on desktop, which closes it; the render-time
  // adjustment keeps `open` honest so aria-expanded never lies after a resize.
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  if (open && isDesktop) {
    setOpen(false);
  }

  // Open/close are user interactions → driven imperatively from handlers.
  // close() routes through the dialog so ESC, the close button, backdrop and
  // link clicks all converge on the same `onClose` → setOpen(false).
  const openDrawer = () => {
    dialogRef.current?.showModal();
    setOpen(true);
  };
  const closeDrawer = () => dialogRef.current?.close();

  return (
    <header className={styles.root}>
      <div className={styles.container}>
        <div className={styles.leftCluster}>
          <a href={brandHref} className={styles.brand} aria-label={brandLabel}>
            <StyleNestLogo className={styles.logo} aria-label="StyleNest" />
          </a>

          <nav className={styles.desktopNav} aria-label="Main">
            <ul className={styles.navList}>
              {links.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className={styles.link}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className={styles.actions}>
          <a href={cartHref} className={styles.iconButton} aria-label={cartLabel}>
            <ShoppingBagIcon className={styles.icon} />
          </a>

          <button
            type="button"
            className={cx(styles.iconButton, styles.menuButton)}
            aria-label="Open menu"
            aria-haspopup="dialog"
            aria-expanded={open}
            aria-controls={drawerId}
            onClick={openDrawer}
          >
            <MenuIcon className={styles.icon} />
          </button>
        </div>
      </div>

      {/*
        Native modal dialog. showModal() (in openDrawer) gives us the focus trap,
        ESC-to-close, focus return to the trigger and an inert background. Rendered
        only below `lg` — unmounting on desktop closes any open drawer. `onClose`
        syncs React state on every close path (ESC included); the outer onClick
        closes on backdrop clicks (target is the <dialog> box itself).
      */}
      {!isDesktop && (
        <dialog
          id={drawerId}
          ref={dialogRef}
          data-navbar-drawer
          className={styles.drawer}
          aria-label="Site menu"
          onClose={() => setOpen(false)}
          onClick={(event) => {
            if (event.target === dialogRef.current) closeDrawer();
          }}
        >
          <div className={styles.drawerInner}>
            <div className={styles.drawerHeader}>
              <StyleNestLogo className={styles.logo} aria-label="StyleNest" />
              <button
                type="button"
                className={styles.iconButton}
                aria-label="Close menu"
                onClick={closeDrawer}
              >
                <CloseIcon className={styles.icon} />
              </button>
            </div>

            <nav className={styles.drawerNav} aria-label="Mobile">
              <ul className={styles.drawerList}>
                {links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className={styles.drawerLink} onClick={closeDrawer}>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </dialog>
      )}
    </header>
  );
};
