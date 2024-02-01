const express = require("express");
const { google } = require("googleapis");
const ee = require("@google/earthengine");
const privateKey = ".ee-way2intobby-7a34019394e2.json";

const authClient = new google.auth.JWT(
  privateKey.client_email,
  null,
  privateKey.private_key,
  ["https://www.googleapis.com/auth/earthengine"]
);

// Authenticate with Earth Engine using the private key
google.options({ auth: authClient });

ee.data.authenticateViaPrivateKey(
  privateKey,
  () => {
    // console.log("Authentication successful.");
    initialize();
  },
  (err) => {
    // console.log({ err });
  }
);

const initialize = function () {
  ee.initialize(
    null,
    null,
    function () {
      // console.log("Earth Engine client library initialized.");
    },
    function (e) {
      // console.error("Initialization error: " + e);
    }
  );
};

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/getAuthToken/", function (req, res) {
  try {
    const authToken = ee.data.getAuthToken();
    res.send(authToken);
  } catch (e) {
    res.send(e);
  }
});

module.exports = app;
