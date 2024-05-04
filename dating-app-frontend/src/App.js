import './App.css';
//import DatingCards from './components/DatingCards.js';
import Header from './components/Header';
import SwipeButtons from './components/SwipeButtons';
import EventCards from './components/EventCards.js'
function App() {
  return (
    <div className="app">
      <Header />
      <EventCards />
      <SwipeButtons />
    </div>
  );
}

export default App;
