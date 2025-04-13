const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsmate = require("ejs-mate");
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs',ejsmate)
app.use(express.static(path.join(__dirname, "/public")))
main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/airbnb");
}

app.get("/", (req, res) => {
  res.send("working");
});
//index route
app.get("/listings", async (req, res) => {
  const alllistings = await Listing.find({});
  res.render("listings/index.ejs", { alllistings });
});
//new route
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});
//show route
app.get("/listings/:id", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/show.ejs", { listing });
});
app.post("/listings", async (req, res) => {
  let listing = req.body.listing;
  const newListing = new Listing(listing);
  await newListing.save();
  res.redirect("/listings");
});
//Edit
app.get("/listings/:id/edit", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
});
//update route
app.put("/listings/:id", async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`/listings/${id}`);
});
//delete route
app.delete("/listings/:id", async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect("/listings");
});
// app.get("/test",async (req,res)=>{
//     let sample = new Listing({
//         title : "My new villa",
//         description : "abc",
//         price : 1200,
//         location : "goa",
//         country : "india"
//     });
//     await sample.save();
//     console.log("sample saved");
//     res.send("success")
// })
app.listen("8080", () => {
  console.log("Listening to Port 8080");
});
