import { useEffect, useState } from "react";
import { ethers } from "ethers";

// Components
import Navigation from "./components/Navigation";
import Section from "./components/Section";
import Product from "./components/Product";

// ABIs
import Daamazon from "./abis/Daamazon.json";

// Config
import config from "./config.json";

function App() {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [daamazon, setDaamazon] = useState(null);
  const [electronics, setElectronics] = useState(null);
  const [clothing, setClothing] = useState(null);
  const [toys, setToys] = useState(null);
  const loadBlockchainData = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    setProvider(provider);

    const network = await provider.getNetwork();
    const daamazon = new ethers.Contract(
      config[network.chainId].daamazon.address,
      Daamazon,
      provider
    );
    setDaamazon(daamazon);
    const items = [];
    for (var i = 0; i < 9; i++) {
      const item = await daamazon.items(i + 1);
      items.push(item);
    }
    const electronics = items.filter((item) => item.category === "electronics");
    const clothing = items.filter((item) => item.category === "clothing");
    const toys = items.filter((item) => item.category === "toys");
  };
  useEffect(() => {
    loadBlockchainData();
  }, []);
  return (
    <div>
      <Navigation account={account} setAccount={setAccount} />
      <h2>Daamazon Best Sellers</h2>
     {electronics&&clothing&&toys?App(

      <p>Products</p>
     )}
    </div>
  );
}

export default App;
