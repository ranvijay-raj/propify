var express = require('express');
var router = express.Router();
const upload = require("./multer")
const passport = require("passport")
const userModel = require("./users")
const propertyModel = require("./property")
const suggestionModel = require("./suggestion")
const localStrategy = require("passport-local")
let mongoose = require("mongoose");
const property = require('./property');
let uploadToCloudinary = require("./cloudinary")
passport.use(new localStrategy(userModel.authenticate()))
const isLoggedIn = (req, res, next)=>{
  if(req.isAuthenticated()){
    return next()
  }
  res.redirect('/')
}
const check = (req, res, next)=>{
  if(req.isAuthenticated()){
    res.redirect("/home")
  }
  return next()
}
router.get('/', check ,async function(req, res) {
  let properties = await propertyModel.find().limit(4).populate("owner")
  let parameter = "false"
  if (req.query.login !== undefined) {
    parameter = req.query.login
  }
  res.render('index', {login: parameter, scroll: req.query.scroll, err: req.flash("error"), properties: properties});
});
router.get("/search",(req, res)=>{
  let search = ""
  let propertyType = ""
  if (req.query.q !== undefined) {
    search = req.query.q
  }
  if (req.query.p !== undefined) {
    propertyType = req.query.p
  }
  res.render("search", {search: search, p: propertyType})
});
router.get("/searched", async (req, res)=>{
  let logged = "false"
  let search = req.query.q
  if (req.isAuthenticated()) {
    logged = "true"
  }
  res.render("result", {q: search, logged: logged})
})
router.get("/info/about", (req, res)=>{
  res.render("about")
})
router.get("/info/privacy-policy", (req, res)=>{
  res.render("privacy")
})
router.get("/info/terms-and-conditions", (req, res)=>{
  res.render("conditions")
})
router.get("/home", isLoggedIn, async (req, res)=>{
  let propertiesA = await propertyModel.find({type: "PLOT/LAND"}).limit(4).populate("owner")
  let propertiesB = await propertyModel.find({type: {$ne: "PLOT/LAND"}}).limit(4).populate("owner")
  let user = await userModel.findOne({username: req.session.passport.user})
  if(user.updated == "false"){
    res.redirect("/edit-profile?i=*")
  }
  res.render("home", {propertiesA: propertiesA, propertiesB: propertiesB, user: user})
})
router.post("/register", async (req, res)=>{
  const user = await userModel.find({username: req.body.username})
  if (!(user.length > 0)) {
    const data = new userModel({
      username: req.body.username,
      fullName: req.body.fullName,
      updated: "false"
    })
    userModel.register(data, req.body.password).then((user)=>{
      passport.authenticate("local")(req, res, ()=>{
        res.redirect("/edit-profile?i=*")
      })
    })
  }
  else{
    req.flash("error", " This Email id is already taken")
    res.redirect("/?scroll=true")
  }
})
router.post("/login", passport.authenticate("local", {
  successRedirect: "/home",
  failureRedirect: "/?login=true&scroll=true",
  failureFlash: true
}), (req, res)=>{})
router.get("/profile", isLoggedIn, async (req, res)=>{
  const user = await userModel.findOne({username: req.session.passport.user}).populate("property")
  if(user.updated == "false"){
    res.redirect("/edit-profile?i=*")
  }
  res.render("profile", {user: user})
})
router.get("/profile/:id", async (req, res)=>{
  let user
  let login = "false"
  if (req.isAuthenticated()) {
    login = "true"
    user = await userModel.findOne({username: req.session.passport.user})
  }
  const dealer = await userModel.findOne({_id: req.params.id}).populate("property")
  res.render("dealer", {dealer: dealer, user: user, login: login})
})
router.get("/property", async (req, res)=>{
  let user
  let elite = "false"
  let location = req.headers.referer
  if (location.includes("/property") || location.includes("/media")) {
    location = req.session.location    
  }else{
    req.session.location = location
  }
  if (req.isAuthenticated()) {
    user = await userModel.findOne({username: req.session.passport.user})
  }
  let property = await propertyModel.findOne({_id: req.query.id}).populate("owner").populate("contacted")
  if(user !== undefined && user.property.includes(property._id)){
    elite = "true"
    property.new = false
    await property.save()
  }
  res.render("detailed", {elite: elite, property: property, location: location, user: user})
})
router.get("/edit-profile", isLoggedIn, async (req, res)=>{
  let impoertance = req.query.i
  let back = "false"
  if (impoertance == undefined) {
    back = "true"
  }
  const user = await userModel.findOne({username: req.session.passport.user})
  res.render("profileedit", {user: user, back: back})
})
router.post("/update", isLoggedIn, upload.single("dp") , async (req, res)=>{
  let username = req.session.passport.user
  let user = await userModel.findOne({username: username})
  let mobile
  if (user.updated !== "false") {
    mobile = user.mobile
  } else {
    mobile = req.body.mobile
  }
  let name = req.body.fullName
  let dp = user.dp
  if (mobile.length <= 0) {
    mobile = user.mobile
  }
  if (name.length <= 0) {
    name = user.fullName
  }
  if (req.file) {
    dp = await uploadToCloudinary(req.file.path)
    dp = dp.url
  }
  let updated = await userModel.updateOne(
    { username: username }, // Filter criteria
    { $set: { fullName: name, mobile: mobile, updated: "true", dp: dp } },
    { upsert: true } // Update operations
);
res.redirect("/profile")
})
router.get("/uploadProperty", isLoggedIn, async (req, res)=>{
  let user = await userModel.findOne({username: req.session.passport.user})
  if(user.updated == "false"){
    res.redirect("/edit-profile?i=*")
  }
  res.render("list")
})
router.get("/editProperty/:id", isLoggedIn, async (req, res)=>{
  let user = await userModel.findOne({username: req.session.passport.user})
  let property = await propertyModel.findOne({_id: req.params.id})
  if (!(user.property.includes(req.params.id))) {
    res.redirect("/profile")
  }
  res.render("propertyedit", {property: property})
})
router.post("/suggest", isLoggedIn, async (req, res)=>{
  let user = await userModel.findOne({username: req.session.passport.user})
  let suggestion = await suggestionModel.create({
    suggest: req.body.suggestion,
    owner: user._id
  })
  res.redirect("/profile")
})
router.post("/uploadProperty", isLoggedIn, upload.array("mediafile"), async (req, res)=>{
  const user = await userModel.findOne({username: req.session.passport.user})
  const uploads = [];
  for (const file of req.files) {
  uploads.push(uploadToCloudinary(file.path));
  }
const results = await Promise.all(uploads); // Wait for all uploads to finish
  let media = results.map(result => result.url);
  let newproperty = null
  if(req.body.type == "APARTMENT"){
    newproperty = await propertyModel.create({
      title: req.body.title,
      type: req.body.type,
      status: req.body.status,
      price: req.body.price,
      inclusions: {
          kitchen: req.body.kitchen,
          bathroom: req.body.bathroom,
          floors: req.body.floors,
          bedroom: req.body.bedroom
      },
      area: req.body.area,
      media: media,
      description: req.body.description,
      owner: user._id,
      address: req.body.address,
      city: req.body.city,
      state: req.body.state,
      pincode: req.body.pin,
      sold: "no",
      areaUnit: req.body.areaUnit
    })
  }
  else if(req.body.type == "PLOT/LAND"){
    newproperty = await propertyModel.create({
      title: req.body.title,
      type: req.body.type,
      status: req.body.status,
      price: req.body.price,
      area: req.body.area,
      media: media,
      description: req.body.description,
      owner: user._id,
      address: req.body.address,
      city: req.body.city,
      state: req.body.state,
      pincode: req.body.pin,
      sold: "no",
      areaUnit: req.body.areaUnit
    })
  }
  else{
    newproperty = await propertyModel.create({
      title: req.body.title,
      type: req.body.type,
      status: req.body.status,
      price: req.body.price,
      inclusions: {
          kitchen: req.body.kitchen,
          bathroom: req.body.bathroom,
          bedroom: req.body.bedroom
      },
      area: req.body.area,
      media: media,
      description: req.body.description,
      owner: user._id,
      address: req.body.address,
      city: req.body.city,
      state: req.body.state,
      pincode: req.body.pin,
      sold: "no",
      areaUnit: req.body.areaUnit
    })
  }   
  user.property.push(newproperty._id)
  await user.save()
  res.redirect("/profile")
})
router.post("/updateProperty", isLoggedIn, async (req, res)=>{
  let id = req.query.id
  let property = await propertyModel.findOne({_id: id})
  property.title = req.body.title
  property.status = req.body.status
  property.price = req.body.price
  property.area = req.body.area
  property.description = req.body.description
  property.address = req.body.address
  property.city = req.body.city
  property.state = req.body.state
  property.pincode = req.body.pin
  property.areaUnit = req.body.areaUnit
  if (property.type == "APARTMENT") {
    property.inclusions[0].kitchen = req.body.kitchen
    property.inclusions[0].bathroom = req.body.bathroom
    property.inclusions[0].floors = req.body.floors
    property.inclusions[0].bedroom = req.body.bedroom
  } else if(property.type == "FLAT") {
    property.inclusions[0].kitchen = req.body.kitchen
    property.inclusions[0].bathroom = req.body.bathroom
    property.inclusions[0].bedroom = req.body.bedroom
  }
  await property.save()
  res.redirect("/profile")
})
router.post("/contacted", isLoggedIn, async (req, res)=>{
  let propertyID = new mongoose.Types.ObjectId(req.body.id)
  let property = await propertyModel.findOne({_id: propertyID})
  let user = await userModel.findOne({username: req.session.passport.user})
  if (!(property.contacted.includes(user._id)) && !(property.owner == user._id)) {
    property.contacted.push(user._id)
    property.new = true
  }
  await property.save()
  res.status(200).json({ message: 'Request received' });
})
router.post("/sold", isLoggedIn, async(req, res)=>{
  let propertyID = new mongoose.Types.ObjectId(req.body.id)
  let property = await propertyModel.findOne({_id: propertyID})
  property.sold = "yes"
  await property.save()
  res.status(200).json({ message: 'Request received' });
})
router.get("/media", async (req, res)=>{
  let propertyId = new mongoose.Types.ObjectId(req.query.i)
  let property = await propertyModel.findOne({_id: propertyId})
  res.render("media", {property: property})
})
router.get("/news", async (req, res)=>{
  res.render("news")
})
router.get("/api/properties", async (req, res)=>{
  let limit = 10
  let type = req.query.type
  let search = req.query.search
  let sort = req.query.sort
  let sorted = {}
  let properties
  let user
  if (sort == 1) {
    sorted = {
      date: -1
    }
  }
  if (sort == 2) {
    sorted = {
      price: -1
    }
  }
  if (sort == 3) {
    sorted = {
      price: 1
    }
  }
  if(req.isAuthenticated()){
    user = await userModel.findOne({username: req.session.passport.user})
  }
  else{
    user = "no need"
  }
  if (search == undefined) {
    res.redirect("/")
  }
  if (type == "Flat/Apartment") {
    properties = await propertyModel.find({
      $and: [
        {
          $or: [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } }
          ]
        },
        { type: { $in: ["APARTMENT", "FLAT"] } }
      ]
    }).populate("owner").skip((req.query.page - 1)*limit).sort(sorted).limit(limit)
  }
  else if(type == "PERSON") {
    let regexp = new RegExp(search, "i")
    properties = await userModel.find({fullName: regexp}).populate("property").skip((req.query.page - 1)*limit).limit(limit)
  } else{
    properties = await propertyModel.find({
      $and: [
        {
          $or: [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } }
          ]
        },
        { type: { $in: "PLOT/LAND" } }
      ]
    }).populate("owner").skip((req.query.page - 1)*limit).sort(sorted).limit(limit)
  }
  const moreDataAvailable = properties.length === limit;
  res.json({properties, moreDataAvailable, user})
})
router.post("/liked",isLoggedIn, async (req, res)=>{
  try{
    let url = req.body.url
    let user = await userModel.findOne({username: req.session.passport.user})
  let id = new mongoose.Types.ObjectId(req.body.id)
  let alreadyadded = user.wishlist.find((ids)=> ids.toString() == id)
  req.session.location = req.body.hiddenlocation
  if (!alreadyadded) {
    user.wishlist.push(id)
  } else {
    let index = user.wishlist.indexOf(id)
    user.wishlist.splice(index, 1)
  }
  await user.save()
  res.redirect(url)
}catch(err){
  console.log(err)
}
})
router.get("/logout/:id", isLoggedIn, async (req, res, next)=>{
  const user = await userModel.findOne({username: req.session.passport.user})
  if(req.params.id == user._id){
    req.logout((err)=>{
      if (err){
        return next(err)
      }
      res.redirect('/')
    })
  }
  else{
    res.redirect("/home")
  }
})
module.exports = router;