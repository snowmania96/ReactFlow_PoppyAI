const axios = require("axios");
const cheerio = require("cheerio");

async function getCleanThumbnail(url) {
  try {
    const { data: html } = await axios.get(url);
    const $ = cheerio.load(html);

    // Extract the main og:image content
    const imageUrl = $('meta[property="og:image"]').attr("content");

    // Sometimes, Instagram provides additional data or images without overlays
    const alternateUrl = $('meta[name="twitter:image"]').attr("content");

    if (alternateUrl) {
      console.log("Alternate Image URL:", alternateUrl);
      return alternateUrl;
    } else if (imageUrl) {
      console.log("Image URL with overlay:", imageUrl);
      return imageUrl;
    } else {
      console.log("No suitable image found.");
    }
  } catch (error) {
    console.error("Error fetching thumbnail:", error.message);
  }
}

// Example usage
const instagramUrl =
  "https://www.instagram.com/randomdiscourse_pod/reel/DDspHIeMsZD/";
getCleanThumbnail(instagramUrl);
