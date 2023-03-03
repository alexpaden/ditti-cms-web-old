import { useSession } from "next-auth/react";
import { Box, Typography } from "@mui/material";

const WalletAddress = () => {
  const { data: session } = useSession();

  if (!session?.address) {
    return null;
  }

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box
        sx={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          backgroundColor: "success.main",
          mr: 1,
        }}
      />
      <Typography variant="subtitle2">{session.address}</Typography>
      <p>some shit</p>
      <Typography variant="subtitle2">{session.fid}</Typography>
    </Box>
  );
};

export default WalletAddress;
