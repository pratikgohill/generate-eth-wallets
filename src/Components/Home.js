import { TextField, Button, FormHelperText } from "@mui/material";
import { useEffect, useState } from "react";
import Web3 from "web3";
import QRPage from "./QRPage";

function Home() {
  const web3 = new Web3(`https://polygon-rpc.com/`);

  const [numbers, setNumbers] = useState(0);
  const [error, SetError] = useState(null);
  const [wallets, setWallets] = useState([]);

  const handleSubmit = async () => {
    try {
      const num = parseInt(numbers);
      if (!num || num <= 0) {
        SetError("Please check Input is valid or not and try again");
      } else {
        let tempWallet = [];
        for (let i = 0; i < num; i++) {
          var account = web3.eth.accounts.create();
          tempWallet.push(account);
        }
        setWallets(tempWallet);
      }
    } catch (err) {
      SetError("Oops! Errors Occured");
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Generate ETH Wallets</h1>
        <p>Enter the Number of etheruem wallets you want to create</p>
        <TextField
          onChange={(e) => {
            SetError(null);
            setNumbers(e.target.value);
          }}
          value={numbers}
        />
        {error && (
          <FormHelperText style={{ color: "red" }}>{error}</FormHelperText>
        )}
        <Button
          style={{ margin: 30 }}
          variant="contained"
          onClick={handleSubmit}
        >
          Submit
        </Button>
        {wallets.length > 0 && <QRPage wallets={wallets} />}
      </header>
    </div>
  );
}

export default Home;
