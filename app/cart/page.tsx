"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useCart } from "@/lib/cart-context"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Trash2, Plus, Minus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, clearCart } = useCart()
  const { toast } = useToast()

  const handleRemoveItem = (itemId: string, itemName: string) => {
    removeItem(itemId)
    toast({
      title: "Item Removed",
      description: `${itemName} has been removed from your cart.`,
    })
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold text-foreground mb-8">Shopping Cart</h1>
          <div className="bg-card rounded-lg p-12 text-center border border-border">
            <p className="text-lg text-muted-foreground mb-6">Your cart is empty</p>
            <Link href="/shop">
              <Button className="bg-primary hover:bg-primary/90">Continue Shopping</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-foreground mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="bg-card rounded-lg p-4 sm:p-6 border border-border">
                <div className="grid grid-cols-1 sm:flex gap-4 sm:gap-6">
                  <div
                    className="w-full sm:w-24 sm:h-24 h-62 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex-shrink-0"
                    style={{
                      backgroundImage: `url(${item.image})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                  <div className="flex-1 flex flex-col">
                    <h3 className="font-semibold text-foreground mb-2">{item.name}</h3>
                    <p className="text-primary font-bold mb-4">₦{item.price.toFixed(2)}</p>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                      <div className="flex items-center border border-border rounded-lg w-fit">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-3 py-2 text-muted-foreground hover:text-foreground"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-4 py-2 text-foreground">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-3 py-2 text-muted-foreground hover:text-foreground"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <button
                        onClick={() => handleRemoveItem(item.id, item.name)}
                        className="sm:ml-auto p-2 text-red-500 hover:bg-red-500/10 rounded transition w-fit"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="bg-card mb-[-40px] rounded-lg p-6 border border-border h-fit sticky top-20">
            <h2 className="text-xl font-bold text-foreground mb-6">Order Summary</h2>

            <div className="space-y-4 mb-6 pb-6 border-b border-border">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>₦{total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Tax</span>
                <span>₦{(total * 0.1).toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-between mb-6">
              <span className="font-semibold text-foreground">Total</span>
              <span className="text-2xl font-bold text-primary">₦{total.toFixed(2)}</span>
            </div>

            <Link href="/checkout">
              <Button className="w-full bg-primary hover:bg-primary/90 py-3 mb-3">Proceed to Checkout</Button>
            </Link>

            <Button variant="outline" onClick={clearCart} className="w-full bg-transparent">
              Clear Cart
            </Button>

            <Link href="/shop">
              <Button variant="ghost" className="w-full mt-3">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
