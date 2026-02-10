const xlsx = require("xlsx");
const Expense = require("../models/Expense");


//Add Expense Source 
exports.addExpense = async (req, res) => {
    const userId = req.user.id;
    try {
        const { icon, category, amount, date } = req.body;

        //Validation check for missing fields 
        if (!category || !amount || !date) {
            return res.status(400).json({ message: "Category, Amount, and Date are required" });
        }

        const newExpense = new Expense({
            userId,
            icon,
            category,
            amount,
            date: new Date(date),
        });
        await newExpense.save();
        res.status(201).json(newExpense);
    } catch (error) {
        res.status(500).json({ message: "Error Adding Expense", error: error.message });
    }
}

//Get All Expense Source 
exports.getAllExpense = async (req, res) => {
    const userId = req.user.id;
    try {
        const expense = await Expense.find({ userId }).sort({ date: -1 });
        res.json(expense);
    }
    catch (error) {
        res.status(500).json({ message: "Error Fetching Expense", error: error.message });
    }

}

//Delete Expense Source 
exports.deleteExpense = async (req, res) => {
    try {
        await Expense.findByIdAndDelete(req.params.id);
        res.json({ message: "Expense deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Error Deleting Expense", error: error.message });
    }
}

//Download Expense Source 
exports.downloadExpenseExcel = async (req, res) => {
    const userId = req.user.id;
    try {
        const expense = await Expense.find({ userId }).sort({ date: -1 });

        //prepare data for excel
        const data = expense.map((item) => ({
            Category: item.category,
            Amount: item.amount,
            // Date: item.date, // Format date as YYYY-MM-DD
            Date: item.date.toISOString().split('T')[0], // Format date as YYYY-MM-DD
        }));

        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(data);
        xlsx.utils.book_append_sheet(wb, ws, "ExpenseData");
        xlsx.writeFile(wb, "expense_details.xlsx");
        res.download("expense_details.xlsx");
    }
    catch (error) {
        res.status(500).json({ message: "Error Fetching Expense", error: error.message });
    }

}