'use client'

import Footer from '@/components/Footer'

export default function ContactPage() {
  return (
    <>
      <main className="content-page">
        <div className="content-container">
          <div className="content-header">
            <h1 className="content-title">Contact</h1>
            <p className="content-subtitle">For questions, support, or press inquiries, reach out directly.</p>
          </div>
          
          <div className="legal-content">
            <div className="legal-section">
              <p>
                <a href="mailto:thejacksegal@gmail.com" className="contact-email">thejacksegal@gmail.com</a>
              </p>
            </div>

            <div className="legal-footer">
              <p>BizYip • Raleigh, North Carolina</p>
            </div>
          </div>
        </div>
      </main>
      <Footer onScrollTo={(id) => {}} />
    </>
  )
}
