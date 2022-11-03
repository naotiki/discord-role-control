import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import {Box, Heading, SimpleGrid, Spacer, Text} from "@chakra-ui/react";

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Super Ultimate Discord Role Control Panel</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Heading size="xl">
           Sugoi User-friendly Perfect Enchanted Role Integrated Discord Operate Linter

          <div style={{textAlign:"center"}}>SUPER IDOL</div>
        </Heading>
        <Text fontSize="xl">
          煩わしいロールの権限管理とはもうお別れです。
        </Text>
        <Spacer marginY={5}></Spacer>


        <SimpleGrid columns={2} spacing={10}>
          <Box border="1px" borderRadius="md" p="1.5rem" _hover={{
            "color":"#0070f3",
            "border-color": "#0070f3",
          }}>
            <a href="#">
              <Text fontSize="2xl">始める &rarr;</Text>
              <Text>このツールを使用する流れを学びましょう。</Text>
            </a>

          </Box>
          <Box border="1px" borderRadius="md" p="1.5rem" _hover={{
            "color":"#0070f3",
            "border-color": "#0070f3",
          }}>
            <a href="#">
              <Text fontSize="2xl">準備中 &rarr;</Text>
              <Text>Coming soon...</Text>
            </a>

          </Box>
          <Box border="1px" borderRadius="md" p="1.5rem" _hover={{
            "color":"#0070f3",
            "border-color": "#0070f3",
          }}>
            <a href="#">
              <Text fontSize="2xl">準備中 &rarr;</Text>
              <Text>Coming soon...</Text>
            </a>

          </Box>
          <Box border="1px" borderRadius="md" p="1.5rem" _hover={{
            "color":"#0070f3",
            "border-color": "#0070f3",
          }}>
            <a href="#">
              <Text fontSize="2xl">準備中 &rarr;</Text>
              <Text>Coming soon...</Text>
            </a>

          </Box>
        </SimpleGrid>

        <div className={styles.grid}>
          <a href="https://nextjs.org/docs" className={styles.card}>
            <h2>Documentation &rarr;</h2>
            <p>Find in-depth information about Next.js features and API.</p>
          </a>

          <a href="https://nextjs.org/learn" className={styles.card}>
            <h2>Learn &rarr;</h2>
            <p>Learn about Next.js in an interactive course with quizzes!</p>
          </a>

          <a
            href="https://github.com/vercel/next.js/tree/canary/examples"
            className={styles.card}
          >
            <h2>Examples &rarr;</h2>
            <p>Discover and deploy boilerplate example Next.js projects.</p>
          </a>

          <a
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.card}
          >
            <h2>Deploy &rarr;</h2>
            <p>
              Instantly deploy your Next.js site to a public URL with Vercel.
            </p>
          </a>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}
