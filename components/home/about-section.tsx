import { Mail, Phone, MapPin } from "lucide-react"

export function AboutSection() {
  return (
    <section className="py-16 mb-16 bg-gradient-to-r from-primary/10 to-primary/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main About Text */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">About Us</h2>
          <div className="space-y-4 text-muted-foreground max-w-3xl">
            <p>
              At NutritiCare, we're passionate about helping you live your healthiest life. We believe that good
              nutrition is the foundation of wellness, and we're dedicated to providing high-quality, effective products
              that you can trust.
            </p>
            <p>
              Our mission is to make healthy living simple and accessible for everyone. From our carefully sourced
              ingredients to our commitment to sustainability, we're with you every step of your wellness journey.
            </p>
          </div>
        </div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Email Card */}
          <div className="bg-card rounded-lg p-6 border border-border hover:shadow-lg transition">
            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
              <Mail className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Email Us</h3>
            <p className="text-muted-foreground text-sm">contact@nutriticare.com</p>
            <p className="text-muted-foreground text-sm">support@nutriticare.com</p>
          </div>

          {/* Phone Card */}
          <div className="bg-card rounded-lg p-6 border border-border hover:shadow-lg transition">
            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
              <Phone className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Call Us</h3>
            <p className="text-muted-foreground text-sm">+1 (234) 567-890</p>
            <p className="text-muted-foreground text-sm">Mon - Fri, 9AM - 6PM</p>
          </div>

          {/* Location Card */}
          <div className="bg-card rounded-lg p-6 border border-border hover:shadow-lg transition">
            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-4">
              <MapPin className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Visit Us</h3>
            <p className="text-muted-foreground text-sm">123 Wellness Way</p>
            <p className="text-muted-foreground text-sm">Healthville, CA 90210</p>
          </div>
        </div>
      </div>
    </section>
  )
}
