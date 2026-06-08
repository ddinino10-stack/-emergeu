/* eslint-disable */ // v2
import { useState, useEffect } from 'react';
import { supabase } from './supabase';
import Login from './Login';
import Signup from './Signup';
import Dashboard from './Dashboard';
import AiChat from './AiChat';
import PTProfile from './PTProfile';
import AdminDashboard from './AdminDashboard';
import MatchResults from './MatchResults';
import Messaging from './Messaging';
import Santiago from './Santiago';
import Success from './Success';
import Emma from './Emma';
import MealIdeas from './MealIdeas';
import FoodTracker from './FoodTracker';
import PTTools from './PTTools';
import CookieBanner from './CookieBanner';
import PrivacyPolicy from './PrivacyPolicy';
import TermsAndConditions from './TermsAndConditions';
import SessionBooking from './SessionBooking';
import PTBookings from './PTBookings';

function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [showPTProfile, setShowPTProfile] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [type, setType] = useState('client');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [showMatches, setShowMatches] = useState(false);
  const [showMessaging, setShowMessaging] = useState(false);
  const [showSantiago, setShowSantiago] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showEmma, setShowEmma] = useState(false);
  const [showMealIdeas, setShowMealIdeas] = useState(false);
  const [showFoodTracker, setShowFoodTracker] = useState(false);
  const [showPTTools, setShowPTTools] = useState(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showSessionBooking, setShowSessionBooking] = useState(false);
  const [showPTBookings, setShowPTBookings] = useState(false);

  useEffect(() => {
    if (window.location.pathname === '/privacy-policy') setShowPrivacyPolicy(true);
    if (window.location.pathname === '/terms') setShowTerms(true);

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setCheckingAuth(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const openPrivacyPolicy = () => {
    window.history.pushState({}, '', '/privacy-policy');
    setShowPrivacyPolicy(true);
  };

  const openTerms = () => {
    window.history.pushState({}, '', '/terms');
    setShowTerms(true);
  };

  const closePrivacyPolicy = () => {
    window.history.pushState({}, '', '/');
    setShowPrivacyPolicy(false);
  };

  const closeTerms = () => {
    window.history.pushState({}, '', '/');
    setShowTerms(false);
  };

  const handleSubmit = async () => {
    if (!name || !email) return;
    setLoading(true);
    try {
      const { error } = await supabase
        .from('waiting_list')
        .insert([{ name, email, type }]);
      if (error) console.error('Supabase error:', error);
      setSubmitted(true);
    } catch (err) {
      console.error('Error:', err);
      setSubmitted(true);
    }
    setLoading(false);
  };

  if (showIntro) return (
    <div style={{
      backgroundColor: '#000', minHeight: '100vh',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden', opacity: fadeOut ? 0 : 1,
      transition: 'opacity 1.5s ease'
    }}>
      <img
        src={process.env.PUBLIC_URL + '/logo.jpg'}
        alt="EmergeU"
        style={{ height: '200px', borderRadius: '24px', boxShadow: '0 0 80px rgba(255,107,0,0.5)' }}
      />
      <p style={{
        color: '#FF6B00', fontSize: '22px', fontWeight: 'bold',
        letterSpacing: '4px', marginTop: '30px', fontFamily: 'Arial, sans-serif'
      }}>BECOME UNRECOGNISABLE</p>
      {setTimeout(() => {
        setFadeOut(true);
        setTimeout(() => setShowIntro(false), 1500);
      }, 2500) && null}
    </div>
  );

  if (checkingAuth) return (
    <div style={{
      backgroundColor: '#0a0a0a', minHeight: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{ color: '#FF6B00', fontSize: '24px' }}>Loading EmergeU...</div>
    </div>
  );

  if (showPrivacyPolicy) return <PrivacyPolicy onBack={closePrivacyPolicy} />;
  if (showTerms) return <TermsAndConditions onBack={closeTerms} />;
  if (showSessionBooking) return <SessionBooking user={user} onBack={() => setShowSessionBooking(false)} />;
  if (showPTBookings) return <PTBookings user={user} onBack={() => setShowPTBookings(false)} />;
  if (showChat) return <AiChat onComplete={() => { setShowChat(false); setShowMatches(true); }} />;
  if (showMatches) return <MatchResults user={user} onBack={() => setShowMatches(false)} />;
  if (showPTProfile) return <PTProfile user={user} onComplete={() => setShowPTProfile(false)} />;
  if (showAdmin) return <AdminDashboard user={user} onExit={() => setShowAdmin(false)} />;
  if (showMessaging) return <Messaging user={user} onBack={() => setShowMessaging(false)} />;
  if (showSantiago) return <Santiago user={user} onBack={() => setShowSantiago(false)} />;
  if (showEmma) return <Emma user={user} onBack={() => setShowEmma(false)} />;
  if (showMealIdeas) return <MealIdeas user={user} onBack={() => setShowMealIdeas(false)} />;
  if (showFoodTracker) return <FoodTracker user={user} onBack={() => setShowFoodTracker(false)} />;
  if (showPTTools) return <PTTools user={user} onBack={() => setShowPTTools(false)} />;
  if (showSuccess) return <Success user={user} onContinue={() => { setShowSuccess(false); setShowSantiago(true); }} />;
  if (user) return <Dashboard
    user={user}
    onStartChat={() => setShowChat(true)}
    onBuildProfile={() => setShowPTProfile(true)}
    onOpenAdmin={() => setShowAdmin(true)}
    onOpenMessaging={() => setShowMessaging(true)}
    onOpenSantiago={() => setShowSantiago(true)}
    onOpenEmma={() => setShowEmma(true)}
    onOpenMealIdeas={() => setShowMealIdeas(true)}
    onOpenFoodTracker={() => setShowFoodTracker(true)}
    onOpenPTTools={() => setShowPTTools(true)}
    onOpenSessionBooking={() => setShowSessionBooking(true)}
    onOpenPTBookings={() => setShowPTBookings(true)}
  />;

  if (showForm && authMode === 'login') return <Login onSwitch={() => setAuthMode('signup')} />;
  if (showForm && authMode === 'signup') return <Signup onSwitch={() => setAuthMode('login')} />;

  return (
    <div style={{ backgroundColor: '#0a0a0a', minHeight: '100vh', fontFamily: 'Arial, sans-serif', color: 'white' }}>

      {/* Navigation */}
      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '20px 40px', borderBottom: '1px solid #222', position: 'fixed',
        top: 0, width: '100%', backgroundColor: 'rgba(0,0,0,0.8)',
        backdropFilter: 'blur(10px)', zIndex: 100, boxSizing: 'border-box'
      }}>
        <img src={process.env.PUBLIC_URL + '/logo.jpg'} alt="EmergeU" style={{ height: '70px', borderRadius: '8px' }} />
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => { setShowForm(true); setAuthMode('login'); }} style={{
            backgroundColor: 'transparent', color: 'white', border: '2px solid #FF6B00',
            padding: '10px 20px', borderRadius: '25px', cursor: 'pointer',
            fontSize: '15px', fontWeight: 'bold'
          }}>Sign In</button>
          <button onClick={() => { setShowForm(true); setAuthMode('signup'); }} style={{
            backgroundColor: '#FF6B00', color: 'white', border: 'none',
            padding: '10px 20px', borderRadius: '25px', cursor: 'pointer',
            fontSize: '15px', fontWeight: 'bold'
          }}>Join Waiting List</button>
        </div>
      </nav>

      {/* Hero Section */}
      <div style={{
        position: 'relative', minHeight: '100vh', display: 'flex',
        flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '0 20px', overflow: 'hidden',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a0a00 50%, #0a0a0a 100%)'
      }}>
        <div style={{ position: 'relative', zIndex: 2, marginTop: '80px' }}>
          <img src={process.env.PUBLIC_URL + '/logo.jpg'} alt="EmergeU"
            style={{ height: '150px', borderRadius: '20px', marginBottom: '30px', boxShadow: '0 0 40px rgba(255,107,0,0.3)' }} />
          <h1 style={{ fontSize: '64px', fontWeight: 'bold', margin: '0 0 20px 0', lineHeight: '1.1' }}>
            Find Your Perfect <span style={{ color: '#FF6B00' }}>Personal Trainer</span>
          </h1>
          <p style={{ fontSize: '22px', color: '#ccc', maxWidth: '600px', lineHeight: '1.6', margin: '0 auto 40px auto', textAlign: 'center' }}>
            AI powered matching that connects you with the right PT based on your goals, personality and lifestyle. Online, hybrid or in person.
          </p>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '20px' }}>
            <button onClick={() => { setShowForm(true); setAuthMode('signup'); }} style={{
              backgroundColor: '#FF6B00', color: 'white', border: 'none',
              padding: '16px 40px', borderRadius: '30px', cursor: 'pointer', fontSize: '18px', fontWeight: 'bold'
            }}>Find My PT</button>
            <button onClick={() => { setShowForm(true); setAuthMode('signup'); }} style={{
              backgroundColor: 'transparent', color: 'white', border: '2px solid #FF6B00',
              padding: '16px 40px', borderRadius: '30px', cursor: 'pointer', fontSize: '18px', fontWeight: 'bold'
            }}>Join As A PT</button>
          </div>
          <p style={{ color: '#FF6B00', marginTop: '40px', fontSize: '20px', fontWeight: 'bold', letterSpacing: '3px' }}>
            BECOME UNRECOGNISABLE
          </p>
        </div>
      </div>

      {/* Problem Section */}
      <div style={{ padding: '80px 40px', textAlign: 'center', borderTop: '1px solid #222' }}>
        <h2 style={{ fontSize: '42px', fontWeight: 'bold', marginBottom: '20px' }}>
          Finding the right PT is <span style={{ color: '#FF6B00' }}>broken</span>
        </h2>
        <p style={{ fontSize: '18px', color: '#888', maxWidth: '650px', margin: '0 auto 50px', lineHeight: '1.8' }}>
          Most people either pick the cheapest option, whoever is nearest, or just give up entirely. The wrong PT means wasted money, zero results and lost motivation. You deserve better than that.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', flexWrap: 'wrap' }}>
          {[
            { icon: '😤', problem: 'Generic training plans that ignore your goals' },
            { icon: '💸', problem: 'Paying for sessions with no real results' },
            { icon: '🤷', problem: 'No idea how to find a PT you can trust' },
            { icon: '❌', problem: 'Personality clashes that kill motivation' }
          ].map((item, i) => (
            <div key={i} style={{
              backgroundColor: '#111', border: '1px solid #222', borderRadius: '16px',
              padding: '30px', width: '200px', textAlign: 'center'
            }}>
              <div style={{ fontSize: '40px', marginBottom: '16px' }}>{item.icon}</div>
              <p style={{ color: '#888', lineHeight: '1.5', margin: 0 }}>{item.problem}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Solution Section */}
      <div style={{ padding: '80px 40px', textAlign: 'center', background: 'linear-gradient(180deg, #0a0a0a 0%, #1a0a00 50%, #0a0a0a 100%)' }}>
        <h2 style={{ fontSize: '42px', fontWeight: 'bold', marginBottom: '20px' }}>
          EmergeU <span style={{ color: '#FF6B00' }}>fixes that</span>
        </h2>
        <p style={{ fontSize: '18px', color: '#888', maxWidth: '650px', margin: '0 auto 20px', lineHeight: '1.8' }}>
          Our AI gets to know you — your goals, your personality, your lifestyle and your budget. Then it matches you with the perfect PT. Not just any PT. YOUR PT.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', flexWrap: 'wrap' }}>
          {[
            { icon: '🤖', title: 'AI Matching', desc: 'Smart matching based on your goals, personality and budget' },
            { icon: '💪', title: 'Expert Trainers', desc: 'Every PT is vetted and approved before joining EmergeU' },
            { icon: '📍', title: 'Online or In Person', desc: 'Train online, hybrid or find a local PT near you' },
            { icon: '🚀', title: 'Transform', desc: 'Real results from real trainers who care about your journey' }
          ].map((feature, i) => (
            <div key={i} style={{
              backgroundColor: '#111', border: '1px solid #333', borderRadius: '16px',
              padding: '30px', width: '220px', textAlign: 'center'
            }}>
              <div style={{ fontSize: '40px', marginBottom: '16px' }}>{feature.icon}</div>
              <h3 style={{ color: '#FF6B00', marginBottom: '10px' }}>{feature.title}</h3>
              <p style={{ color: '#888', lineHeight: '1.5', margin: 0 }}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div style={{ padding: '80px 40px', textAlign: 'center', borderTop: '1px solid #222' }}>
        <h2 style={{ fontSize: '42px', fontWeight: 'bold', marginBottom: '60px' }}>
          How <span style={{ color: '#FF6B00' }}>EmergeU</span> works
        </h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', flexWrap: 'wrap' }}>
          {[
            { step: '01', title: 'Tell us about you', desc: 'Our AI has a conversation with you about your goals, lifestyle, personality and budget. No boring forms.' },
            { step: '02', title: 'Meet your matches', desc: 'We show you your top 3 PT matches with a clear explanation of why each one is right for you.' },
            { step: '03', title: 'Start your journey', desc: 'Choose your PT, pick your plan and begin your transformation. Everything happens inside EmergeU.' }
          ].map((item, i) => (
            <div key={i} style={{
              backgroundColor: '#111', border: '1px solid #222', borderRadius: '16px',
              padding: '40px 30px', width: '260px', textAlign: 'center'
            }}>
              <div style={{ fontSize: '48px', fontWeight: 'bold', color: 'rgba(255,107,0,0.3)', marginBottom: '16px' }}>{item.step}</div>
              <h3 style={{ color: '#FF6B00', marginBottom: '12px', fontSize: '20px' }}>{item.title}</h3>
              <p style={{ color: '#888', lineHeight: '1.6', margin: 0 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* For PTs Section */}
      <div style={{ padding: '80px 40px', textAlign: 'center', background: 'linear-gradient(180deg, #0a0a0a 0%, #1a0a00 50%, #0a0a0a 100%)', borderTop: '1px solid #222' }}>
        <h2 style={{ fontSize: '42px', fontWeight: 'bold', marginBottom: '20px' }}>
          Are you a <span style={{ color: '#FF6B00' }}>Personal Trainer?</span>
        </h2>
        <p style={{ fontSize: '18px', color: '#888', maxWidth: '650px', margin: '0 auto 50px', lineHeight: '1.8' }}>
          Stop chasing clients. EmergeU brings motivated, matched clients directly to you. Build your reputation, grow your business and get paid — all in one place.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', flexWrap: 'wrap', marginBottom: '50px' }}>
          {[
            { icon: '📲', title: 'Clients come to you', desc: 'Our AI matches you with clients who are the perfect fit for your style and specialisms' },
            { icon: '💰', title: 'Transparent earnings', desc: 'Know exactly what you earn. Weekly payouts, zero surprises, no hidden fees' },
            { icon: '⭐', title: 'Build your reputation', desc: 'Verified reviews from real clients help you stand out and grow faster' },
            { icon: '🌍', title: 'Work from anywhere', desc: 'Online, in person or hybrid — you choose how you work and where' }
          ].map((feature, i) => (
            <div key={i} style={{
              backgroundColor: '#111', border: '1px solid #333', borderRadius: '16px',
              padding: '30px', width: '220px', textAlign: 'center'
            }}>
              <div style={{ fontSize: '40px', marginBottom: '16px' }}>{feature.icon}</div>
              <h3 style={{ color: '#FF6B00', marginBottom: '10px' }}>{feature.title}</h3>
              <p style={{ color: '#888', lineHeight: '1.5', margin: 0 }}>{feature.desc}</p>
            </div>
          ))}
        </div>
        <button onClick={() => { setShowForm(true); setAuthMode('signup'); }} style={{
          backgroundColor: '#FF6B00', color: 'white', border: 'none',
          padding: '16px 40px', borderRadius: '30px', cursor: 'pointer', fontSize: '18px', fontWeight: 'bold'
        }}>Join As A PT 💪🏼</button>
      </div>

      {/* Final CTA */}
      <div style={{ padding: '80px 40px', textAlign: 'center', borderTop: '1px solid #222' }}>
        <h2 style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '20px' }}>
          Ready to become <span style={{ color: '#FF6B00' }}>Unrecognisable?</span>
        </h2>
        <p style={{ fontSize: '18px', color: '#888', maxWidth: '500px', margin: '0 auto 40px', lineHeight: '1.8' }}>
          Join the waiting list today. Be first to access EmergeU when we launch and start your transformation journey.
        </p>
        <button onClick={() => { setShowForm(true); setAuthMode('signup'); }} style={{
          backgroundColor: '#FF6B00', color: 'white', border: 'none',
          padding: '20px 60px', borderRadius: '30px', cursor: 'pointer', fontSize: '22px', fontWeight: 'bold'
        }}>Join the Waiting List 🔥</button>
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', padding: '30px 20px', borderTop: '1px solid #222', color: '#555' }}>
        <p style={{ marginBottom: '12px' }}>© 2026 EmergeU — Become Unrecognisable</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', flexWrap: 'wrap' }}>
          <button onClick={openPrivacyPolicy} style={{
            backgroundColor: 'transparent', color: '#555', border: 'none',
            cursor: 'pointer', fontSize: '13px', textDecoration: 'underline'
          }}>Privacy Policy</button>
          <button onClick={openTerms} style={{
            backgroundColor: 'transparent', color: '#555', border: 'none',
            cursor: 'pointer', fontSize: '13px', textDecoration: 'underline'
          }}>Terms & Conditions</button>
          <a href="mailto:emergeu@emergeu.co.uk" style={{ color: '#555', fontSize: '13px' }}>
            emergeu@emergeu.co.uk
          </a>
        </div>
      </div>

      <CookieBanner onOpenPrivacy={openPrivacyPolicy} />
    </div>
  );
}

export default App;