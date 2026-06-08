/* eslint-disable */
function TermsAndConditions({ onBack }) {
  const sectionStyle = { marginBottom: '32px' };
  const headingStyle = { color: '#FF6B00', fontSize: '20px', fontWeight: 'bold', marginBottom: '12px' };
  const textStyle = { color: '#ccc', lineHeight: '1.8', fontSize: '15px', marginBottom: '12px' };

  return (
    <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh', fontFamily: 'Arial, sans-serif', color: 'white' }}>
      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '20px 40px', borderBottom: '1px solid #222',
        backgroundColor: 'rgba(0,0,0,0.8)'
      }}>
        <img src={process.env.PUBLIC_URL + '/logo.jpg'} alt="EmergeU" style={{ height: '50px', borderRadius: '8px' }} />
        <button onClick={onBack} style={{
          backgroundColor: 'transparent', color: '#888',
          border: '1px solid #333', padding: '8px 16px',
          borderRadius: '20px', cursor: 'pointer', fontSize: '13px'
        }}>← Back</button>
      </nav>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '8px' }}>
          Terms & <span style={{ color: '#FF6B00' }}>Conditions</span>
        </h1>
        <p style={{ color: '#555', marginBottom: '40px', fontSize: '14px' }}>Last updated: June 08, 2026</p>

        <div style={sectionStyle}>
          <h2 style={headingStyle}>1. About EmergeU</h2>
          <p style={textStyle}>EmergeU is an AI-powered platform that connects clients with personal trainers. By using our platform you agree to these terms. EmergeU is operated by Dario Di Nino, trading as EmergeU, based at 167-169 Great Portland Street, 5th Floor, London, W1W 5PF.</p>
        </div>

        <div style={sectionStyle}>
          <h2 style={headingStyle}>2. Using EmergeU</h2>
          <p style={textStyle}>You must be at least 18 years old to use EmergeU. You are responsible for maintaining the security of your account and for all activity that occurs under your account. You agree not to misuse the platform or use it for any unlawful purpose.</p>
        </div>

        <div style={sectionStyle}>
          <h2 style={headingStyle}>3. AI Personal Trainers</h2>
          <p style={textStyle}>EmergeU offers AI-powered personal training features (Santiago and Emma). These are for informational and motivational purposes only. Always consult a qualified medical professional before starting any new exercise or nutrition programme. EmergeU accepts no liability for any injury or health issue arising from following AI-generated advice.</p>
        </div>

        <div style={sectionStyle}>
          <h2 style={headingStyle}>4. Subscriptions and Payments</h2>
          <p style={textStyle}>Pro subscriptions are billed monthly at £9.99/month. Payments are processed securely by Stripe. You may cancel your subscription at any time. Cancellations take effect at the end of the current billing period. Refunds are not provided for partial months.</p>
        </div>

        <div style={sectionStyle}>
          <h2 style={headingStyle}>5. Personal Trainers</h2>
          <p style={textStyle}>PT profiles on EmergeU are reviewed and approved before going live. However, EmergeU does not employ personal trainers and is not responsible for the services they provide. Any arrangement between a client and PT is between those parties directly.</p>
        </div>

        <div style={sectionStyle}>
          <h2 style={headingStyle}>6. Intellectual Property</h2>
          <p style={textStyle}>All content on EmergeU including the logo, design, and AI systems are the property of EmergeU. You may not copy, reproduce or distribute any part of the platform without written permission.</p>
        </div>

        <div style={sectionStyle}>
          <h2 style={headingStyle}>7. Limitation of Liability</h2>
          <p style={textStyle}>EmergeU is provided "as is". We make no warranties regarding uptime or fitness for a particular purpose. To the maximum extent permitted by law, EmergeU shall not be liable for any indirect or consequential loss arising from your use of the platform.</p>
        </div>

        <div style={sectionStyle}>
          <h2 style={headingStyle}>8. Changes to These Terms</h2>
          <p style={textStyle}>We may update these terms from time to time. Continued use of EmergeU after changes are posted constitutes acceptance of the new terms.</p>
        </div>

        <div style={sectionStyle}>
          <h2 style={headingStyle}>9. Governing Law</h2>
          <p style={textStyle}>These terms are governed by the laws of England and Wales. Any disputes shall be subject to the exclusive jurisdiction of the courts of England and Wales.</p>
        </div>

        <div style={sectionStyle}>
          <h2 style={headingStyle}>10. Contact</h2>
          <p style={textStyle}>For any questions about these terms please contact us at <a href="mailto:emergeu@emergeu.co.uk" style={{ color: '#FF6B00' }}>emergeu@emergeu.co.uk</a></p>
        </div>
      </div>
    </div>
  );
}

export default TermsAndConditions;
