import "./App.css";
import Home from "./Components/Home";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img
          src="/StackOS_Logo_Black.png"
          style={{ paddingTop: 15 }}
          width={250}
        />
        <Home />
      </header>
    </div>
  );
}

export default App;
