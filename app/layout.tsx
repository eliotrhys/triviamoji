import '../styles/globals.css';
import Script from 'next/script'

export default function RootLayout({ children }: { children: any }) {
  return (
    <html lang="en">
    {
    }
      <head>
        <title>Triviamoji</title>
        {/* <link rel="stylesheet" href="https://use.typekit.net/wtd2uom.css"></link> */}
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon.png"></link>
        <meta name="theme-color" content="#fff" />
        <meta property="og:title" content="Triviamoji" />
        <meta property="og:site_name" content="Triviamoji" />
        <meta property="og:url" content="https://www.triviamoji.com" />
        <meta property="og:description" content="Triviamoji is a marathon emoji trivia game! Look at the emojis, check the category and give it your best guess! With 1000s of questions and dozens of categories, you can spend hours tickle your brain with the most challenging, and most fun emoji guessing game out there - just don't let the timer run out!" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/images/triviamoji_og.jpg" />
        <meta name="keywords" content="Triviamoji, Emoji trivia, Emoji guessing game, Emoji trivia challenge, Guess the emoji game, Emoji quiz challenge, Emoji charades game, Emoji puzzle game, Emoji word game, Emoji brain teaser, Emoji guessing competition, Emoji riddle game, Emoji, Guess the emoji" />
        <Script id="tagManager" async src="https://www.googletagmanager.com/gtag/js?id=G-0ELFHP6WM4" />

        <Script id="settingGoogleSettings"
              dangerouslySetInnerHTML={{
                __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
      
                gtag('config', 'G-0ELFHP6WM4');
            `,
            }}
          />
      </head>
      <body className="w-full">{children}</body>
      
      {/* <!-- Google tag (gtag.js) --> */}

      
    </html>
  );
}