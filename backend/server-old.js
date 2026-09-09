const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Medical Era backend is running" });
});app.post("/api/patient", (req, res) => {
  const { complaint, answers } = req.body;

  console.log("Patient complaint:", complaint);
  console.log("Patient answers:", answers);

  res.json({
    message: "Patient data received successfully",
    complaint,
    answers,
  });
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Medical Era backend running on http://localhost:${PORT}`);
});