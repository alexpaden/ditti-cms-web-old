import { useEffect, useState } from "react";

export default function WeatherPage() {
  const [address, setAddress] = useState<string | null>(null);

  useEffect(() => {
    const getAddress = async () => {
      const response = await fetch("/api/me");
      const data = await response.json();
      setAddress(data.address);
    };
    getAddress();
  }, []);

  if (address) {
    // Display weather information here
    return <div>Weather information goes here for address {address}</div>;
  } else {
    // Ask user to sign in with their Ethereum wallet
    return (
      <div>
        <p>Please sign in with your Ethereum wallet to view the weather.</p>
      </div>
    );
  }
}
