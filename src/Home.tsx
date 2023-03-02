import { Web3Button } from "@web3modal/react";

function Home() {
  return (
    <div>
      <h1>Welcome to My Web3 App</h1>
      <p>Connect your wallet to get started!</p>

      <Web3Button />
    </div>
  );
}

export default Home;
