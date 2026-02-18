import React, { useState, useEffect } from 'react'
import { useUserAuth } from '../../hooks/useUserAuth';
import { API_PATHS } from '../../utils/apiPath';
import axiosInstance from '../../utils/axiosInstance';
import toast from 'react-hot-toast';
import DashboardLayout from '../../components/layouts/DashboardLayout';
import ExpenseOverview from '../../components/Expense/ExpenseOverview';
import Modal from '../../components/Modal';
import AddExpenseForm from '../../components/Expense/AddExpenseForm';
import ExpenseList from '../../components/Expense/ExpenseList';
import DeleteAlert from '../../components/DeleteAlert';

const Expense = () => {
    useUserAuth();

    const [expenseData, setExpenseData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openDeleteAlert, setOpenDeleteAlert] = useState({
        show: false,
        data: null
    });
    const [openAddExpenseModal, setOpenAddExpenseModal] = useState(false);

    //Get All Expense Details
    const fetchExpenseDetails = async () => {
        if (loading) return;

        setLoading(true);

        try {

            const response = await axiosInstance.get(`${API_PATHS.EXPENSE.GET_ALL_EXPENSES}`)

            if (response.data) {
                setExpenseData(response.data);
            }
        } catch (error) {
            console.error("Something went Wrong, Please try again:", error);
        } finally {
            setLoading(false);
        }
    };

    //Add Expense
    const handleAddExpense = async (expense) => {
        const { category, amount, date, icon } = expense;

        //validation check
        if (!category.trim()) {
            toast.error("category is Required");
            return;
        }
        if (!amount || isNaN(amount) || Number(amount) <= 0) {
            toast.error("Amount should be valid Number greator than 0 )");
            return;
        }
        if (!date) {
            toast.error("Date is Required");
            return;
        }
        try {
            await axiosInstance.post(API_PATHS.EXPENSE.ADD_EXPENSE, {
                category,
                amount,
                date,
                icon
            })
            setOpenAddExpenseModal(false);
            toast.success("Expense Added Successfully");
            fetchExpenseDetails();
        } catch (error) {
            console.error("Error Adding expense", error?.response?.data.message || error.message);
        }
    };
    //Delete Expense
    const deleteExpense = async (id) => {
        try {
            await axiosInstance.delete(API_PATHS.EXPENSE.DELETE_EXPENSE(id));

            setOpenDeleteAlert({ show: false, data: null });
            toast.success("Expense Deleted Successfully!");
            fetchExpenseDetails();
        } catch (error) {
            console.error("Error deleting Expense", error?.response?.data?.message || error.message)
        }
    };

    //handle download Expense details
    const handleDownloadExpenseDetails = async () => {
        try {
            const response = await axiosInstance.get(
                API_PATHS.EXPENSE.DOWNLOAD_EXPENSE_EXCEL,
                {
                    responseType: "blob"
                }
            );
            //create URl for the blob
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "expense_details.xlsx");
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error downloading expense Details:", error);
            toast.error("Failed to Download expense Details. Please try Again");
        }
    };

    useEffect(() => {
        fetchExpenseDetails();
        return () => { }
    }, [])


    return (
        <DashboardLayout activeMenu="Expense" >
            <div className='my-5 mx-auto'>
                <div className='grid grid-cols-1 gap-6'>
                    <div className=''>
                        <ExpenseOverview
                            transactions={expenseData}
                            onExpenseIncome={() => setOpenAddExpenseModal(true)}
                        />
                    </div>
                    <ExpenseList
                        transactions={expenseData}
                        onDelete={(id) => {
                            setOpenDeleteAlert({ show: true, data: id })
                        }}
                        onDownload={handleDownloadExpenseDetails}
                    />
                </div>
                <Modal
                    isOpen={openAddExpenseModal}
                    onClose={() => setOpenAddExpenseModal(false)}
                    title="Add Expense"
                >
                    <AddExpenseForm onAddExpense={handleAddExpense} />
                </Modal>
                <Modal
                    isOpen={openDeleteAlert.show}
                    onClose={() => setOpenDeleteAlert({ show: false, data: null })}
                    title="Delete Expense"
                >
                    <DeleteAlert
                        content="Are you sure you want to delete this expense details"
                        onDelete={() => deleteExpense(openDeleteAlert.data)}
                    />

                </Modal>
            </div>
        </DashboardLayout>
    )
}

export default Expense