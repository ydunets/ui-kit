import { useId, useRef, useState } from 'react';
import { cx } from '@/shared/lib/cx';
import { useMediaQuery } from '@/shared/lib/useMediaQuery';
import styles from './Navbar.module.css';
import { CloseIcon, MenuIcon, ShoppingBagIcon, StyleNestLogo } from './icons';

export type TNavbarLink = {
  label: string;
  href: string;
};

export type TNavbarProps = {
  links?: TNavbarLink[];
  brandHref?: string;
  brandLabel?: string;
  cartHref?: string;
  cartLabel?: string;
};

const DEFAULT_LINKS: TNavbarLink[] = [
  { label: 'Shop all', href: '#' },
  { label: 'Latest arrivals', href: '#' },
];

export const Navbar = ({
  links = DEFAULT_LINKS,
  brandHref = '#',
  brandLabel = 'StyleNest home',
  cartHref = '#',
  cartLabel = 'Shopping bag',
}: TNavbarProps) => {
  const drawerId = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);

  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  // Drawer unmounts on desktop (which closes it); reset so aria-expanded can't lie.
  if (open && isDesktop) {
    setOpen(false);
  }

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
