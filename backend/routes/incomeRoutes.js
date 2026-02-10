const express = require('express');

const { addIncome, getAllIncome, deleteIncome, downIncomeExcel } = require("../controllers/incomeController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/add", protect, addIncome);
router.get("/get", protect, getAllIncome);
router.get("/downloadexcel", protect, downIncomeExcel);
router.delete("/:id", protect, deleteIncome);