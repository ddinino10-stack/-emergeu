/* eslint-disable */
function PrivacyPolicy({ onBack }) {
  const sectionStyle = {
    marginBottom: '32px'
  };
  const headingStyle = {
    color: '#FF6B00', fontSize: '20px', fontWeight: 'bold', marginBottom: '12px'
  };
  const textStyle = {
    color: '#ccc', lineHeight: '1.8', fontSize: '15px', marginBottom: '12px'
  };

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
          Privacy <span style={{ color: '#FF6B00' }}>Policy</span>
        </h1>
        <p style={{ color: '#555', marginBottom: '40px', fontSize: '14px' }}>Last updated: June 08, 2026</p>

        <div style={sectionStyle}>
          <h2 style={headingStyle}>Owner and Data Controller</h2>
          <p style={textStyle}>EmergeU — 167-169 Great Portland Street, 5th Floor, London, W1W 5PF</p>
          <p style={textStyle}>Contact email: emergeu@emergeu.co.uk</p>
        </div>

        <div style={sectionStyle}>
          <h2 style={headingStyle}>Types of Data We Collect</h2>
          <p style={textStyle}>We collect the following personal data: first name, last name, email address, account login details, and usage data including IP addresses and browser information.</p>
        </div>

        <div style={sectionStyle}>
          <h2 style={headingStyle}>How We Use Your Data</h2>
          <p style={textStyle}>Your data is collected to provide our services, including:</p>
          <ul style={{ color: '#ccc', lineHeight: '2', paddingLeft: '20px' }}>
            <li>Handling payments via Stripe</li>
            <li>Hosting and backend infrastructure via Supabase and Vercel</li>
            <li>Registration and authentication</li>
          </ul>
        </div>

        <div style={sectionStyle}>
          <h2 style={headingStyle}>Third Party Services</h2>
          <p style={textStyle}><strong style={{ color: 'white' }}>Stripe, Inc.</strong> — Payment processing (United States)</p>
          <p style={textStyle}><strong style={{ color: 'white' }}>Supabase, Inc.</strong> — Database and authentication (Singapore)</p>
          <p style={textStyle}><strong style={{ color: 'white' }}>Vercel Inc.</strong> — Hosting and infrastructure (United States)</p>
        </div>

        <div style={sectionStyle}>
          <h2 style={headingStyle}>Data Retention</h2>
          <p style={textStyle}>Personal data is stored for as long as required to provide our services or as required by law. You may request deletion of your data at any time.</p>
        </div>

        <div style={sectionStyle}>
          <h2 style={headingStyle}>Your Rights (GDPR)</h2>
          <p style={textStyle}>Under GDPR you have the right to:</p>
          <ul style={{ color: '#ccc', lineHeight: '2', paddingLeft: '20px' }}>
            <li>Access the data we hold about you</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Withdraw consent at any time</li>
            <li>Lodge a complaint with the ICO (ico.org.uk)</li>
          </ul>
        </div>

        <div style={sectionStyle}>
          <h2 style={headingStyle}>Cookies</h2>
          <p style={textStyle}>We use cookies to improve your experience. You can accept or decline cookies when visiting our site. See our Cookie Policy for more details.</p>
        </div>

        <div style={sectionStyle}>
          <h2 style={headingStyle}>Contact Us</h2>
          <p style={textStyle}>For any privacy-related requests please contact us at <a href="mailto:emergeu@emergeu.co.uk" style={{ color: '#FF6B00' }}>emergeu@emergeu.co.uk</a></p>
        </div>

        <div style={{
          backgroundColor: '#111', border: '1px solid #222',
          borderRadius: '12px', padding: '20px', marginTop: '40px'
        }}>
          <p style={{ color: '#555', fontSize: '13px', margin: 0 }}>
            This privacy policy was generated with iubenda and relates solely to www.emergeu.co.uk.
            Full policy available at <a href="https://www.iubenda.com" target="_blank" rel="noreferrer" style={{ color: '#FF6B00' }}>iubenda.com</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default PrivacyPolicy;
