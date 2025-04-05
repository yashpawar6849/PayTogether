import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, DollarSign, Users, Clock } from "lucide-react"

export default function AboutPage() {
  const keyFeatures = [
    {
      title: "Simple Expense Tracking",
      description: "Add expenses on the go and categorize them for better organization.",
      icon: <DollarSign className="h-8 w-8 text-blue-500" />,
    },
    {
      title: "Smart Splitting",
      description: "Split expenses evenly or with custom amounts based on individual needs.",
      icon: <Users className="h-8 w-8 text-blue-500" />,
    },
    {
      title: "Debt Simplification",
      description: "Our algorithm minimizes the number of transactions needed to settle debts.",
      icon: <CheckCircle className="h-8 w-8 text-blue-500" />,
    },
    {
      title: "Transaction History",
      description: "Keep track of all past expenses and settlements for future reference.",
      icon: <Clock className="h-8 w-8 text-blue-500" />,
    },
  ]

  return (
    <div>
      {/* About Hero Section */}
      <section className="bg-blue-50 py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-gray-900 mb-6 text-center">About PayTogether</h1>
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-xl text-gray-600 mb-8">
              PayTogether was created to solve the common problem of splitting expenses among friends, roommates, and
              family members. Our mission is to make shared finances simple and stress-free.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How PayTogether Works</h2>
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-semibold mb-4 text-blue-600">1. Create a Group</h3>
                <p className="text-gray-600 mb-6">
                  Start by creating a group for your shared expenses. Add all participants who will be splitting costs.
                  You can create multiple groups for different purposes - roommates, trips, events, and more.
                </p>

                <h3 className="text-2xl font-semibold mb-4 text-blue-600">2. Add Expenses</h3>
                <p className="text-gray-600">
                  Whenever someone pays for something, add it to PayTogether. Specify who paid, how much, and how it
                  should be split among group members. You can split evenly or with custom amounts.
                </p>
              </div>
              <div>
                <h3 className="text-2xl font-semibold mb-4 text-blue-600">3. Track Balances</h3>
                <p className="text-gray-600 mb-6">
                  PayTogether automatically calculates who owes what to whom. The balance page shows a clear overview of
                  all debts within the group, making it easy to see who needs to pay and who needs to be paid.
                </p>

                <h3 className="text-2xl font-semibold mb-4 text-blue-600">4. Settle Up</h3>
                <p className="text-gray-600">
                  When it&apos;s time to settle debts, PayTogether shows the minimal number of transactions needed. Mark
                  debts as paid once they&apos;re settled, and keep your balances up to date.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {keyFeatures.map((feature, index) => (
              <Card key={index} className="border-none shadow-md">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-4">{feature.icon}</div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Why Choose PayTogether?</h2>
          <div className="max-w-3xl mx-auto">
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <CheckCircle className="h-5 w-5 text-blue-500" />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-semibold">User-Friendly</h3>
                  <p className="text-gray-600">
                    Our intuitive interface makes it easy for anyone to use, regardless of technical skill level.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <CheckCircle className="h-5 w-5 text-blue-500" />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-semibold">No More Awkwardness</h3>
                  <p className="text-gray-600">
                    PayTogether eliminates the awkwardness of asking friends for money by providing clear, transparent
                    records of shared expenses.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <CheckCircle className="h-5 w-5 text-blue-500" />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-semibold">Time-Saving</h3>
                  <p className="text-gray-600">
                    Spend less time figuring out who owes what and more time enjoying your shared experiences.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <CheckCircle className="h-5 w-5 text-blue-500" />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-semibold">Comprehensive History</h3>
                  <p className="text-gray-600">
                    Keep a detailed record of all shared expenses for future reference and transparency.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

