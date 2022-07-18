import { GetStaticPaths, GetStaticProps } from 'next'
import Link from 'next/link'
import { FiCalendar, FiUser } from 'react-icons/fi'
import { createClient } from '../../prismicio'
import Header from '../components/Header'
import styles from './home.module.scss'

interface Post {
  uid?: string
  first_publication_date: string | null
  data: {
    title: string
    subtitle: string
    author: string
  }
}

interface PostPagination {
  next_page: string
  results: Post[]
}

interface HomeProps {
  postsPagination: PostPagination
}

export default function Home({
  postsPagination: { results, next_page },
}: HomeProps) {
  return (
    <div className="container">
      {results.map(post => (
        <Link href={`/post/${post.uid}`} key={post.uid}>
          <a className={styles.postItem}>
            <h2>{post.data.title}</h2>
            <p>{post.data.subtitle}</p>
            <div className={styles.postReadData}>
              <div>
                <i>
                  <FiCalendar />
                </i>
                <p>
                  {new Date(post.first_publication_date).toLocaleDateString(
                    'pt-Br',
                    {
                      day: '2-digit',
                      month: 'short',
                    }
                  )}
                </p>
              </div>
              <div>
                <i>
                  <FiUser />
                </i>
                <p>{post.data.author}</p>
              </div>
            </div>
          </a>
        </Link>
      ))}
    </div>
  )
}
export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}
export const getStaticProps: GetStaticProps = async () => {
  const client = createClient()
  const postsResponse = await client.getByType('posts')
  return {
    props: {
      postsPagination: postsResponse ?? [],
    },
    // revalidate: 60,
  }
}
