import '../assets/css/app.sass';
import NavBar from './NavBar';
// import Game from './Game';
// import Header from './Header';
// import About from './About';
// import Contact from './Contact';
// import Footer from './Footer';
import { useState } from 'react';

const App = () => {
  // blue, cyan, gray, green, orange, pink, purple, red, teal, yellow
  const color = "teal";

  // set a state to store the page we are on
  const [page, setPage] = useState("game");

  return (
    <>
      <NavBar color={color} />
      {/* {
        page === "game" ? <Game /> : <>

    }


          <Header color={color} />
          <About color={color} />
          <Contact color={color} />
          <Footer /> */}
        </>
  );
}

      export default App;