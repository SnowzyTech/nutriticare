import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram, Twitter } from "lucide-react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"



export function Footer() {
  const TikTokIcon = (props) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
      {...props}
    >
      <path d="M9 3v12.6a3.4 3.4 0 1 1-3.4-3.4" />
      <path d="M15 3a6 6 0 0 0 6 6" />
      <path d="M15 3v13a6 6 0 1 1-6-6" />
    </svg>
  )


  const footerRef = useScrollAnimation()

  return (
    <footer className="bg-card border-t border-border mt-20">
      <div
        ref={footerRef.ref}
        className={`${footerRef.isVisible ? "animate-slide-in-up" : "opacity-0"} max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <Image src="/logo.png" alt="NutritiCare Logo" width={100} height={40} className="rounded" />
            <p className="text-muted-foreground text-[12px] mt-[-20px] pl-3">Your daily dose of wellness, delivered.</p>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">COMPANY</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/shop" className="text-muted-foreground hover:text-primary text-sm">
                  Shop
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-muted-foreground hover:text-primary text-sm">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary text-sm">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary text-sm">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">CUSTOMER SERVICE</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary text-sm">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary text-sm">
                  Track Order
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary text-sm">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">JOIN OUR NEWSLETTER</h4>
            <p className="text-muted-foreground text-sm mb-3">
              Get the latest updates on new products and upcoming sales
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-background border border-border rounded px-3 py-2 text-sm text-foreground placeholder-muted-foreground"
              />
              <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded text-sm font-medium">
                Sign Up
              </button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div
          ref={footerRef.ref}
          className={`${footerRef.isVisible ? "animate-slide-in-up" : "opacity-0"} border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between`}
        >
          <p className="text-muted-foreground text-sm">© 2025 NutritiCare. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link
              href="https://www.facebook.com/share/1BXJNh4M9f/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary"
            >
              <Facebook className="w-5 h-5" />
            </Link>
            <Link
              href="https://www.instagram.com/nutriticare?igsh=MXZlMHR2MDdoa29xMQ="
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary"
            >
              <Instagram className="w-5 h-5" />
            </Link>
            <Link
              href="https://www.tiktok.com/@nutriticare?_t=ZS-90tvPKOOnLj&_r=1"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary"
            >
              <TikTokIcon className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
