// Initializing the express app
const express = require("express");

const app = express();
require("dotenv").config();
const fetch = require("node-fetch");

// General middelwares
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// Setting my main routes
app.get("/", (req, res) => {
  res.render("index");
});

app.post("/convert-mp3", async (req, res) => {
  const videoUrl = req.body.videoUrl;
  let videoID;

  try {
    // Splitting the url so that we get the id only
    if (videoUrl.split("=")[1].includes("&")) {
      // If the url includes multi givin values, so we split it twice to get the id
      // Otherwise we split it one time
      videoID = videoUrl.split("=")[1].split("&")[0];
    } else {
      videoID = videoUrl.split("=")[1];
    }

    // Sending the fetch request
    const fetchAPI = await fetch(
      `https://youtube-mp36.p.rapidapi.com/dl?id=${videoID}`,
      {
        method: "GET",
        headers: {
          "X-RapidAPI-Host": process.env.API_HOST,
          "X-RapidAPI-Key": process.env.API_KEY,
        },
      }
    );

    // Parsing the response into json
    const fetchResponse = await fetchAPI.json();

    // If the response went fine then we send the values back
    if (fetchResponse.status == "ok") {
      // Rendering the home page
      return res.render("index", {
        success: true,
        video_link: fetchResponse.link,
        video_title: fetchResponse.title,
      });
    } else {
      return res.render("index", { success: false });
    }
  } catch (error) {
    return res.json({ status: "erorr", message: error.message });
  }
});
// Defining the port
const port = process.env.PORT || 3000;

// Running the server on a specific port
app.listen(port, (err) => {
  // Checking if there is any error while running the server
  if (err) {
    console.log("An error accourd while running the server");
  } else {
    console.log(`Server is now runing on port ${port}`);
  }
});
