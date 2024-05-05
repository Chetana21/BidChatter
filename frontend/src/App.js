import { Button } from "@chakra-ui/react";
import "./App.css";
import { Route } from "react-router-dom";
import Homepage from "./Pages/Homepage";
import Chatpage from "./Pages/Chatpage";
import ProductPage from "./Pages/ProductPage";
function App() {
  return (
    <div className="App">
      <Route path="/" component={Homepage} exact />

      <Route path="/chats" component={Chatpage} />

      <Route path="/productPage" component={ProductPage} />
    </div>
  );
}

export default App;
