'use client';

import React from 'react';
import { ChakraProvider } from "@chakra-ui/react";
import '../assets/index.sass';
import theme from "../theme";
import dynamic from 'next/dynamic';

const App = dynamic(() => import('../components/App'), { ssr: false })

export default function Home() {
  return (
    <main>
      <ChakraProvider theme={theme}>
          <App />
      </ChakraProvider>
    </main>
  );
}
