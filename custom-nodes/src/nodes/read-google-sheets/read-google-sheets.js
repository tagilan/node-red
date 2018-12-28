const fs = require("fs");
const readline = require("readline");
const { google } = require("googleapis");

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"];
const TOKEN_PATH = "token.json";
const sheetID = "1MFddMRkKIU9GFBkbH1jInvKsjV4NQ1_S29J9_8kC2c0";

const credential = {
  installed: {
    client_id:
      "655978268067-v7vfdurr9bac3rhbac71opumuehsbqt1.apps.googleusercontent.com",
    project_id: "sheetsapi-217605",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://www.googleapis.com/oauth2/v3/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_secret: "DmepRft0foGbg_rvljc9_1Yu",
    redirect_uris: ["urn:ietf:wg:oauth:2.0:oob", "http://localhost"]
  }
};

module.exports = function(RED) {
  function readSheetsNode(config) {
    RED.nodes.createNode(this, config);
    var node = this;
    node.on("input", data => {
      input(node, data, config);
    });
  }
  RED.nodes.registerType("read-google-sheets", readSheetsNode);
};

function input(node, data, config) {
  authorize(credential, listMajors);

  function authorize(credentials, callback) {
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
      client_id,
      client_secret,
      redirect_uris[0]
    );
    fs.readFile(TOKEN_PATH, (err, token) => {
      if (err) return getNewToken(oAuth2Client, callback);
      oAuth2Client.setCredentials(JSON.parse(token));
      callback(oAuth2Client);
    });
  }

  function getNewToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: "offline",
      scope: SCOPES
    });
    console.log("Authorize this app by visiting this url:", authUrl);
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    rl.question("Enter the code from that page here: ", code => {
      rl.close();
      oAuth2Client.getToken(code, (err, token) => {
        if (err)
          node.status({
            fill: "red",
            shape: "dot",
            text: "Error : " + err
          });
        return console.error(
          "Error while trying to retrieve access token",
          err
        );
        oAuth2Client.setCredentials(token);
        fs.writeFile(TOKEN_PATH, JSON.stringify(token), err => {
          if (err) console.error(err);
          console.log("Token stored to", TOKEN_PATH);
        });
        callback(oAuth2Client);
      });
    });
  }

  function listMajors(auth) {
    const sheets = google.sheets({
      version: "v4",
      auth
    });
    sheets.spreadsheets.values.get(
      {
        spreadsheetId: sheetID,
        range: "A1:Z1000"
      },
      (err, res) => {
        if (err) {
          node.status({
            fill: "red",
            shape: "dot",
            text: "Error : " + err
          });
          return console.log("The API returned an error: " + err);
        }
        const rows = res.data.values;
        if (rows.length) {
          data.response = rows;
        } else {
          data.response = "No data found.";
          console.log("No data found.");
        }
        node.status({
          fill: "green",
          shape: "dot",
          text: "Returned data succesfully"
        });
        node.send(data);
      }
    );
  }
}
