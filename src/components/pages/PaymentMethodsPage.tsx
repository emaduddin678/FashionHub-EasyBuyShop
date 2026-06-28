import { AnnouncementBar } from "@/components/storefront/AnnouncementBar"
import { Header } from "@/components/storefront/Header"
import { Footer } from "@/components/storefront/Footer"
import { WhatsAppFloat } from "@/components/storefront/WhatsAppFloat"

const methods = [
  {
    name: "bKash",
    color: "#E2136E",
    logo: "💳",
    steps: [
      "Select bKash at checkout.",
      "Enter your bKash mobile number.",
      "You will receive a payment prompt on your phone.",
      "Enter your bKash PIN to confirm.",
      "Save the transaction ID for your records.",
    ],
    limits: "Minimum: ৳10 · Maximum: ৳30,000 per transaction · Daily limit: ৳2,00,000",
    tips: [
      "Ensure your bKash account has sufficient balance.",
      "Never share your bKash PIN with anyone, including FashionHub staff.",
      "If payment fails, check your balance and try again after 2 minutes.",
    ],
  },
  {
    name: "Nagad",
    color: "#F26522",
    logo: "💳",
    steps: [
      "Select Nagad at checkout.",
      "Enter your Nagad mobile number.",
      "Approve the payment request on your Nagad app.",
      "Enter your Nagad PIN to complete.",
      "You will receive an SMS confirmation.",
    ],
    limits: "Minimum: ৳10 · Maximum: ৳25,000 per transaction · Daily limit: ৳1,50,000",
    tips: [
      "Update your Nagad app to the latest version for best experience.",
      "If the payment prompt doesn't arrive, open the Nagad app manually.",
      "Contact Nagad support at 16167 for account issues.",
    ],
  },
  {
    name: "Rocket (DBBL)",
    color: "#6B2D8B",
    logo: "💳",
    steps: [
      "Select Rocket at checkout.",
      "Enter your Rocket (Dutch-Bangla) mobile number.",
      "Dial *322# on your phone or use the Rocket app.",
      "Follow the prompts to complete payment.",
      "Keep the confirmation message for your records.",
    ],
    limits: "Minimum: ৳10 · Maximum: ৳20,000 per transaction · Daily limit: ৳1,00,000",
    tips: [
      "Rocket is available via USSD (*322#) without internet.",
      "Ensure your SIM card is active and has network coverage.",
      "Contact Rocket support at 16216 for transaction issues.",
    ],
  },
  {
    name: "Credit / Debit Card",
    color: "#1A2B5E",
    logo: "💳",
    steps: [
      "Select Card Payment at checkout.",
      "Enter your 16-digit card number.",
      "Fill in the expiry date and CVV.",
      "Complete 3D Secure verification via OTP.",
      "Wait for payment confirmation — do not refresh the page.",
    ],
    limits: "Minimum: ৳100 · Maximum depends on your bank's limit · All major cards accepted (Visa, Mastercard, AMEX)",
    tips: [
      "Ensure your card is enabled for online transactions.",
      "If declined, contact your bank to enable e-commerce payments.",
      "Your card details are encrypted and never stored on our servers.",
    ],
  },
  {
    name: "Cash on Delivery (COD)",
    color: "#16a34a",
    logo: "💵",
    steps: [
      "Select Cash on Delivery at checkout.",
      "Complete your order — no payment needed now.",
      "Our agent will call to confirm your order.",
      "Pay the exact amount in cash when your order arrives.",
      "Ask for a delivery receipt as proof of payment.",
    ],
    limits: "Available for orders up to ৳10,000 · Available in Dhaka, Chittagong, Sylhet, and Rajshahi",
    tips: [
      "Please keep exact change ready to help our delivery agents.",
      "COD orders must be confirmed by phone before dispatch.",
      "If you miss the confirmation call, your order may be delayed.",
    ],
  },
]

export default function PaymentMethodsPage() {
  return (
    <div className="min-h-screen font-sans bg-[#f4f5f9]">
      <AnnouncementBar />
      <Header />

      {/* Hero */}
      <div className="bg-[#1A2B5E] py-10 text-center">
        <h1 className="text-3xl font-bold text-white">Payment Methods</h1>
        <p className="text-white/70 text-sm mt-2">
          Secure, fast, and convenient payment options for every shopper
        </p>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-10 space-y-6">
        {methods.map((method, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-8 py-5 flex items-center gap-4" style={{ borderLeft: `4px solid ${method.color}` }}>
              <span className="text-3xl">{method.logo}</span>
              <h2 className="text-lg font-bold text-[#1A2B5E]">{method.name}</h2>
            </div>
            <div className="px-8 pb-7 pt-2 space-y-5">
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">How to Pay</h3>
                <ol className="space-y-1.5 list-decimal list-inside">
                  {method.steps.map((step, j) => (
                    <li key={j} className="text-sm text-gray-600 leading-relaxed">
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Limits</h3>
                <p className="text-sm text-gray-600">{method.limits}</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Troubleshooting Tips</h3>
                <ul className="space-y-1.5">
                  {method.tips.map((tip, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-gray-600 leading-relaxed">
                      <span className="text-[#D4A017] mt-0.5 shrink-0">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}

        {/* Help note */}
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <p className="text-sm text-gray-600">
            Having trouble with a payment? Contact us at{" "}
            <span className="font-semibold text-[#1A2B5E]">hello@fashionhub.com.bd</span> or WhatsApp{" "}
            <span className="font-semibold text-[#1A2B5E]">+880 1712-345678</span>.
            We&apos;re available 9 AM – 9 PM, 7 days a week.
          </p>
        </div>
      </div>

      <Footer />
      <WhatsAppFloat />
    </div>
  )
}
