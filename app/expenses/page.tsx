"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DollarSign,
  PieChart,
  Activity,
  Info,
  Settings,
  Plus,
  FileText,
  Tag,
  X,
  AlertCircle,
  Download,
} from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function ExpensesPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("expenses")
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false)
  const [groupData, setGroupData] = useState(null)
  const [expenses, setExpenses] = useState([])
  const [balances, setBalances] = useState([])
  const [currencySymbol, setCurrencySymbol] = useState("₹")
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false)
  const exportContentRef = useRef(null)

  const [newExpense, setNewExpense] = useState({
    title: "",
    category: "Food",
    date: new Date().toISOString().split("T")[0],
    amount: "",
    paidBy: "",
    note: "",
  })

  const [selectedParticipants, setSelectedParticipants] = useState({})

  // Load group data from localStorage on component mount
  useEffect(() => {
    const storedGroupData = localStorage.getItem("paytogetherGroupData")

    if (storedGroupData) {
      const parsedData = JSON.parse(storedGroupData)
      setGroupData(parsedData)

      // Initialize selected participants based on group data
      const participantsObj = {}
      parsedData.participants.forEach((p) => {
        participantsObj[p.name] = true
      })
      setSelectedParticipants(participantsObj)

      // Set default paidBy to active user
      setNewExpense((prev) => ({
        ...prev,
        paidBy: parsedData.activeUser,
      }))

      // Set currency symbol based on currency
      setCurrencySymbolFromCurrency(parsedData.currency)
    } else {
      // If no group data exists, redirect to create group page
      router.push("/create-group")
    }

    // Load expenses from localStorage
    const storedExpenses = localStorage.getItem("paytogetherExpenses")
    if (storedExpenses) {
      setExpenses(JSON.parse(storedExpenses))
    }
  }, [router])

  // Calculate balances whenever expenses change
  useEffect(() => {
    if (groupData && expenses.length > 0) {
      calculateBalances()
    }
  }, [expenses, groupData])

  const setCurrencySymbolFromCurrency = (currency) => {
    switch (currency) {
      case "INR":
        setCurrencySymbol("₹")
        break
      case "USD":
        setCurrencySymbol("$")
        break
      case "EUR":
        setCurrencySymbol("€")
        break
      case "GBP":
        setCurrencySymbol("£")
        break
      case "JPY":
        setCurrencySymbol("¥")
        break
      default:
        setCurrencySymbol("₹")
    }
  }

  const handleExpenseChange = (field, value) => {
    setNewExpense({ ...newExpense, [field]: value })
  }

  const handleParticipantToggle = (name) => {
    setSelectedParticipants({
      ...selectedParticipants,
      [name]: !selectedParticipants[name],
    })
  }

  const calculateBalances = () => {
    if (!groupData) return

    // Initialize balances for each participant
    const balanceMap = {}
    groupData.participants.forEach((p) => {
      balanceMap[p.name] = { name: p.name, paid: 0, owes: 0, balance: 0 }
    })

    // Calculate paid amounts and owed amounts
    expenses.forEach((expense) => {
      // Skip invalid expenses
      if (!expense.paidBy || !expense.paidFor || expense.paidFor.length === 0 || !expense.amount) {
        return
      }

      // Add to paid amount for the person who paid
      if (balanceMap[expense.paidBy]) {
        balanceMap[expense.paidBy].paid += Number.parseFloat(expense.amount)
      }

      // Calculate how much each person owes for this expense
      const splitAmount = Number.parseFloat(expense.amount) / expense.paidFor.length

      expense.paidFor.forEach((person) => {
        if (balanceMap[person]) {
          balanceMap[person].owes += splitAmount
        }
      })
    })

    // Calculate final balance for each person
    Object.keys(balanceMap).forEach((person) => {
      balanceMap[person].balance = Number((balanceMap[person].paid - balanceMap[person].owes).toFixed(2))
    })

    // Convert to array
    const balanceArray = Object.values(balanceMap)
    setBalances(balanceArray)
  }

  const handleAddExpense = () => {
    // Get selected participants
    const paidFor = Object.keys(selectedParticipants).filter((name) => selectedParticipants[name])

    // Validate that at least one person is selected
    if (paidFor.length === 0) {
      alert("Please select at least one person who shared this expense.")
      return
    }

    // Create new expense object
    const expense = {
      id: Date.now(),
      ...newExpense,
      amount: Number(Number.parseFloat(newExpense.amount).toFixed(2)),
      paidFor,
    }

    // Add to expenses array
    const updatedExpenses = [...expenses, expense]
    setExpenses(updatedExpenses)

    // Save to localStorage
    localStorage.setItem("paytogetherExpenses", JSON.stringify(updatedExpenses))

    // Calculate balances immediately
    calculateBalances()

    // Reset form and close dialog
    setNewExpense({
      title: "",
      category: "Food",
      date: new Date().toISOString().split("T")[0],
      amount: "",
      paidBy: groupData?.activeUser || "",
      note: "",
    })
    setIsAddExpenseOpen(false)
  }

  const handleRemoveMember = (memberName) => {
    if (!groupData) return

    // Check if member has any expenses
    const memberHasExpenses = expenses.some(
      (expense) => expense.paidBy === memberName || expense.paidFor.includes(memberName),
    )

    if (memberHasExpenses) {
      alert(`Cannot remove ${memberName} as they have associated expenses.`)
      return
    }

    // Remove member from group data
    const updatedParticipants = groupData.participants.filter((p) => p.name !== memberName)

    // Update group data
    const updatedGroupData = {
      ...groupData,
      participants: updatedParticipants,
    }

    // Update state and localStorage
    setGroupData(updatedGroupData)
    localStorage.setItem("paytogetherGroupData", JSON.stringify(updatedGroupData))

    // Update selected participants
    const updatedSelectedParticipants = { ...selectedParticipants }
    delete updatedSelectedParticipants[memberName]
    setSelectedParticipants(updatedSelectedParticipants)

    // Recalculate balances
    calculateBalances()
  }

  const generateExportContent = () => {
    if (!groupData || !expenses.length) return ""

    const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0)
    const date = new Date().toLocaleDateString()

    const content = `
      ===== PAYTOGETHER EXPENSE SUMMARY =====
      
      Date: ${date}
      Group Name: ${groupData.groupName}
      Currency: ${groupData.currency}
      
      ----- EXPENSES -----
      ${expenses
        .map(
          (expense) =>
            `${new Date(expense.date).toLocaleDateString()} - ${expense.title} - ${currencySymbol}${expense.amount.toFixed(2)} (Paid by: ${expense.paidBy})`,
        )
        .join("\n")}
      
      ----- MEMBER SUMMARY -----
      ${balances
        .map(
          (balance) =>
            `${balance.name}: Paid ${currencySymbol}${balance.paid.toFixed(2)}, Give ${currencySymbol}${balance.owes.toFixed(2)}, Balance: ${balance.balance >= 0 ? "+" : ""}${currencySymbol}${balance.balance.toFixed(2)}`,
        )
        .join("\n")}
      
      Total Amount: ${currencySymbol}${totalAmount.toFixed(2)}
      
      Generated on: ${date}
      PayTogether - Split Expenses Effortlessly
    `

    return content
  }

  const handleExport = () => {
    setIsExportDialogOpen(true)
  }

  const handlePrintExport = () => {
    const content = exportContentRef.current
    if (!content) return

    const printWindow = window.open("", "_blank")
    printWindow.document.write(`
      <html>
        <head>
          <title>PayTogether - Expense Summary</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; max-width: 800px; margin: 0 auto; }
            h1 { color: #2563eb; text-align: center; margin-bottom: 5px; }
            h2 { text-align: center; margin-top: 0; color: #4b5563; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #e5e7eb; padding-bottom: 20px; }
            .section { margin-top: 25px; border-top: 1px solid #ddd; padding-top: 15px; }
            .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #6b7280; border-top: 1px solid #e5e7eb; padding-top: 15px; }
            table { width: 100%; border-collapse: collapse; margin: 15px 0; }
            th, td { padding: 10px; text-align: left; border-bottom: 1px solid #e5e7eb; }
            th { background-color: #f1f5f9; font-weight: 600; color: #4b5563; }
            .amount { text-align: right; }
            .positive { color: #2563eb; font-weight: 600; }
            .negative { color: #dc2626; font-weight: 600; }
            .summary-box { background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 5px; padding: 15px; margin-top: 20px; }
            .summary-title { font-weight: 600; margin-bottom: 10px; color: #4b5563; }
            .summary-row { display: flex; justify-content: space-between; margin-bottom: 5px; }
            .summary-total { font-weight: 700; border-top: 1px solid #e5e7eb; padding-top: 5px; margin-top: 5px; }
            .bill-number { font-size: 14px; color: #6b7280; margin-top: 5px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>PayTogether</h1>
            <h2>Expense Summary</h2>
            <p class="bill-number">Bill #PT-${Date.now().toString().substring(5)}</p>
            <p>Date: ${new Date().toLocaleDateString()}</p>
            <p>Group: ${groupData.groupName}</p>
          </div>
          
          <div class="section">
            <h3>Expense Details</h3>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Paid By</th>
                  <th class="amount">Amount</th>
                </tr>
              </thead>
              <tbody>
                ${expenses
                  .map(
                    (expense) => `
                  <tr>
                    <td>${new Date(expense.date).toLocaleDateString()}</td>
                    <td>${expense.title}</td>
                    <td>${expense.category}</td>
                    <td>${expense.paidBy}</td>
                    <td class="amount">${currencySymbol}${expense.amount.toFixed(2)}</td>
                  </tr>
                `,
                  )
                  .join("")}
                <tr>
                  <td colspan="4" style="text-align: right; font-weight: 600;">Total</td>
                  <td class="amount" style="font-weight: 700;">${currencySymbol}${expenses.reduce((sum, expense) => sum + expense.amount, 0).toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div class="section">
            <h3>Member Summary</h3>
            <table>
              <thead>
                <tr>
                  <th>Member</th>
                  <th class="amount">Paid</th>
                  <th class="amount">Contribution</th>
                  <th class="amount">Balance</th>
                </tr>
              </thead>
              <tbody>
                ${balances
                  .map(
                    (balance) => `
                  <tr>
                    <td>${balance.name}</td>
                    <td class="amount">${currencySymbol}${balance.paid.toFixed(2)}</td>
                  <td class="amount">${currencySymbol}${balance.owes.toFixed(2)}</td>
                  <td class="amount ${balance.balance >= 0 ? "positive" : "negative"}">
                    ${balance.balance >= 0 ? "+" : ""}${currencySymbol}${balance.balance.toFixed(2)}
                  </td>
                </tr>
              `,
                  )
                  .join("")}
            </tbody>
          </table>
        </div>
        
        <div class="summary-box">
          <div class="summary-title">Payment Summary</div>
          ${balances
            .filter((b) => b.balance < 0)
            .map((debtor) => {
              return balances
                .filter((b) => b.balance > 0)
                .map((creditor) => {
                  const amountToSettle = Math.min(Math.abs(debtor.balance), creditor.balance)
                  if (amountToSettle > 0) {
                    return `
                  <div class="summary-row">
                    <span>${debtor.name} should give to ${creditor.name}:</span>
                    <span>${currencySymbol}${amountToSettle.toFixed(2)}</span>
                  </div>
                `
                  }
                  return ""
                })
                .join("")
            })
            .join("")}
          ${
            balances.filter((b) => b.balance < 0).length === 0
              ? '<div class="summary-row">Everyone is settled up! No payments needed.</div>'
              : ""
          }
          <div class="summary-row summary-total">
            <span>Total Group Expenses:</span>
            <span>${currencySymbol}${expenses.reduce((sum, expense) => sum + expense.amount, 0).toFixed(2)}</span>
          </div>
        </div>
        
        <div class="footer">
          <p>PayTogether - Split Expenses Effortlessly</p>
          <p>Generated on: ${new Date().toLocaleString()}</p>
        </div>
      </body>
    </html>
  `)
    printWindow.document.close()
    printWindow.print()
    setIsExportDialogOpen(false)
  }

  // If group data is not loaded yet, show loading state
  if (!groupData) {
    return (
      <div className="py-8 bg-gray-50 min-h-screen flex items-center justify-center">
        <p>Loading group data...</p>
      </div>
    )
  }

  return (
    <div className="py-8 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">{groupData.groupName}</h1>
          <p className="text-gray-600">Manage your shared expenses</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-3 md:grid-cols-6 gap-2">
            <TabsTrigger value="expenses" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              <span className="hidden md:inline">Expenses</span>
            </TabsTrigger>
            <TabsTrigger value="balance" className="flex items-center gap-2">
              <PieChart className="h-4 w-4" />
              <span className="hidden md:inline">Balance</span>
            </TabsTrigger>
            <TabsTrigger value="info" className="flex items-center gap-2">
              <Info className="h-4 w-4" />
              <span className="hidden md:inline">Information</span>
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center gap-2">
              <PieChart className="h-4 w-4" />
              <span className="hidden md:inline">Stats</span>
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              <span className="hidden md:inline">Activity</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden md:inline">Settings</span>
            </TabsTrigger>
          </TabsList>

          {/* Expenses Tab */}
          <TabsContent value="expenses">
            <Card className="border-none shadow-md">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Expenses</CardTitle>
                  <CardDescription>Manage and track all your group expenses</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleExport} variant="outline" className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    <span className="hidden sm:inline">Export</span>
                  </Button>
                  <Dialog open={isAddExpenseOpen} onOpenChange={setIsAddExpenseOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Expense
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[550px] max-h-[90vh]">
                      <DialogHeader>
                        <DialogTitle>Add New Expense</DialogTitle>
                        <DialogDescription>Enter the details of the expense to add it to your group.</DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4 overflow-y-auto max-h-[60vh] pr-2">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="title">Expense Title</Label>
                            <Input
                              id="title"
                              value={newExpense.title}
                              onChange={(e) => handleExpenseChange("title", e.target.value)}
                              placeholder="e.g., Grocery Shopping"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <Select
                              value={newExpense.category}
                              onValueChange={(value) => handleExpenseChange("category", value)}
                            >
                              <SelectTrigger id="category">
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Food">Food</SelectItem>
                                <SelectItem value="Housing">Housing</SelectItem>
                                <SelectItem value="Transportation">Transportation</SelectItem>
                                <SelectItem value="Entertainment">Entertainment</SelectItem>
                                <SelectItem value="Utilities">Utilities</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="date">Date</Label>
                            <Input
                              id="date"
                              type="date"
                              value={newExpense.date}
                              onChange={(e) => handleExpenseChange("date", e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="amount">Amount</Label>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                {currencySymbol}
                              </span>
                              <Input
                                id="amount"
                                type="number"
                                step="0.01"
                                className="pl-8"
                                value={newExpense.amount}
                                onChange={(e) => handleExpenseChange("amount", e.target.value)}
                                placeholder="0.00"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="paidBy">Paid by</Label>
                          <Select
                            value={newExpense.paidBy}
                            onValueChange={(value) => handleExpenseChange("paidBy", value)}
                          >
                            <SelectTrigger id="paidBy">
                              <SelectValue placeholder="Select who paid" />
                            </SelectTrigger>
                            <SelectContent>
                              {groupData.participants.map((p) => (
                                <SelectItem key={p.id} value={p.name}>
                                  {p.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Paid for</Label>
                          <div className="space-y-2 border rounded-md p-3">
                            {groupData.participants.map((p) => (
                              <div key={p.id} className="flex items-center space-x-2">
                                <input
                                  type="checkbox"
                                  id={`participant-${p.name}`}
                                  checked={selectedParticipants[p.name] || false}
                                  onChange={() => handleParticipantToggle(p.name)}
                                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <Label htmlFor={`participant-${p.name}`} className="text-sm font-normal">
                                  {p.name}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="note">Note (Optional)</Label>
                          <Textarea
                            id="note"
                            value={newExpense.note}
                            onChange={(e) => handleExpenseChange("note", e.target.value)}
                            placeholder="Add any additional details..."
                            rows={3}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Attachments (Optional)</Label>
                          <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md p-6">
                            <div className="space-y-1 text-center">
                              <FileText className="mx-auto h-12 w-12 text-gray-400" />
                              <div className="text-sm text-gray-600">
                                <label
                                  htmlFor="file-upload"
                                  className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500"
                                >
                                  <span>Upload a file</span>
                                  <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                              </div>
                              <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
                            </div>
                          </div>
                        </div>

                        {/* Real-time split preview */}
                        {newExpense.amount && Number.parseFloat(newExpense.amount) > 0 && (
                          <div className="space-y-2 mt-2">
                            <Label>Split Preview</Label>
                            <div className="border rounded-md p-3 bg-gray-50">
                              <p className="text-sm text-gray-600 mb-2">Each selected person will contribute:</p>
                              <p className="text-lg font-semibold text-blue-600">
                                {currencySymbol}
                                {Object.values(selectedParticipants).filter(Boolean).length > 0
                                  ? (
                                      Number.parseFloat(newExpense.amount) /
                                      Object.values(selectedParticipants).filter(Boolean).length
                                    ).toFixed(2)
                                  : "0.00"}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddExpenseOpen(false)}>
                          Cancel
                        </Button>
                        <Button
                          onClick={handleAddExpense}
                          className="bg-blue-600 hover:bg-blue-700"
                          disabled={
                            !newExpense.title ||
                            !newExpense.amount ||
                            !newExpense.paidBy ||
                            Object.values(selectedParticipants).filter(Boolean).length === 0
                          }
                        >
                          Add Expense
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {expenses.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Title</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Paid By</TableHead>
                          <TableHead>Paid For</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {expenses
                          .sort((a, b) => new Date(b.date) - new Date(a.date))
                          .map((expense) => (
                            <TableRow key={expense.id}>
                              <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
                              <TableCell>{expense.title}</TableCell>
                              <TableCell>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                  {expense.category}
                                </span>
                              </TableCell>
                              <TableCell>
                                {currencySymbol}
                                {expense.amount.toFixed(2)}
                              </TableCell>
                              <TableCell>{expense.paidBy}</TableCell>
                              <TableCell>
                                {expense.paidFor.length > 2
                                  ? `${expense.paidFor[0]} and ${expense.paidFor.length - 1} others`
                                  : expense.paidFor.join(", ")}
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Alert variant="default" className="max-w-md mx-auto">
                      <AlertCircle className="h-5 w-5 text-gray-400" />
                      <AlertTitle>No expenses yet</AlertTitle>
                      <AlertDescription>
                        Click the "Add Expense" button to start tracking your shared expenses. Your group is ready!
                      </AlertDescription>
                    </Alert>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Balance Tab */}
          <TabsContent value="balance">
            <Card className="border-none shadow-md">
              <CardHeader>
                <CardTitle>Balance</CardTitle>
                <CardDescription>See who owes what and settle up</CardDescription>
              </CardHeader>
              <CardContent>
                {balances.length > 0 ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {balances.map((balance) => (
                        <Card key={balance.name} className="border shadow-sm">
                          <CardContent className="pt-6">
                            <div className="text-center">
                              <h3 className="text-lg font-semibold mb-2">{balance.name}</h3>
                              <div className="flex justify-center space-x-4 mb-4">
                                <div className="text-center">
                                  <p className="text-sm text-gray-500">Paid</p>
                                  <p className="text-lg font-medium text-blue-600">
                                    {currencySymbol}
                                    {balance.paid.toFixed(2)}
                                  </p>
                                </div>
                                <div className="text-center">
                                  <p className="text-sm text-gray-500">Give</p>
                                  <p className="text-lg font-medium text-red-600">
                                    {currencySymbol}
                                    {balance.owes.toFixed(2)}
                                  </p>
                                </div>
                              </div>
                              <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-blue-500"
                                  style={{
                                    width: `${Math.max((balance.paid / (balance.paid + balance.owes || 1)) * 100, 0)}%`,
                                  }}
                                ></div>
                              </div>
                              <p
                                className={`mt-2 font-medium ${
                                  balance.balance >= 0 ? "text-blue-600" : "text-red-600"
                                }`}
                              >
                                {balance.balance >= 0
                                  ? `Take back ${currencySymbol}${balance.balance.toFixed(2)}`
                                  : `Give ${currencySymbol}${Math.abs(balance.balance).toFixed(2)}`}
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {/* Settle Up Section - Dynamically generated based on balances */}
                    <div className="mt-8">
                      <h3 className="text-xl font-semibold mb-4">Settle Up</h3>
                      <div className="space-y-4">
                        {balances
                          .filter((b) => b.balance < 0)
                          .map((debtor) => {
                            const creditors = balances.filter((b) => b.balance > 0)
                            return creditors
                              .map((creditor) => {
                                const amountToSettle = Math.min(Math.abs(debtor.balance), creditor.balance)
                                if (amountToSettle > 0) {
                                  return (
                                    <div
                                      key={`${debtor.name}-${creditor.name}`}
                                      className="p-4 bg-gray-50 rounded-md border border-gray-200"
                                    >
                                      <p className="font-medium">
                                        {debtor.name} should give {creditor.name} {currencySymbol}
                                        {amountToSettle.toFixed(2)}
                                      </p>
                                    </div>
                                  )
                                }
                                return null
                              })
                              .filter(Boolean)
                          })}

                        {balances.filter((b) => b.balance < 0).length === 0 && (
                          <Alert variant="default">
                            <AlertCircle className="h-5 w-5 text-blue-500" />
                            <AlertTitle>All settled up!</AlertTitle>
                            <AlertDescription>Everyone is currently settled up. No payments needed.</AlertDescription>
                          </Alert>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Alert variant="default" className="max-w-md mx-auto">
                      <AlertCircle className="h-5 w-5 text-gray-400" />
                      <AlertTitle>No balance information yet</AlertTitle>
                      <AlertDescription>Add some expenses to see balance information.</AlertDescription>
                    </Alert>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Information Tab */}
          <TabsContent value="info">
            <Card className="border-none shadow-md">
              <CardHeader>
                <CardTitle>Group Information</CardTitle>
                <CardDescription>Details about your expense sharing group</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Group Details</h3>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-500">Group Name</p>
                          <p className="font-medium">{groupData.groupName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Created On</p>
                          <p className="font-medium">
                            {new Date(groupData.createdAt || Date.now()).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Currency</p>
                          <p className="font-medium">
                            {groupData.currency === "INR"
                              ? "INR (₹)"
                              : groupData.currency === "USD"
                                ? "USD ($)"
                                : groupData.currency === "EUR"
                                  ? "EUR (€)"
                                  : groupData.currency === "GBP"
                                    ? "GBP (£)"
                                    : groupData.currency === "JPY"
                                      ? "JPY (¥)"
                                      : "INR (₹)"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Description</p>
                          <p className="font-medium">{groupData.groupDetails || "No description provided"}</p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Members</h3>
                      <div className="space-y-3">
                        {groupData.participants.map((participant, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div
                                className={`h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium mr-3`}
                              >
                                {participant.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </div>
                              <div>
                                <p className="font-medium">{participant.name}</p>
                                <p className="text-sm text-gray-500">
                                  {participant.name.toLowerCase().replace(" ", ".") + "@example.com"}
                                </p>
                              </div>
                            </div>
                            {participant.name === groupData.activeUser && (
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">You</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Summary</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                      <Card className="border shadow-sm">
                        <CardContent className="pt-6">
                          <div className="text-center">
                            <h4 className="text-sm text-gray-500 mb-1">Total Expenses</h4>
                            <p className="text-2xl font-bold">
                              {currencySymbol}
                              {expenses.reduce((sum, expense) => sum + expense.amount, 0).toFixed(2)}
                            </p>
                          </div>
                        </CardContent>
                      </Card>

                      {/* User-specific data for the active user */}
                      {balances.find((b) => b.name === groupData.activeUser) && (
                        <>
                          <Card className="border shadow-sm">
                            <CardContent className="pt-6">
                              <div className="text-center">
                                <h4 className="text-sm text-gray-500 mb-1">Your Contribution</h4>
                                <p className="text-2xl font-bold">
                                  {currencySymbol}
                                  {balances.find((b) => b.name === groupData.activeUser).owes.toFixed(2)}
                                </p>
                              </div>
                            </CardContent>
                          </Card>
                          <Card className="border shadow-sm">
                            <CardContent className="pt-6">
                              <div className="text-center">
                                <h4 className="text-sm text-gray-500 mb-1">You Paid</h4>
                                <p className="text-2xl font-bold text-blue-600">
                                  {currencySymbol}
                                  {balances.find((b) => b.name === groupData.activeUser).paid.toFixed(2)}
                                </p>
                              </div>
                            </CardContent>
                          </Card>
                          <Card className="border shadow-sm">
                            <CardContent className="pt-6">
                              <div className="text-center">
                                <h4 className="text-sm text-gray-500 mb-1">Your Balance</h4>
                                <p
                                  className={`text-2xl font-bold ${
                                    balances.find((b) => b.name === groupData.activeUser).balance >= 0
                                      ? "text-blue-600"
                                      : "text-red-600"
                                  }`}
                                >
                                  {balances.find((b) => b.name === groupData.activeUser).balance >= 0 ? "+" : ""}
                                  {currencySymbol}
                                  {balances.find((b) => b.name === groupData.activeUser).balance.toFixed(2)}
                                </p>
                              </div>
                            </CardContent>
                          </Card>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Stats Tab - Simplified to only show Spending by Member */}
          <TabsContent value="stats">
            <Card className="border-none shadow-md">
              <CardHeader>
                <CardTitle>Statistics</CardTitle>
                <CardDescription>View your group's spending patterns</CardDescription>
              </CardHeader>
              <CardContent>
                {expenses.length > 0 ? (
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Spending by Member</h3>
                      <div className="space-y-4">
                        {/* Dynamically generate member spending breakdown */}
                        {balances.map((balance, index) => {
                          const total = expenses.reduce((sum, e) => sum + e.amount, 0)
                          const percentage = total > 0 ? Math.round((balance.paid / total) * 100) : 0

                          return (
                            <div key={balance.name}>
                              <div className="flex items-center justify-between mb-1">
                                <span>{balance.name}</span>
                                <span>
                                  {currencySymbol}
                                  {balance.paid.toFixed(2)} ({percentage}%)
                                </span>
                              </div>
                              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500" style={{ width: `${percentage}%` }}></div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Alert variant="default" className="max-w-md mx-auto">
                      <AlertCircle className="h-5 w-5 text-gray-400" />
                      <AlertTitle>No statistics available</AlertTitle>
                      <AlertDescription>Add some expenses to see spending statistics.</AlertDescription>
                    </Alert>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity">
            <Card className="border-none shadow-md">
              <CardHeader>
                <CardTitle>Activity</CardTitle>
                <CardDescription>Recent activity in your group</CardDescription>
              </CardHeader>
              <CardContent>
                {expenses.length > 0 ? (
                  <div className="space-y-6">
                    <div className="relative">
                      <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                      <div className="space-y-6">
                        {/* Generate activity items from actual expenses */}
                        {expenses
                          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                          .map((expense, index) => (
                            <div key={expense.id} className="relative pl-10">
                              <div className="absolute left-0 top-1 h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center">
                                <DollarSign className="h-3 w-3 text-blue-600" />
                              </div>
                              <div className="bg-white p-4 rounded-md border border-gray-200">
                                <div className="flex items-center justify-between mb-1">
                                  <h4 className="font-medium">New Expense Added</h4>
                                  <span className="text-xs text-gray-500">
                                    {new Date(expense.date).toLocaleDateString()}
                                  </span>
                                </div>
                                <p className="text-gray-600">
                                  {expense.paidBy} added "{expense.title}" expense for {currencySymbol}
                                  {expense.amount.toFixed(2)}
                                </p>
                              </div>
                            </div>
                          ))}

                        {/* Group creation activity */}
                        <div className="relative pl-10">
                          <div className="absolute left-0 top-1 h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                            <Info className="h-3 w-3 text-green-600" />
                          </div>
                          <div className="bg-white p-4 rounded-md border border-gray-200">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-medium">Group Created</h4>
                              <span className="text-xs text-gray-500">
                                {new Date(groupData.createdAt || Date.now()).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-gray-600">
                              {groupData.activeUser} created the "{groupData.groupName}" group
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Alert variant="default" className="max-w-md mx-auto">
                      <AlertCircle className="h-5 w-5 text-gray-400" />
                      <AlertTitle>No activity yet</AlertTitle>
                      <AlertDescription>Group activities will appear here as you add expenses.</AlertDescription>
                    </Alert>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card className="border-none shadow-md">
              <CardHeader>
                <CardTitle>Group Settings</CardTitle>
                <CardDescription>Manage your group preferences and settings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Group Details</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="groupName">Group Name</Label>
                        <Input id="groupName" defaultValue={groupData.groupName} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="groupCurrency">Currency</Label>
                        <Select defaultValue={groupData.currency}>
                          <SelectTrigger id="groupCurrency">
                            <SelectValue placeholder="Select currency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="INR">INR (₹)</SelectItem>
                            <SelectItem value="USD">USD ($)</SelectItem>
                            <SelectItem value="EUR">EUR (€)</SelectItem>
                            <SelectItem value="GBP">GBP (£)</SelectItem>
                            <SelectItem value="JPY">JPY (¥)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="groupDescription">Description</Label>
                        <Textarea id="groupDescription" defaultValue={groupData.groupDetails} rows={3} />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Members</h3>
                    <div className="space-y-4">
                      {groupData.participants.map((participant, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium mr-3">
                              {participant.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </div>
                            <div>
                              <p className="font-medium">{participant.name}</p>
                              <p className="text-sm text-gray-500">
                                {participant.name.toLowerCase().replace(" ", ".") + "@example.com"}
                              </p>
                            </div>
                          </div>
                          {participant.name === groupData.activeUser ? (
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Admin</span>
                          ) : (
                            <Button variant="outline" size="sm" onClick={() => handleRemoveMember(participant.name)}>
                              Remove
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button className="mt-2" variant="outline">
                        <Plus className="mr-2 h-4 w-4" />
                        Invite New Member
                      </Button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Categories</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Tag className="h-4 w-4 text-blue-500 mr-2" />
                          <span>Food</span>
                        </div>
                        <Button variant="ghost" size="sm">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Tag className="h-4 w-4 text-blue-500 mr-2" />
                          <span>Housing</span>
                        </div>
                        <Button variant="ghost" size="sm">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Tag className="h-4 w-4 text-blue-500 mr-2" />
                          <span>Transportation</span>
                        </div>
                        <Button variant="ghost" size="sm">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Tag className="h-4 w-4 text-blue-500 mr-2" />
                          <span>Entertainment</span>
                        </div>
                        <Button variant="ghost" size="sm">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Tag className="h-4 w-4 text-blue-500 mr-2" />
                          <span>Utilities</span>
                        </div>
                        <Button variant="ghost" size="sm">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button className="mt-2" variant="outline">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Category
                      </Button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Danger Zone</h3>
                    <div className="p-4 border border-red-200 bg-red-50 rounded-md">
                      <h4 className="font-medium text-red-600 mb-2">Delete Group</h4>
                      <p className="text-sm text-gray-600 mb-4">
                        Once you delete a group, there is no going back. Please be certain.
                      </p>
                      <Button
                        variant="destructive"
                        onClick={() => {
                          localStorage.removeItem("paytogetherGroupData")
                          localStorage.removeItem("paytogetherExpenses")
                          router.push("/create-group")
                        }}
                      >
                        Delete Group
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Export Dialog */}
      <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Export Expense Summary</DialogTitle>
            <DialogDescription>Review and print your expense summary</DialogDescription>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto border rounded-md p-4 bg-white">
            <div ref={exportContentRef} className="font-mono text-sm whitespace-pre-wrap">
              {generateExportContent()}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsExportDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handlePrintExport} className="bg-blue-600 hover:bg-blue-700">
              Print / Save PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

