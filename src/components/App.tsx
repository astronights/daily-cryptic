import '../assets/app.sass';
import NavBar from './NavBar';
import Game from './Game';
import About from './About';
import Rules from './Rules';
import { useState } from 'react';


const App = () => {
  // blue, cyan, gray, green, orange, pink, purple, red, teal, yellow
  const color = "teal";
  const [page, setPage] = useState("game");


  return (
    <>
      <NavBar color={color} updatePage={setPage} />

      {page === "game" && <Game color={color} updatePage={setPage}/>}
      {page === "about" && <About color={color} />}
      {page === "rules" && <Rules color={color}/>}
    </>
  );
}

export default App;