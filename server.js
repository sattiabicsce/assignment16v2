const express = require("express");
const app = express();
const Joi = require("joi");
const multer = require("multer");
app.use(express.static("public"));
app.use(express.json());
const cors = require("cors");
app.use(cors());

const upload = multer({ dest: __dirname + "/public/images" });

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

let cars = [
  {
    _id: 1,
    make: "Toyota",
    model: "Camry",
    year: 2022,
    color: "Silver",
    carFeatures: ["Power Windows", "Air Conditioning", "Bluetooth"],
    img: "images/toyota-camry.jpg",
  },
  {
    _id: 2,
    make: "Ford",
    model: "Mustang",
    year: 2023,
    color: "Red",
    carFeatures: ["Convertible Top", "Leather Seats", "Backup Camera"],
    img: "images/ford-mustang.jpg",
  },
  {
    _id: 3,
    make: "Honda",
    model: "CR-V",
    year: 2021,
    color: "Blue",
    features: ["Sunroof", "Lane Departure Warning", "Apple CarPlay"],
    img: "images/honda-crv.jpg",
  },
  {
    _id: 4,
    make: "Chevrolet",
    model: "Silverado",
    year: 2022,
    color: "Black",
    features: ["Four-Wheel Drive", "Towing Package", "Touchscreen Infotainment"],
    img: "images/chevrolet-silverado.jpg",
  },
  {
    _id: 5,
    make: "Nissan",
    model: "Altima",
    year: 2023,
    color: "White",
    features: ["Keyless Entry", "Remote Start", "Blind Spot Monitoring"],
    img: "images/nissan-altima.jpg",
  },
  {
    _id: 6,
    make: "Tesla",
    model: "Model 3",
    year: 2021,
    color: "Midnight Silver Metallic",
    features: ["Autopilot", "Electric", "Panoramic Roof"],
    img: "images/tesla-model-3.jpg",
  }
];

app.get("/api/cars", (req, res) => {
  res.send(cars);
});

app.get("/api/cars/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const car = cars.find((c) => c._id === id);

  if (!car) {
    res.status(404).send("The car with the given id was not found.");
  }

  res.send(car);
});

app.post("/api/cars", upload.single("img"), (req, res) => {
  const result = validateCar(req.body);

  if (result.error) {
    res.status(400).send(result.error.details[0].message);
    return;
  }

  const car = {
    _id: cars.length + 1,
    make: req.body.make,
    model: req.body.model,
    year: parseInt(req.body.year),
    color: req.body.color,
    carFeatures: req.body.carFeatures.split(","),
  };

  if (req.file) {
    car.img = "images/" + req.file.filename;
  }

  cars.push(car);
  res.send(cars);
});

app.put("/api/cars/:id", upload.single("img"), (req, res) => {
  const id = parseInt(req.params.id);

  const car = cars.find((c) => c._id === id);

  const result = validateCar(req.body);

  if (result.error) {
    res.status(400).send(result.error.details[0].message);
    return;
  }

  car.make = req.body.make;
  car.model = req.body.model;
  car.year = parseInt(req.body.year);
  car.color = req.body.color;
  car.carFeatures = req.body.carFeatures.split(",");

  if (req.file) {
    car.img = "images/" + req.file.filename;
  }

  res.send(car);
});

app.delete("/api/cars/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const car = cars.find((c) => c._id === id);

  if (!car) {
    res.status(404).send("The car with the given id was not found.");
  }

  const index = cars.indexOf(car);
  cars.splice(index, 1);
  res.send(car);
});

const validateCar = (car) => {
  const schema = Joi.object({
    _id: Joi.allow(""),
    carFeatures: Joi.allow(""),
    make: Joi.string().min(2).required(),
    model: Joi.string().min(2).required(),
    year: Joi.number().integer().min(1886).max(new Date().getFullYear()).required(),
    color: Joi.string().min(2).required(),
  });

  return schema.validate(car);
};

app.listen(3000, () => {
  console.log("I'm listening");
});
