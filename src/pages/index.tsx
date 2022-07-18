import { GetStaticProps } from 'next'
import Link from 'next/link'
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
  console.log(results)
  return (
    <div className="container">
      <Header />
      {results.map(post => (
        <Link href={post.uid} key={post.uid}>
          <a className={styles.postItem}>
            <h2>{post.data.title}</h2>
            <p>{post.data.subtitle}</p>
            <div>
              {new Date(post.first_publication_date).toLocaleDateString(
                'pt-Br',
                {
                  day: '2-digit',
                  month: 'short',
                }
              )}
              {post.data.author}
            </div>
          </a>
        </Link>
      ))}
    </div>
  )
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
