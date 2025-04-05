import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Users, CreditCard, PieChart } from "lucide-react"

export default function Home() {
  const features = [
    {
      title: "Create Groups",
      description: "Easily create groups for trips, roommates, or any shared expenses.",
      icon: <Users className="h-10 w-10 text-blue-500" />,
    },
    {
      title: "Track Expenses",
      description: "Add expenses and split them evenly or with custom amounts.",
      icon: <CreditCard className="h-10 w-10 text-blue-500" />,
    },
    {
      title: "Settle Up",
      description: "See who owes what and settle debts with minimal transactions.",
      icon: <CheckCircle className="h-10 w-10 text-blue-500" />,
    },
    {
      title: "Visualize Spending",
      description: "Get insights into your group's spending patterns.",
      icon: <PieChart className="h-10 w-10 text-blue-500" />,
    },
  ]

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-white to-blue-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Split Expenses <span className="text-blue-600">Effortlessly</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            PayTogether makes it easy to split bills with friends, track shared expenses, and settle up without the
            hassle.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Link href="/create-group">Get Started</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-blue-600 text-blue-600 hover:bg-blue-50">
              <Link href="/about">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Why Choose PayTogether?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
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

      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600 text-xl font-bold mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Create a Group</h3>
              <p className="text-gray-600">Start by creating a group and adding your friends or roommates.</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600 text-xl font-bold mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Add Expenses</h3>
              <p className="text-gray-600">
                Record expenses as they happen and specify who paid and who should share the cost.
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 text-blue-600 text-xl font-bold mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Settle Up</h3>
              <p className="text-gray-600">See who owes what and settle debts with minimal transactions.</p>
            </div>
          </div>
          <div className="text-center mt-12">
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Link href="/create-group">Get Started Now</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-none shadow-md">
              <CardContent className="pt-6">
                <p className="text-gray-600 italic mb-4">
                  "PayTogether has made managing expenses with my roommates so much easier. No more awkward money
                  conversations!"
                </p>
                <p className="font-semibold">Janhavi Sonawane</p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-md">
              <CardContent className="pt-6">
                <p className="text-gray-600 italic mb-4">
                  "We used PayTogether for our group vacation and it was a game-changer. Everyone knew exactly what they
                  owed."
                </p>
                <p className="font-semibold">Yash Pawar</p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-md">
              <CardContent className="pt-6">
                <p className="text-gray-600 italic mb-4">
                  "The balance visualization makes it so clear who needs to pay whom. Love how simple it makes
                  everything!"
                </p>
                <p className="font-semibold">Om Songire</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}

