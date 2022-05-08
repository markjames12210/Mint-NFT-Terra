import React, { useState, useEffect } from "react";

import Container from "@mui/material/Container";
import "./mint.css";
import { Typography } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import Button from "@mui/material/Button";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DoDisturbOnIcon from "@mui/icons-material/DoDisturbOn";
import { Link } from "react-router-dom";

import {
  LCDClient,
  MsgSend,
  MnemonicKey,
  MsgStoreCode,
  isTxError,
  MsgInstantiateContract,
  MsgExecuteContract,
  Fee,
  StdFee,
  TxResult,
} from "@terra-money/terra.js";

import { Grid } from "@mui/material";
import {
  useConnectedWallet,
  useLCDClient,
  createLCDClient,
  useWallet,
  WalletStatus,
  CreateTxFailed,
  Timeout,
  TxFailed,
  TxUnspecifiedError,
  UserDenied,
} from "@terra-money/wallet-provider";
import Alert from "@mui/material/Alert";
import CheckIcon from "@mui/icons-material/Check";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import Stack from "@mui/material/Stack";
import preval from "preval.macro";
import "react-notifications/lib/notifications.css";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import MenuIcon from "@mui/icons-material/Menu";
import Avatar from "@mui/material/Avatar";
import Logo from "../assets/logo.png";
import TelegramIcon from "@mui/icons-material/Telegram";
import TwitterIcon from "@mui/icons-material/Twitter";
const Mint = (props) => {
  const [values, setValues] = React.useState({
    password: "",

    showPassword: false,
  });
  const [count, setCount] = useState(1);
  var [codeIdinit, SetcodeId] = useState("");
  const [txResult, setTxResult] = useState(null);
  const [txError, setTxError] = useState(null);
  const [signResult, setSignResult] = useState(null);
  const [disablestate, setDisablebutton] = useState(false);
  const {
    status,
    network,
    wallets,
    availableConnectTypes,
    availableInstallTypes,
    availableConnections,
    supportFeatures,
    hasCW20Tokens,
    addCW20Tokens,
    connection,
    connect,
    connectReadonly,
    install,
    disconnect,
  } = useWallet();
  const connectedWallet = useConnectedWallet();
  const contractaddress = "terra1kgudcvvd2dt3xru7xvds3jw77qp0qxwcdd9uxr";
  const alltoken_count = 29;
  const [tokencount, settokenCount] = useState(alltoken_count);
  const components = preval`
  const fs = require("fs");
  module.exports = fs.readFileSync(require.resolve('./optimizefile.wasm'), 'base64')
  `;
  let myCurrentDate = new Date();
  let date = myCurrentDate.getDate();
  let month = myCurrentDate.getMonth() + 1;
  let year = myCurrentDate.getFullYear();
  let currentyear = year.toString().slice(2);
  localStorage.setItem("alltoken", alltoken_count);
  const handleClickReduce = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
    if (count > 1) {
      setCount(count - 1);
    }
  };

  useEffect(() => {
    if (connectedWallet) {
      const initial = async () => {
        const terra = new LCDClient({
          URL: connectedWallet.network.lcd,
          chainID: connectedWallet.network.chainID,
        });
        const numtokens = await terra.wasm.contractQuery(
          contractaddress,
          { num_tokens: {} } // query msg
        );
        console.log(numtokens);
        const allcount = localStorage.getItem("alltoken");
        settokenCount(allcount - numtokens.count);

        if (numtokens.count == allcount) {
          setDisablebutton(false);
          settokenCount(allcount - numtokens.count);
        }
      };
      initial();
    }
  }, [connectedWallet]);
  const handleClickLimitfunction = () => {
    console.log("sd");
  };

  const handleClickMint = async () => {
    if (connectedWallet) {
      const terra1 = new LCDClient({
        URL: connectedWallet.network.lcd,
        chainID: connectedWallet.network.chainID,
      });
      setDisablebutton(true);
      const execute = new MsgExecuteContract(
        connectedWallet.walletAddress, // sender
        contractaddress, // contract account address
        {
          mint: {
            token_id: "",
            owner: "",
            extension: {
              uri: "",
              family_color: "",
              color_name: "",
              hex_code: "",
            },
          },
        }, // handle msg
        { uluna: 1000 } // coins
      );
      connectedWallet
        .post({
          fee: new Fee(1000000, "200000uusd"),
          msgs: [execute],
        })
        .then((nextTxResult) => {
          setTxResult(nextTxResult);
          console.log(nextTxResult);
          const queryfunction = async () => {
            const numtokens = await terra1.wasm.contractQuery(
              contractaddress,
              { num_tokens: {} } // query msg
            );
            console.log(numtokens);
            const allcount = localStorage.getItem("alltoken");
            console.log(allcount);

            if (numtokens.count == allcount) {
              NotificationManager.error("Contract is out of tokens", "error");
              setDisablebutton(false);
              settokenCount(numtokens.count - allcount);
            } else {
              if (nextTxResult.success == true) {
                NotificationManager.success("Mint is Success", "Success");
                setDisablebutton(false);
                settokenCount(allcount - numtokens.count);
              }
            }
          };
          queryfunction();
        })
        .catch((error) => {
          console.log(error);

          if (error instanceof UserDenied) {
            setTxError("User Denied");
            NotificationManager.warning(txError, "Warning", 3000);
            setDisablebutton(false);
          }
          if (error instanceof CreateTxFailed) {
            setTxError("Create Tx Failed: ");
            NotificationManager.warning(txError, "Warning", 3000);
            setDisablebutton(false);
          }
          if (error instanceof TxFailed) {
            setTxError("Tx Failed: ");
            NotificationManager.warning(txError, "Warning", 3000);
            setDisablebutton(false);
          }
          if (error instanceof Timeout) {
            setTxError("Timeout");
            NotificationManager.warning(txError, "Warning", 3000);
            setDisablebutton(false);
          }
          if (error instanceof TxUnspecifiedError) {
            setTxError("Unspecified Error: ");
            NotificationManager.warning(txError, "Warning", 3000);
            setDisablebutton(false);
          }
        });
    }
  };

  const handleClickIncrease = () => {
    if (count < 10) {
      setCount(count + 1);
    }
  };
  return (
    <React.Fragment>
      <Box
        sx={{
          flexGrow: 1,
          marginLeft: "5%",
          marginRight: "5%",
        }}
      >
        <AppBar
          position="static"
          sx={{ backgroundColor: "#2C3764 !important" }}
        >
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2, display: "flex", alignItems: "center" }}
            >
              <Avatar alt="Remy Sharp" src={Logo} />
            </IconButton>
            <Typography
              sx={{
                fontFamily: "monospace",
                fontWeight: "bold",
              }}
              fontSize={{ sm: "20px", md: "27px", lg: "30px" }}
              component="p"
              mr={5}
            >
              SquaresDAO
            </Typography>
            <Box
              sx={{
                width: "100%",
                display: "flex",
                alignItems: "center",

                justifyContent: "center",
              }}
            >
              <Typography variant="h6" component="div" mr={5}>
                <a
                  style={{ color: "#FFF", textDecoration: "none" }}
                  href="https://www.squaresdao.com/#Home"
                >
                  Home
                </a>
              </Typography>
              <Typography variant="h6" component="div" mr={5}>
                <a
                  style={{ color: "#FFF", textDecoration: "none" }}
                  href="https://www.squaresdao.com/#About"
                >
                  About
                </a>
              </Typography>
              <Typography variant="h6" component="div" mr={5}>
                <a
                  style={{ color: "#FFF", textDecoration: "none" }}
                  href="https://www.squaresdao.com/#NFT"
                >
                  NFT
                </a>
              </Typography>
              <Typography variant="h6" component="div" mr={5}>
                <a
                  style={{ color: "#FFF", textDecoration: "none" }}
                  href="https://www.squaresdao.com/#Treasury"
                >
                  Treasury
                </a>
              </Typography>
              <Typography variant="h6" component="div" mr={5}>
                <a
                  style={{ color: "#FFF", textDecoration: "none" }}
                  href="https://www.squaresdao.com/#DAO"
                >
                  DAO
                </a>
              </Typography>
              <Typography variant="h6" component="div" mr={5}>
                <a
                  style={{ color: "#FFF", textDecoration: "none" }}
                  href="https://www.squaresdao.com/#Roadmap"
                >
                  Roadmap
                </a>
              </Typography>
              <Typography variant="h6" component="div" mr={5}>
                <a
                  style={{ color: "#FFF", textDecoration: "none" }}
                  href="https://www.squaresdao.com/#FAQ"
                >
                  FAQ
                </a>
              </Typography>
            </Box>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2, cursor: "pointer" }}
            >
              <a
                style={{ color: "#FFF" }}
                href="https://t.me/+AEQHNYliAT00N2Jh"
              >
                <TelegramIcon sx={{ cursor: "pointer" }} />
              </a>
            </IconButton>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2, cursor: "pointer" }}
            >
              <a
                style={{ color: "#FFF" }}
                href="https://twitter.com/SquaresDAO"
              >
                <TwitterIcon sx={{ cursor: "pointer" }} />
              </a>
            </IconButton>
          </Toolbar>
        </AppBar>
      </Box>
      <Container
        maxWidth="sm"
        sx={{
          backgroundColor: "#06071C",
          borderRadius: "20px",
          justifyContent: "center",
          padding: "50px",
          marginTop: "5%",
          textAlign: "center",
          width: "100%",
        }}
      >
        {/* <ReactNoti position={POSITION.TOP_RIGHT} /> */}

        <Typography
          component="div"
          sx={{ color: "#fff", display: "flex", justifyContent: "center" }}
        >
          {status === WalletStatus.WALLET_NOT_CONNECTED && (
            <Grid container spacing={2}>
              <Grid item xs={6} md={4}>
                {availableInstallTypes.map((connectType) => (
                  <Button
                    key={"install-" + connectType}
                    onClick={() => install(connectType)}
                  >
                    Install {connectType}
                  </Button>
                ))}
              </Grid>
              <Grid item xs={6} md={4}>
                {availableConnections && (
                  <Button
                    key={"connection-" + availableConnections[0]["type"] + ""}
                    onClick={() => connect(availableConnections[0]["type"])}
                  >
                    <img
                      src={availableConnections[0]["icon"]}
                      alt={availableConnections[0]["name"]}
                      style={{ width: "1em", height: "1em" }}
                    />
                    {availableConnections[0]["name"]}
                  </Button>
                )}
              </Grid>
              <Grid item xs={6} md={4}>
                {availableConnections && (
                  <Button
                    key={"connection-" + availableConnections[1]["type"] + ""}
                    onClick={() => connect(availableConnections[1]["type"], "")}
                  >
                    <img
                      src={availableConnections[1]["icon"]}
                      alt={availableConnections[1]["name"]}
                      style={{ width: "1em", height: "1em" }}
                    />
                    {availableConnections[1]["name"]}
                  </Button>
                )}
              </Grid>
            </Grid>
          )}
          {status === WalletStatus.WALLET_CONNECTED && <></>}
        </Typography>
        <Typography component="div" sx={{ marginTop: "50px" }}>
          <Typography component="p">
            <InputLabel
              sx={{
                color: "#FFF",
                fontFamily: "Roboto",
                fontWeight: "600",
                fontSize: "25px",
              }}
              className="minfontspan"
            >
              Mint your NFT
            </InputLabel>
          </Typography>
          <Typography
            component="span"
            sx={{
              color: "#FFF",
              fontSize: "20px",
              fontFamily: "Roboto",
              fontWeight: "400",
            }}
          >
            {tokencount} remaining/1000 UST per Square
          </Typography>
        </Typography>
        <Typography
          component="div"
          sx={{
            marginTop: "10px",
            display: "flex",
            justifyContent: "center",
            marginLeft: "12%",
            marginRight: "12%",
          }}
        >
          <Typography
            sx={{
              display: "flex",
              height: "50px",
              borderRadius: "40px",
              background: "#fff",
              width: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
            component="div"
          >
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickReduce}
                sx={{ color: "#F52EF5" }}
              >
                <DoDisturbOnIcon />
              </IconButton>
            </InputAdornment>
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                sx={{ color: "#000", fontWeight: "600" }}
              >
                {count}
              </IconButton>
            </InputAdornment>
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickIncrease}
                // onMouseDown={handleMouseDownPassword}
                sx={{ color: "#F52EF5" }}
              >
                <AddCircleIcon />
              </IconButton>
            </InputAdornment>
          </Typography>
          <Typography
            sx={{
              display: "flex",
              height: "50px",
              borderRadius: "40px",
              backgroundColor: "#FE8E0E",
              width: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginLeft: "10px",
            }}
            component="div"
          >
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickLimitfunction}
                sx={{
                  fontSize: "15px",
                  fontFamily: "monospace",
                  color: "brown",
                  fontWeight: "bold",
                }}
              >
                <p style={{ color: "#fff" }}>Limit 10 per wallet</p>
              </IconButton>
            </InputAdornment>
          </Typography>
        </Typography>
        <Typography component="div" sx={{ marginTop: "15px" }}>
          <Button
            variant="contained"
            onClick={handleClickMint}
            sx={{
              width: disablestate == false ? "80%" : "80%",
              height: disablestate == false ? "50px" : "50px",
              backgroundColor: disablestate == false ? "#F52EF5" : "#F52EF5",
              borderRadius: disablestate == false ? "40px" : "40px",
              color: disablestate == true ? "#5a5a5a !important" : "#fff",
            }}
            disabled={disablestate}
          >
            MINT NOW!!
          </Button>
        </Typography>
        <Typography
          component="div"
          width="60%"
          display="inline-grid"
          justifyContent="center"
          textAlign="center"
          sx={{ marginTop: "10px" }}
        >
          <Typography
            component="p"
            fontSize={{ sm: "10px", md: "13px", lg: "15px" }}
            sx={{
              color: "#FFF",
              fontFamily: "Roboto",
              fontWeight: "400",
            }}
          >
            Each Square NFT represents an exclusive membership with the DAO and
            also has a treasury value of 0.1%
          </Typography>
        </Typography>
        <NotificationContainer />
      </Container>
    </React.Fragment>
  );
};

export default Mint;
