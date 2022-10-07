import './App.css';
import Wallet from "../src/component/wallet/wallet";
import Transaction from "../src/component/transaction/transaction"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
    <Router>
      <Routes>
        <Route path="/" element={<Wallet />} />
        <Route path="/transaction" element={<Transaction />} />
      </Routes>
    </Router>
    </div>
  );
}

export default App;
