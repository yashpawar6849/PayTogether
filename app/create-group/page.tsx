"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { X, Plus, Users } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function CreateGroupPage() {
  const router = useRouter()
  const [participants, setParticipants] = useState([
    { id: 1, name: "John Doe" },
    { id: 2, name: "" },
  ])
  const [activeUser, setActiveUser] = useState("John Doe")
  const [groupName, setGroupName] = useState("")
  const [currency, setCurrency] = useState("INR") // Default to INR
  const [groupDetails, setGroupDetails] = useState("")
  const [formError, setFormError] = useState("")

  // Check if user is returning and redirect if needed
  useEffect(() => {
    const storedGroupData = localStorage.getItem("paytogetherGroupData")
    const storedExpenses = localStorage.getItem("paytogetherExpenses")

    if (storedGroupData && storedExpenses) {
      // If returning user, go directly to expenses page
      router.push("/expenses")
    }
  }, [router])

  const handleAddParticipant = () => {
    setParticipants([...participants, { id: participants.length + 1, name: "" }])
  }

  const handleRemoveParticipant = (id: number) => {
    if (participants.length > 2) {
      const updatedParticipants = participants.filter((p) => p.id !== id)
      setParticipants(updatedParticipants)

      // If active user was removed, update active user
      if (!updatedParticipants.some((p) => p.name === activeUser)) {
        const firstValidParticipant = updatedParticipants.find((p) => p.name.trim() !== "")
        if (firstValidParticipant) {
          setActiveUser(firstValidParticipant.name)
        }
      }
    }
  }

  const handleParticipantChange = (id: number, name: string) => {
    setParticipants(participants.map((p) => (p.id === id ? { ...p, name } : p)))

    // If this is the active user, update active user name
    const participant = participants.find((p) => p.id === id)
    if (participant && participant.name === activeUser) {
      setActiveUser(name)
    }
  }

  const handleCreateGroup = () => {
    // Validate inputs
    setFormError("")

    if (!groupName.trim()) {
      setFormError("Please enter a group name")
      return
    }

    const validParticipants = participants.filter((p) => p.name.trim() !== "")
    if (validParticipants.length < 2) {
      setFormError("Please add at least two participants")
      return
    }

    // Store group data in localStorage for persistence
    const groupData = {
      groupName,
      currency,
      groupDetails,
      participants: validParticipants,
      activeUser,
      createdAt: new Date().toISOString(),
    }

    localStorage.setItem("paytogetherGroupData", JSON.stringify(groupData))

    // Initialize empty expenses array if it doesn't exist
    if (!localStorage.getItem("paytogetherExpenses")) {
      localStorage.setItem("paytogetherExpenses", JSON.stringify([]))
    }

    // Navigate to the expenses page
    router.push("/expenses")
  }

  return (
    <div className="py-16 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">Create a New Group</h1>
            <p className="text-center text-gray-600">Set up a group to start tracking and splitting expenses.</p>
          </div>

          <Card className="border-none shadow-md">
            <CardHeader>
              <CardTitle>Group Information</CardTitle>
              <CardDescription>Enter the details for your new expense sharing group.</CardDescription>
            </CardHeader>
            <CardContent>
              {formError && (
                <Alert variant="destructive" className="mb-6">
                  <AlertDescription>{formError}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-6">
                {/* Group Information Section */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="groupName">Group Name</Label>
                    <Input
                      id="groupName"
                      placeholder="e.g., Roommates, Trip to Goa"
                      value={groupName}
                      onChange={(e) => setGroupName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <select
                      id="currency"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                    >
                      <option value="INR">INR (₹)</option>
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="JPY">JPY (¥)</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="groupDetails">Group Details (Optional)</Label>
                    <Textarea
                      id="groupDetails"
                      placeholder="Add any additional information about this group..."
                      rows={3}
                      value={groupDetails}
                      onChange={(e) => setGroupDetails(e.target.value)}
                    />
                  </div>
                </div>

                {/* Participants Section */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold flex items-center">
                      <Users className="mr-2 h-5 w-5 text-blue-500" />
                      Participants
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {participants.map((participant) => (
                      <div key={participant.id} className="flex items-center space-x-2">
                        <Input
                          placeholder="Participant name"
                          value={participant.name}
                          onChange={(e) => handleParticipantChange(participant.id, e.target.value)}
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveParticipant(participant.id)}
                          disabled={participants.length <= 2}
                          className="h-10 w-10 rounded-full"
                          aria-label="Remove participant"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}

                    <Button type="button" variant="outline" size="sm" onClick={handleAddParticipant} className="mt-2">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Participant
                    </Button>
                  </div>
                </div>

                {/* Local Settings */}
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Local Settings</h3>
                  <div className="space-y-2">
                    <Label htmlFor="activeUser">You are</Label>
                    <select
                      id="activeUser"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={activeUser}
                      onChange={(e) => setActiveUser(e.target.value)}
                    >
                      {participants
                        .filter((p) => p.name.trim() !== "")
                        .map((p) => (
                          <option key={p.id} value={p.name}>
                            {p.name}
                          </option>
                        ))}
                    </select>
                  </div>
                  <p className="text-sm text-gray-500">This will be the default payer for expenses you add.</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => router.push("/")}>
                Cancel
              </Button>
              <Button
                onClick={handleCreateGroup}
                className="bg-blue-600 hover:bg-blue-700"
                disabled={!groupName || participants.filter((p) => p.name.trim() !== "").length < 2}
              >
                Create Group
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

