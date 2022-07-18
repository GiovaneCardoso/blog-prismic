import Link from 'next/link'
import styles from './header.module.scss'
export default function Header() {
  return (
    <header className={styles.header}>
      <Link href={'/'}>
        <img src="/Logo.png" alt="logo" />
      </Link>
    </header>
  )
}
