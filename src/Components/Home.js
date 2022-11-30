import {
  TextField,
  Button,
  FormHelperText,
  CircularProgress,
} from "@mui/material";
import { useState } from "react";
import Web3 from "web3";
import QRPage from "./QRPage";

const web3 = new Web3(`https://polygon-rpc.com/`);

function Home() {
  const [numbers, setNumbers] = useState(0);
  const [error, SetError] = useState(null);
  const [wallets, setWallets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    handleLoader(true);
    try {
      const num = parseInt(numbers);
      if (!num || num <= 0) {
        SetError("Please check Input is valid or not and try again");
        handleLoader(false);
      } else {
        let tempWallet = [];
        let i = 0;
        while (i < num) {
          var account = web3.eth.accounts.create();
          tempWallet.push(account);
          i++;
        }
        setWallets(tempWallet);
      }
    } catch (err) {
      SetError("Oops! Errors Occured");
      handleLoader(false);
    }
  };

  const handleLoader = (flag) => {
    setIsLoading(flag);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Generate ETH Wallets</h1>
        <p>Enter the Number of etheruem wallets you want to create</p>
        <TextField
          onChange={(e) => {
            e.preventDefault();
            if (error) SetError(null);
            setNumbers(e.target.value);
          }}
          value={numbers}
        />
        {error && (
          <FormHelperText style={{ color: "red" }}>{error}</FormHelperText>
        )}
        <Button
          disabled={isLoading}
          style={{ margin: 30 }}
          variant="contained"
          onClick={handleSubmit}
        >
          Submit
        </Button>
        {/* {isLoading && <CircularProgress />} */}
        {wallets.length > 0 && (
          <QRPage wallets={wallets} handleLoader={handleLoader} />
        )}
      </header>
    </div>
  );
}

export default Home;
