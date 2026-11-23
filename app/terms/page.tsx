import { Mail, Phone, Shield, Scale, Package, Check, MailOpen, Leaf } from 'lucide-react'

const termSections = [
  {
    title: 'Definitions and Interpretation',
    body: (
      <>
        <p>
          &quot;Company,&quot; &quot;Ourselves,&quot; &quot;We,&quot; &quot;Our,&quot; and &quot;Us&quot; refers to Millet Mountain.
        </p>
        <p>
          &quot;User,&quot; &quot;You,&quot; and &quot;Your&quot; refers to you, the person logging on this website and compliant to the
          Company&apos;s terms and conditions.
        </p>
        <p>
          &quot;Products&quot; refers to the millet grains, flour, snacks, and related merchandise offered for sale on our Site.
        </p>
      </>
    ),
  },
  {
    title: 'Use of the Website',
    body: (
      <>
        <p>
          <strong>Eligibility:</strong> By using this site, you warrant that you are at least 18 years of age or accessing the
          site under the supervision of a parent or legal guardian.
        </p>
        <p>
          <strong>Account Security:</strong> If you create an account on our Site, you are responsible for maintaining the
          confidentiality of your account details and password. You agree to accept responsibility for all activities that
          occur under your account.
        </p>
        <p>
          <strong>Prohibited Activities:</strong> You agree not to use the Site for any unlawful purpose, to solicit others to
          perform unlawful acts, to violate any international, federal, provincial, or state regulations, rules, laws, or
          local ordinances, or to infringe upon our intellectual property rights.
        </p>
      </>
    ),
  },
  {
    title: 'Products, Pricing, and Availability',
    body: (
      <>
        <p>
          <strong>Product Descriptions:</strong> We strive to ensure that all details, descriptions, and prices of products
          appearing on the Site are accurate. However, errors may occur. Since many of our products are natural agricultural
          goods, minor variations in color, texture, or size may occur.
        </p>
        <p>
          <strong>Pricing:</strong> All prices are subject to change without notice. We reserve the right at any time to
          modify or discontinue a Product without notice.
        </p>
        <p>
          <strong>Allergens and Dietary Notice:</strong> Our products are processed in facilities that may handle nuts, seeds,
          and gluten grains. While we take utmost care, customers with severe food allergies should read product labels
          carefully before consumption.
        </p>
      </>
    ),
  },
  {
    title: 'Limitation of Liability',
    body: (
      <>
        <p>
          Millet Mountain shall not be liable for any indirect, incidental, special, consequential, or punitive damages,
          including without limitation, loss of profits, data, use, goodwill, or other intangible losses resulting from your
          access to or use of (or inability to access or use) the products or website.
        </p>
      </>
    ),
  },
  {
    title: 'Governing Law',
    body: (
      <>
        <p>
          These Terms shall be governed by and construed in accordance with the laws of your local jurisdiction, without
          regard to its conflict of law provisions.
        </p>
      </>
    ),
  },
]

const returnSections = [
  {
    title: 'Eligibility for Returns',
    body: (
      <>
        <p>
          Due to the perishable and consumable nature of food items, we do not accept general returns or exchanges for change
          of mind.
        </p>
        <p>
          However, we will gladly accept return requests or issue replacements/refunds under the following specific
          conditions:
        </p>
        <ul>
          <li>
            <span className="font-bold text-charcoal">Damaged or Defective Packaging:</span> The outer packaging or seal was
            visibly damaged or tampered with upon delivery.
          </li>
          <li>
            <span className="font-bold text-charcoal">Incorrect Item Received:</span> You received a different product from
            what you ordered.
          </li>
          <li>
            <span className="font-bold text-charcoal">Quality Issues:</span> The product delivered is expired, spoiled, or
            contaminated upon opening (e.g., presence of live pests/weevils due to packaging failure).
          </li>
        </ul>
      </>
    ),
  },
  {
    title: 'Reporting Window',
    body: (
      <>
        <p>
          Any issues regarding damaged, defective, or incorrect items must be reported to our customer support team within{' '}
          <strong>48 hours of delivery.</strong>
        </p>
        <p>Claims made after 48 hours will unfortunately not be eligible for review, return, or exchange.</p>
      </>
    ),
  },
  {
    title: 'How to Initiate a Return or Exchange',
    body: (
      <>
        <p>To file a claim, please follow these steps:</p>
        <ol>
          <li>
            <span className="font-bold text-charcoal">Contact Us:</span> Email our support team at{' '}
            <a href="mailto:milletmountain23@gmail.com" className="text-terracotta font-semibold hover:text-terracotta-dark">
              milletmountain23@gmail.com
            </a>{' '}
            or call our helpline with your Order ID.
          </li>
          <li>
            <span className="font-bold text-charcoal">Provide Evidence:</span> Attach clear photographs or a short video
            showing the damaged product, the packaging label, and the batch number.
          </li>
          <li>
            <span className="font-bold text-charcoal">Inspection:</span> Our quality assurance team will inspect the evidence
            within 2 to 3 business days and notify you of the approval or rejection of your refund/exchange.
          </li>
        </ol>
      </>
    ),
  },
  {
    title: 'Refunds (If Applicable)',
    body: (
      <>
        <p>
          Once your return claim is approved, we will initiate a refund to your original method of payment, or issue store
          credit, depending on your preference.
        </p>
        <p>
          Processing times for refunds to reflect in your account typically take 5–7 business days, depending on your bank or
          payment gateway provider.
        </p>
      </>
    ),
  },
  {
    title: 'Shipping Costs for Returns',
    body: (
      <>
        <p>
          If the return is due to our error (e.g., damaged, defective, or wrong item), Millet Mountain will bear the cost of
          return shipping or arrange a reverse pickup if available in your area.
        </p>
        <p>Original shipping fees are non-refundable.</p>
      </>
    ),
  },
]

const sectionColours = ['text-terracotta', 'text-forest', 'text-ochre-dark', 'text-forest', 'text-terracotta']
const sectionBg = ['bg-terracotta/15', 'bg-sage/25', 'bg-ochre/20', 'bg-forest/15', 'bg-terracotta/10']

export default function TermsPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-forest to-forest-dark text-cream py-16 sm:py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-16 left-1/4 w-96 h-96 bg-sage rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-ochre rounded-full blur-3xl"></div>
        </div>
        <div className="container-custom text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-4">
            <Shield className="h-4 w-4 text-ochre" />
            <span className="text-xs font-bold tracking-widest uppercase">Good Food, Clear Terms</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4">
            Terms &amp; <span className="text-ochre">Conditions</span>
          </h1>
          <p className="text-lg sm:text-xl text-cream/80 max-w-2xl mx-auto">
            Effective Date: September 18, 2026 — welcome to Millet Mountain!
          </p>
        </div>
        <div className="wave-divider absolute bottom-0 left-0 right-0"></div>
      </section>

      {/* Intro */}
      <section className="section-padding bg-paper-texture">
        <div className="container-custom max-w-4xl">
          <div className="bg-white/90 backdrop-blur-sm border-2 border-[#EAE0CC] rounded-3xl p-8 sm:p-10 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 bg-sage/25 blob-2 flex items-center justify-center flex-shrink-0">
                <Leaf className="h-6 w-6 text-forest" />
              </div>
              <div>
                <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-charcoal mb-4">Welcome to Millet Mountain!</h2>
                <p className="text-charcoal/70 leading-relaxed mb-4">
                  These Terms and Conditions (&quot;Terms&quot;) outline the rules and regulations for the use of the Millet
                  Mountain website (the &quot;Site&quot;) and the purchase of our products. By accessing this website and/or
                  purchasing from us, you agree to accept these terms.
                </p>
                <p className="text-charcoal/70 leading-relaxed">
                  Do not continue to use Millet Mountain if you do not agree to all of the terms and conditions stated on this
                  page.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Terms & Conditions */}
      <section className="section-padding bg-paper-texture pt-0">
        <div className="container-custom max-w-4xl">
          <div className="text-center mb-10">
            <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-charcoal mb-3">
              Terms &amp; Conditions <span className="text-terracotta">Overview</span>
            </h2>
            <p className="text-lg text-charcoal/60">The rules and regulations governing use of our Site and products</p>
          </div>

          <div className="space-y-6">
            {termSections.map((section, i) => {
              const num = i + 1
              return (
                <div
                  key={section.title}
                  className="bg-white/90 backdrop-blur-sm border-2 border-[#EAE0CC] rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`h-11 w-11 ${sectionBg[i]} blob-2 flex items-center justify-center flex-shrink-0`}>
                      <span className={`font-heading font-extrabold text-lg ${sectionColours[i]}`}>{num}</span>
                    </div>
                    <h3 className="font-heading text-xl sm:text-2xl font-extrabold text-charcoal">
                      {num}. {section.title}
                    </h3>
                  </div>
                  <div className="space-y-3 text-charcoal/70 leading-relaxed prose-headings:text-charcoal">{section.body}</div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Return & Exchange Policy */}
      <section className="section-padding bg-paper-texture pt-0">
        <div className="container-custom max-w-4xl">
          <div className="bg-gradient-to-br from-forest to-forest-dark text-cream rounded-3xl p-8 sm:p-10 mb-10 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute -top-10 right-1/4 w-64 h-64 bg-ochre rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-sage rounded-full blur-3xl"></div>
            </div>
            <div className="relative z-10 flex items-start gap-4">
              <div className="h-14 w-14 bg-white/15 blob-2 flex items-center justify-center flex-shrink-0">
                <Package className="h-7 w-7 text-ochre" />
              </div>
              <div>
                <h2 className="font-heading text-3xl md:text-4xl font-extrabold mb-3">Return &amp; Exchange Policy</h2>
                <p className="text-cream/85 leading-relaxed">
                  At Millet Mountain, we take pride in delivering farm-fresh, high-quality organic millet products to your
                  doorstep. Because our products are food and consumable items, we maintain strict quality control and hygiene
                  standards. Please read our policy carefully to understand your rights and options.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {returnSections.map((section, i) => {
              const num = i + 1
              return (
                <div
                  key={section.title}
                  className="bg-white/90 backdrop-blur-sm border-2 border-[#EAE0CC] rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-11 w-11 bg-forest/15 blob-3 flex items-center justify-center flex-shrink-0">
                      <span className="font-heading font-extrabold text-lg text-forest">{num}</span>
                    </div>
                    <h3 className="font-heading text-xl sm:text-2xl font-extrabold text-charcoal">{section.title}</h3>
                  </div>
                  <div className="space-y-3 text-charcoal/70 leading-relaxed">{section.body}</div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Need Help */}
      <section className="section-padding bg-paper-texture pt-0">
        <div className="container-custom max-w-4xl">
          <div className="bg-white/90 backdrop-blur-sm border-2 border-[#EAE0CC] rounded-3xl p-8 sm:p-10 shadow-sm">
            <div className="flex items-start gap-4 mb-6">
              <div className="h-12 w-12 bg-terracotta/15 blob-1 flex items-center justify-center flex-shrink-0">
                <MailOpen className="h-6 w-6 text-terracotta" />
              </div>
              <div>
                <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-charcoal mb-2">Need Help?</h2>
                <p className="text-charcoal/70">
                  If you have any questions regarding these Terms or our Return Policy, please reach out to us at:
                </p>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <a
                href="mailto:milletmountain23@gmail.com"
                className="flex items-center gap-3 p-4 bg-cream border border-[#EFE7DA] rounded-2xl hover:border-sage/60 transition-colors group"
              >
                <div className="h-10 w-10 bg-sage/25 blob-3 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <Mail className="h-5 w-5 text-forest" />
                </div>
                <div>
                  <p className="text-xs font-bold text-charcoal/50 uppercase tracking-wide">Email Us</p>
                  <p className="font-semibold text-forest">milletmountain23@gmail.com</p>
                </div>
              </a>
              <div className="flex items-center gap-3 p-4 bg-cream border border-[#EFE7DA] rounded-2xl">
                <div className="h-10 w-10 bg-ochre/20 blob-1 flex items-center justify-center flex-shrink-0">
                  <Phone className="h-5 w-5 text-ochre-dark" />
                </div>
                <div>
                  <p className="text-xs font-bold text-charcoal/50 uppercase tracking-wide">Call Us</p>
                  <p className="font-semibold text-charcoal">[Insert Contact Number]</p>
                </div>
              </div>
            </div>
            <div className="mt-6 p-4 bg-sage/15 border border-sage/40 rounded-2xl flex items-center gap-3">
              <Check className="h-5 w-5 text-forest flex-shrink-0" />
              <p className="text-sm text-forest">
                By completing a purchase on this website, you acknowledge that you have read, understood, and agree to be
                bound by these Terms &amp; Conditions.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}