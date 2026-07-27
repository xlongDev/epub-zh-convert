import { Html, Head, Main, NextScript } from "next/document";
import { withBasePath } from "@/utils/basePath";

export default function Document() {
  return (
    <Html lang="zh-CN" suppressHydrationWarning>
      <Head>
        <meta charSet="UTF-8" />
        <link rel="icon" href={withBasePath("/favicon.ico")} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
