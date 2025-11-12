"use client"

import { useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"

export function useScrollAnimation() {
  const ref = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const pathname = usePathname() // Track route changes

  useEffect(() => {
    setIsVisible(false)

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          // Don't unobserve immediately to allow re-triggering
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      },
    )

    const timeoutId = setTimeout(() => {
      if (ref.current) {
        observer.observe(ref.current)
      }
    }, 50)

    return () => {
      clearTimeout(timeoutId)
      if (ref.current) {
        observer.unobserve(ref.current)
      }
      observer.disconnect()
    }
  }, [pathname]) // Re-run effect when pathname changes

  return { ref, isVisible }
}
