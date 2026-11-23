import { Mail, Phone, MapPin, Shield, Lock, Cookie, Baby, Info, RefreshCw, Database, MessagesSquare } from 'lucide-react'

const privacySections = [
  {
    title: 'Information We Collect',
    icon: Database,
    iconBg: 'bg-terracotta/15',
    iconColor: 'text-terracotta',
    body: (
      <>
        <p>
          We may collect information about you in a variety of ways, including:
        </p>
        <ul>
          <li>
            <span className="font-bold text-charcoal">Personal Data:</span> Personally identifiable information, such as your
            name, shipping address, email address, telephone number, and billing information that you voluntarily give to us
            when you register on the site, place an order, or contact customer support.
          </li>
          <li>
            <span className="font-bold text-charcoal">Derivative Data:</span> Information automatically collected by our
            servers when you access the site, such as your IP address, browser type, operating system, access times, and the
            pages you viewed directly before and after accessing the site.
          </li>
          <li>
            <span className="font-bold text-charcoal">Payment Information:</span> Financial data (such as credit/debit card
            numbers or payment gateway details) collected when you make a purchase.{' '}
            <strong>Note:</strong> We do not store complete credit card details on our servers; transactions are processed
            securely through certified third-party payment gateways.
          </li>
        </ul>
      </>
    ),
  },
  {
    title: 'Use of Your Information',
    icon: MessagesSquare,
    iconBg: 'bg-sage/25',
    iconColor: 'text-forest',
    body: (
      <>
        <p>
          Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience.
          Specifically, we may use information collected about you via the site to:
        </p>
        <ul>
          <li>Create and manage your account.</li>
          <li>Process your orders, ship products, and manage returns or exchanges.</li>
          <li>Send you order confirmations, tracking details, and customer service updates.</li>
          <li>Respond to customer service inquiries, feedback, or support requests.</li>
          <li>
            Send you promotional emails, newsletters, or marketing communications regarding new millet products and offers
            (you may opt out at any time).
          </li>
          <li>Monitor and analyze usage trends and preferences to improve our website experience and product offerings.</li>
        </ul>
      </>
    ),
  },
  {
    title: 'Disclosure of Your Information',
    icon: Info,
    iconBg: 'bg-ochre/20',
    iconColor: 'text-ochre-dark',
    body: (
      <>
        <p>
          We do not sell, trade, or rent your personal information to third parties. We may share information we have
          collected about you in certain situations:
        </p>
        <ul>
          <li>
            <span className="font-bold text-charcoal">Service Providers:</span> We may share your data with third-party
            vendors, couriers, and payment processors who perform services for us (e.g., order fulfillment, data analysis,
            email delivery, and hosting services).
          </li>
          <li>
            <span className="font-bold text-charcoal">Legal Obligations:</span> We may disclose your information where
            required to do so by law, or in response to valid requests by public authorities (e.g., a court order or
            government agency).
          </li>
          <li>
            <span className="font-bold text-charcoal">Business Transfers:</span> If we are involved in a merger, acquisition,
            or sale of all or a portion of our assets, your information may be transferred as part of that transaction.
          </li>
        </ul>
      </>
    ),
  },
  {
    title: 'Security of Your Information',
    icon: Lock,
    iconBg: 'bg-forest/15',
    iconColor: 'text-forest',
    body: (
      <>
        <p>
          We use administrative, technical, and physical security measures to help protect your personal information. While
          we have taken reasonable steps to secure the personal data you provide to us, please be aware that no security
          measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception
          or other type of misuse.
        </p>
      </>
    ),
  },
  {
    title: 'Cookies and Tracking Technologies',
    icon: Cookie,
    iconBg: 'bg-terracotta/10',
    iconColor: 'text-terracotta',
    body: (
      <>
        <p>
          We may use cookies, web beacons, and other tracking technologies on the site to help customize the site and improve
          your experience.
        </p>
        <p>
          <span className="font-bold text-charcoal">What are cookies?</span> Cookies are small data files stored on your hard
          drive by a website.
        </p>
        <p>
          You can choose to set your browser to remove or reject browser cookies. However, blocking certain cookies may
          affect the availability and functionality of the site.
        </p>
      </>
    ),
  },
  {
    title: 'Policy for Children',
    icon: Baby,
    iconBg: 'bg-sage/20',
    iconColor: 'text-forest',
    body: (
      <>
        <p>
          We do not knowingly solicit information from or market to children under the age of 18. If we learn that we have
          collected personal information from a user under age 18 without verification of parental consent, we will delete
          that information as quickly as possible.
        </p>
      </>
    ),
  },
  {
    title: 'Changes to This Privacy Policy',
    icon: RefreshCw,
    iconBg: 'bg-ochre/15',
    iconColor: 'text-ochre-dark',
    body: (
      <>
        <p>
          We may update this Privacy Policy from time to time in order to reflect changes to our practices or for other
          operational, legal, or regulatory reasons. We will notify you of any changes by updating the &quot;Effective
          Date&quot; at the top of this policy. You are encouraged to review this Privacy Policy periodically to stay
          informed of updates.
        </p>
      </>
    ),
  },
]

export default function PrivacyPage() {
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
            <span className="text-xs font-bold tracking-widest uppercase">Your Trust Matters to Us</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4">
            Privacy <span className="text-ochre">Policy</span>
          </h1>
          <p className="text-lg sm:text-xl text-cream/80 max-w-2xl mx-auto">
            Effective Date: September 18, 2026
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
                <Shield className="h-6 w-6 text-forest" />
              </div>
              <div>
                <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-charcoal mb-4">
                  Our Commitment to Your Privacy
                </h2>
                <p className="text-charcoal/70 leading-relaxed mb-4">
                  At Millet Mountain (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;), we respect your privacy and are
                  committed to protecting your personal data. This Privacy Policy explains how we collect, use, disclose, and
                  safeguard your information when you visit our website or purchase our products.
                </p>
                <p className="text-charcoal/70 leading-relaxed">
                  Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please
                  do not access the site.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Policy Sections */}
      <section className="section-padding bg-paper-texture pt-0">
        <div className="container-custom max-w-4xl">
          <div className="space-y-6">
            {privacySections.map((section, i) => {
              const Icon = section.icon
              const num = i + 1
              return (
                <div
                  key={section.title}
                  className="bg-white/90 backdrop-blur-sm border-2 border-[#EAE0CC] rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className={`h-12 w-12 ${section.iconBg} blob-2 flex items-center justify-center flex-shrink-0`}
                    >
                      <Icon className={`h-6 w-6 ${section.iconColor}`} />
                    </div>
                    <h3 className="font-heading text-xl sm:text-2xl font-extrabold text-charcoal">
                      {num}. {section.title}
                    </h3>
                  </div>
                  <div className="space-y-3 text-charcoal/70 leading-relaxed">
                    {section.body}
                    {num === 8 && (
                      <div className="mt-6 p-4 bg-sage/15 border border-sage/40 rounded-2xl space-y-2">
                        <p>
                          <span className="font-bold text-charcoal">Email:</span>{' '}
                          <a
                            href="mailto:milletmountain23@gmail.com"
                            className="text-terracotta font-semibold hover:text-terracotta-dark"
                          >
                            milletmountain23@gmail.com
                          </a>
                        </p>
                        <p>
                          <span className="font-bold text-charcoal">Phone:</span> [Insert Contact Number]
                        </p>
                        <p>
                          <span className="font-bold text-charcoal">Address:</span> [Insert Business/Office Address]
                        </p>
                      </div>
                    )}
                  </div>
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
                <Mail className="h-6 w-6 text-terracotta" />
              </div>
              <div>
                <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-charcoal mb-2">Questions?</h2>
                <p className="text-charcoal/70">
                  If you have questions, comments, or concerns about this Privacy Policy, please contact us at:
                </p>
              </div>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <a
                href="mailto:milletmountain23@gmail.com"
                className="flex items-center gap-3 p-4 bg-cream border border-[#EFE7DA] rounded-2xl hover:border-sage/60 transition-colors group"
              >
                <div className="h-10 w-10 bg-sage/25 blob-3 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <Mail className="h-5 w-5 text-forest" />
                </div>
                <div>
                  <p className="text-xs font-bold text-charcoal/50 uppercase tracking-wide">Email</p>
                  <p className="font-semibold text-forest text-sm break-all">milletmountain23@gmail.com</p>
                </div>
              </a>
              <div className="flex items-center gap-3 p-4 bg-cream border border-[#EFE7DA] rounded-2xl">
                <div className="h-10 w-10 bg-ochre/20 blob-1 flex items-center justify-center flex-shrink-0">
                  <Phone className="h-5 w-5 text-ochre-dark" />
                </div>
                <div>
                  <p className="text-xs font-bold text-charcoal/50 uppercase tracking-wide">Phone</p>
                  <p className="font-semibold text-charcoal">[Insert Contact Number]</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-cream border border-[#EFE7DA] rounded-2xl">
                <div className="h-10 w-10 bg-terracotta/15 blob-2 flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-5 w-5 text-terracotta" />
                </div>
                <div>
                  <p className="text-xs font-bold text-charcoal/50 uppercase tracking-wide">Address</p>
                  <p className="font-semibold text-charcoal">[Insert Business/Office Address]</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}