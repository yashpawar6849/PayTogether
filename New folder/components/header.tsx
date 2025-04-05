"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X, DollarSign } from "lucide-react"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const [isReturningUser, setIsReturningUser] = useState(false)

  useEffect(() => {
    // Check if user has previously used the website
    const storedGroupData = localStorage.getItem("paytogetherGroupData")
    const storedExpenses = localStorage.getItem("paytogetherExpenses")

    if (storedGroupData && storedExpenses) {
      setIsReturningUser(true)
    }
  }, [])

  const handleGetStarted = () => {
    const storedGroupData = localStorage.getItem("paytogetherGroupData")
    const storedExpenses = localStorage.getItem("paytogetherExpenses")

    if (storedGroupData && storedExpenses) {
      // If returning user, go directly to expenses page
      router.push("/expenses")
    } else {
      // If new user, go to group creation
      router.push("/create-group")
    }
  }

  const navigation = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "History", href: "/history" },
  ]

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="h-8 w-8 rounded-md bg-blue-600 flex items-center justify-center mr-2">
                <DollarSign className="h-5 w-5 text-white" />
              </div>
              <span className="text-2xl font-bold text-blue-600">Pay</span>
              <span className="text-2xl font-bold text-gray-800">Together</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-base font-medium ${
                  pathname === item.href ? "text-blue-600" : "text-gray-600 hover:text-blue-500"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="hidden md:block">
            <Button onClick={handleGetStarted} className="bg-blue-600 hover:bg-blue-700">
              {isReturningUser ? "My Expenses" : "Get Started"}
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className="text-gray-500 hover:text-gray-600"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-3 space-y-1 animate-fadeIn">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  pathname === item.href
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-blue-500"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="mt-4 px-3">
              <Button onClick={handleGetStarted} className="w-full bg-blue-600 hover:bg-blue-700">
                {isReturningUser ? "My Expenses" : "Get Started"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

