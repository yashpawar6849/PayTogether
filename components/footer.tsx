import Link from "next/link"
import { Facebook, Twitter, Instagram, Mail, Phone, DollarSign } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="flex items-center">
              <div className="h-8 w-8 rounded-md bg-blue-600 flex items-center justify-center mr-2">
                <DollarSign className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-blue-600">Pay</span>
              <span className="text-xl font-bold text-gray-800">Together</span>
            </Link>
            <p className="mt-2 text-sm text-gray-600">
              Split expenses with friends, family, and roommates effortlessly.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Quick Links</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/" className="text-base text-gray-600 hover:text-blue-500">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-base text-gray-600 hover:text-blue-500">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-base text-gray-600 hover:text-blue-500">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/history" className="text-base text-gray-600 hover:text-blue-500">
                  History
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Contact Us</h3>
            <ul className="mt-4 space-y-2">
              <li className="flex items-center text-gray-600">
                <Mail className="h-5 w-5 mr-2 text-blue-500" />
                <span>kbtcoe.org</span>
              </li>
              <li className="flex items-center text-gray-600">
                <Phone className="h-5 w-5 mr-2 text-blue-500" />
                <span>+1 (555) 123-4567</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Follow Us</h3>
            <div className="mt-4 flex space-x-4">
              <a href="#" className="text-gray-500 hover:text-blue-500" aria-label="Facebook">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-500 hover:text-blue-500" aria-label="Twitter">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-500 hover:text-blue-500" aria-label="Instagram">
                <Instagram className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-6">
          <p className="text-sm text-gray-500 text-center">
            &copy; {new Date().getFullYear()} PayTogether. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

