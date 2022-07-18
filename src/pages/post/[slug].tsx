import { GetStaticPaths, GetStaticProps } from 'next'
import { RichText } from 'prismic-dom'
import { createClient } from '../../../prismicio'
import styles from './post.module.scss'
import { FiCalendar, FiClock, FiUser } from 'react-icons/fi'
import { Suspense } from 'react'

interface Post {
  first_publication_date: string | null
  data: {
    title: string
    banner: {
      url: string
    }
    subtitle: string
    author: string
    content: {
      heading: string
      body: {
        text: string
      }[]
    }[]
  }
}

interface PostProps {
  post: Post
}

export default function Post({ post }: PostProps) {
  const numberOfWords = post.data.content.reduce((acc, item) => {
    return acc + RichText.asText(item.body).split(' ').length
  }, 0)

  const minutesToRead = Math.ceil(numberOfWords / 200)
  if (!post) {
    return <div>Carregando...</div>
  }
  return (
    <Suspense fallback={'Carregando...'}>
      <div>
        <div className={styles.banner}>
          {post?.data?.banner?.url && <img src={post.data.banner.url} />}
        </div>
        <div className={styles.postContainer}>
          <div className={styles.prePost}>
            <div>
              <i>
                <FiCalendar />
              </i>
              <p>
                {new Date(post.first_publication_date).toLocaleDateString(
                  'pt-br',
                  {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
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
            <div>
              <i>
                <FiClock />
              </i>
              <p>{minutesToRead} min</p>
            </div>
          </div>
          <div className={styles.post}>
            <h1>{post.data.title}</h1>
            <div>
              {post.data.content.map(content => (
                <div key={content.heading}>
                  <h2>{content.heading}</h2>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: RichText.asHtml(content.body),
                    }}
                  ></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Suspense>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = []
  return {
    paths,
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const client = createClient()
  const postResponse = await client.getByUID('posts', String(params.slug))
  return {
    props: {
      post: postResponse ?? {},
    },
  }
}
