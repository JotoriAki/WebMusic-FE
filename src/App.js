import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Footer from "./Show/Footer/Footer";
import Header from "./Show/Header/Header";
import 'semantic-ui-css/semantic.min.css';
import { privateRoutes, publicRoutes } from "./routes";


const authenticate = localStorage.getItem("authenticate");

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Header />
        </header>

        <Routes>
          {publicRoutes.map((route, index) => {
            const Page = route.component;
            return <Route key={index} path={route.path} element={<Page />} />;
          })}
          {authenticate &&
            privateRoutes.map((route, index) => {
              const Page = route.component;
              return <Route key={index} path={route.path} element={<Page />} />;
            })}
        </Routes>

        <footer>
          <Footer />
        </footer>
      </div>
    </Router>
  );
}

export default App;
