"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Search, Filter, Download, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function HistoryPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedGroup, setSelectedGroup] = useState("all")
  const [selectedTimeframe, setSelectedTimeframe] = useState("all")
  const [transactions, setTransactions] = useState([])
  const [groups, setGroups] = useState(["all"])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load user's transaction history from localStorage
    const storedGroupData = localStorage.getItem("paytogetherGroupData")
    const storedExpenses = localStorage.getItem("paytogetherExpenses")

    if (storedGroupData && storedExpenses) {
      const groupData = JSON.parse(storedGroupData)
      const expenses = JSON.parse(storedExpenses)

      // Format expenses as transactions
      const formattedTransactions = expenses.map((expense) => ({
        id: expense.id,
        date: expense.date,
        group: groupData.groupName,
        description: expense.title,
        amount: expense.amount,
        paidBy: expense.paidBy,
        splitWith: expense.paidFor,
        status: "settled",
      }))

      setTransactions(formattedTransactions)

      // Get unique groups
      const uniqueGroups = ["all", groupData.groupName]
      setGroups(uniqueGroups)
    }

    setLoading(false)
  }, [])

  // Filter transactions based on search term and filters
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.paidBy.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesGroup = selectedGroup === "all" || transaction.group === selectedGroup

    // Simple timeframe filtering
    let matchesTimeframe = true
    if (selectedTimeframe === "last30") {
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      matchesTimeframe = new Date(transaction.date) >= thirtyDaysAgo
    } else if (selectedTimeframe === "last90") {
      const ninetyDaysAgo = new Date()
      ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90)
      matchesTimeframe = new Date(transaction.date) >= ninetyDaysAgo
    }

    return matchesSearch && matchesGroup && matchesTimeframe
  })

  return (
    <div>
      {/* History Hero Section */}
      <section className="bg-blue-50 py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-gray-900 mb-6 text-center">Transaction History</h1>
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-xl text-gray-600">View and manage your past transactions across all your groups.</p>
          </div>
        </div>
      </section>

      {/* History Content Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <Card className="border-none shadow-md">
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle>Transaction History</CardTitle>
                  <CardDescription>View all your past transactions and settlements</CardDescription>
                </div>
                <Button variant="outline" className="flex items-center gap-2 self-start">
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search transactions..."
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-gray-400" />
                    <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by group" />
                      </SelectTrigger>
                      <SelectContent>
                        {groups.map((group) => (
                          <SelectItem key={group} value={group}>
                            {group === "all" ? "All Groups" : group}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Timeframe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="last30">Last 30 Days</SelectItem>
                      <SelectItem value="last90">Last 90 Days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Transactions Table */}
              <div className="overflow-x-auto">
                {loading ? (
                  <div className="text-center py-8">
                    <p>Loading transaction history...</p>
                  </div>
                ) : filteredTransactions.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Group</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Paid By</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTransactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                          <TableCell>{transaction.group}</TableCell>
                          <TableCell>{transaction.description}</TableCell>
                          <TableCell>₹{transaction.amount.toFixed(2)}</TableCell>
                          <TableCell>{transaction.paidBy}</TableCell>
                          <TableCell>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                transaction.status === "settled"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {transaction.status === "settled" ? "Settled" : "Pending"}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <Alert variant="default" className="my-8">
                    <AlertCircle className="h-5 w-5 text-gray-400" />
                    <AlertTitle>No transactions found</AlertTitle>
                    <AlertDescription>
                      {searchTerm || selectedGroup !== "all" || selectedTimeframe !== "all"
                        ? "No transactions match your current filters. Try adjusting your search criteria."
                        : "You don't have any transactions yet. Create a group and add expenses to get started."}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}

