import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '@/theme';

import "bootstrap/dist/css/bootstrap.min.css";

// import "./globals.css";
import "@/styles/index.scss";

import "@articles-media/articles-dev-box/dist/style.css";

import "@articles-media/articles-dev-box/dist/style.css";

import "@articles-media/articles-gamepad-helper/dist/articles-gamepad-helper.css";

import SocketLogicHandler from "@/components/Handlers/SocketLogicHandler";
import LayoutClient from './layout-client';
import PeerHandler from '@/components/Handlers/PeerHandler';
import { Suspense } from 'react';
// import DarkModeHandler from '@/components/UI/DarkModeHandler';
// import GlobalClientModals from '@/components/UI/GlobalClientModals';

export const metadata = {
  title: "Four Frogs",
  description: "Four player capture the flag game. Each player gets three bugs to start, if you lose all your bugs and you are eliminated.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">

      <head>

      </head>

      <body>

        <PeerHandler />
        <LayoutClient />

        <Suspense>
          <SocketLogicHandler />
        </Suspense>

        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <ThemeProvider theme={theme}>
            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
            <CssBaseline />
            {children}
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
