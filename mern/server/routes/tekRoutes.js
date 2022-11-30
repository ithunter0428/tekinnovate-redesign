// Importing modueDatels
const express = require("express");

// Importing models
const Tek = require("../models/TekModel");
// Importing utils
const validateTekPlayload = require("../validation/Validation");
const isEmpty = require("../utils/is-empty");

const router = express.Router();

// @route GET /Teks
// @desc  Returns a list of all Teks (title & id) regardless of
//        checkout status (i.e. both status and checked-out Teks should be included)
//        and can be filtered by status
router.get("/", (req, res) => {
  Tek.find()
    // .select("id title")
    .then((result) => {
      console.log(result);
      if (!result) {
        return res.status(403).json({ msg: "not found" });
      }
      res.json({ msg: "ok", result: result });
    });
});

// @route GET /Teks/:id
// @desc  Returns all details for the Tek matching id, 404 if not found
router.get("/:email", (req, res) => {
  Tek.findOne({ email_address: req.params.email }).then((result) => {
    if (!result) {
      return res.json({ msg: "not found" });
    }
    res.json({ msg: "ok", result: result });
  });
});

// @route POST /Teks
// @desc  Add a new Tek as described in request body (JSON),
//        which includes id & status
router.post("/", (req, res) => {
  if (!isEmpty(req.body.status)) {
    Tek.find({ status: req.body.status } /*, "id title"*/).then((result) => {
      if (!result) {
        return res.json({ msg: "not found" });
      }
      res.json({ msg: "ok", result: result });
    });
  } else {
    const { errors, isValid } = validateTekPlayload(req.body);
    if (!isValid) return res.json({ errors: errors, msg: "error" });
    Tek.findOne({$or : [{ name: req.body.name }, { email_address: req.body.email }, { phone: req.body.phone }]}).then((result) => {
      if (result) {
        if (result.name === req.body.name)
          return res.json({ msg: "Name: already exists", condition:'exist' });
        else if (result.email_address === req.body.email)
          return res.json({ msg: "Email: already exists", condition:'exist' });
        else if (result.phone === req.body.phone)
          return res.json({ msg: "Phone: already exists", condition:'exist' });
        return res.json({ msg: "already exists", condition:'exist' });
      }

      const newTek = new Tek({
        name: req.body.name,
        phone: req.body.phone,
        email_address: req.body.email,
        email_subject: req.body.subject,
        email_description: req.body.message,
      });

      newTek
        .save()
        .then((result) => res.status(201).json({ msg: "created", result: result }));
    });
  }
});
module.exports = router;
