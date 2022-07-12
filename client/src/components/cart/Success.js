import React from "react";
import MetaData from "../Metadata";
import CheckIcon from "@mui/icons-material/Check";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";
function Success() {
  return (
    <>
      <MetaData title="payment-success" />
      <div className="h-[88vh] flex flex-col items-center justify-center gap-3">
        <CheckIcon
          htmlColor="#fff"
          style={{
            backgroundColor: "#fe5f1e",
            padding: "10px",
            borderRadius: "100%",
            fontSize: "80px",
          }}
        />
        <h1 className="text-3xl">Your Order has been placed successfully. </h1>
        <Button variant="contained" style={{ backgroundColor: "#fe5f1e" }}>
          {" "}
          <Link to="/orders">View Orders</Link>
        </Button>
      </div>
    </>
  );
}

export default Success;
