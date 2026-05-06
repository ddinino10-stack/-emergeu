import { useState } from 'react';
import { supabase } from './supabase';

function PTProfile({ user, onComplete }) {
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [profile, setProfile] = useState({
    name: user?.user_metadata?.name || '',
    bio: '',
    specialisms: [],
    location: '',
    training_type: '',
    pricing_tier: '',
    coaching_style: '',
    availability: ''
  });

  const specialismOptions = [
    'Weight Loss', 'Muscle Building', 'Strength Training',
    'Cardio & Endurance', 'Sports Specific', 'Rehabilitation',
    'Nutrition Coaching', 'HIIT', 'Yoga & Flexibility', 'Senior Fitness'
  ];

  const toggleSpecialism = (item) => {
    setProfile(prev => ({
      ...prev,
      specialisms: prev.specialisms.includes(item)
        ? prev.specialisms.filter(s => s !== item)
        : [...prev.specialisms, item]
    }));
  };

  const handleSave = async () => {
    if (!profile.name || !profile.bio || !profile.location) return;
    setLoading(true);
    try {
      const { error } = await supabase
        .from('pt_profiles')
        .upsert([{
          user_id: user.id,
          name: profile.name,
          bio: profile.bio,
          specialisms: profile.specialisms.join(', '),
          location: profile.location,
          training_type: profile.training_type,
          pricing_tier: profile.pricing_tier,
          coaching_style: profile.coaching_style,
          availability: profile.availability,
          approved: false
        }]);
      if (error) console.error(error);
      else setSaved(true);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const inputStyle = {
    width: '100%', padding: '14px', borderRadius: '12px',
    border: '1px solid #333', backgroundColor: '#1a1a1a',
    color: 'white', fontSize: '16px', marginBottom: '16px',
    boxSizing: 'border-box', outline: 'none'
  };

  const labelStyle = {
    color: '#888', fontSize: '14px', marginBottom: '8px', display: 'block'
  };

  return (
    <div style={{
      backgroundColor: '#0a0a0a', minHeight: '100vh',
      fontFamily: 'Arial, sans-serif', color: 'white'
    }}>
      {/* Header */}
      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '20px 40px', borderBottom: '1px solid #222',
        backgroundColor: 'rgba(0,0,0,0.8)'
      }}>
        <img src={process.env.PUBLIC_URL + '/logo.jpg'} alt="EmergeU"
          style={{ height: '50px', borderRadius: '8px' }} />
        <button onClick={onComplete} style={{
          backgroundColor: 'transparent', color: '#888',
          border: '1px solid #333', padding: '8px 16px',
          borderRadius: '20px', cursor: 'pointer', fontSize: '13px'
        }}>Back to Dashboard</button>
      </nav>

      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '40px 20px' }}>

        {saved ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: '60px', marginBottom: '20px' }}>🎉</div>
            <h2 style={{ color: '#FF6B00', marginBottom: '16px' }}>Profile Submitted!</h2>
            <p style={{ color: '#888', marginBottom: '30px', lineHeight: '1.8' }}>
              Your PT profile has been submitted for review. EmergeU's team will approve it within 24 hours and you'll start receiving matched clients! 💪🏼
            </p>
            <button onClick={onComplete} style={{
              backgroundColor: '#FF6B00', color: 'white', border: 'none',
              padding: '14px 30px', borderRadius: '25px', cursor: 'pointer',
              fontSize: '16px', fontWeight: 'bold'
            }}>Back to Dashboard 🚀</button>
          </div>
        ) : (
          <>
            <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px' }}>
              Build Your <span style={{ color: '#FF6B00' }}>PT Profile</span>
            </h1>
            <p style={{ color: '#888', marginBottom: '40px' }}>
              This is what clients will see when they're matched with you
            </p>

            {/* Name */}
            <label style={labelStyle}>Full Name *</label>
            <input
              type="text" placeholder="Your full name" value={profile.name}
              onChange={e => setProfile({ ...profile, name: e.target.value })}
              style={inputStyle}
            />

            {/* Bio */}
            <label style={labelStyle}>Your Bio * — Tell clients about yourself and your journey</label>
            <textarea
              placeholder="e.g. I lost 40kg myself and know exactly what it takes to transform. I specialise in weight loss and building sustainable habits..."
              value={profile.bio}
              onChange={e => setProfile({ ...profile, bio: e.target.value })}
              rows={4}
              style={{ ...inputStyle, resize: 'vertical', fontFamily: 'Arial' }}
            />

            {/* Location */}
            <label style={labelStyle}>Your Location *</label>
            <input
              type="text" placeholder="e.g. London, Manchester, Birmingham"
              value={profile.location}
              onChange={e => setProfile({ ...profile, location: e.target.value })}
              style={inputStyle}
            />

            {/* Specialisms */}
            <label style={labelStyle}>Your Specialisms — Select all that apply</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '24px' }}>
              {specialismOptions.map((item, i) => (
                <button key={i} onClick={() => toggleSpecialism(item)} style={{
                  padding: '8px 16px', borderRadius: '20px', cursor: 'pointer',
                  border: `2px solid ${profile.specialisms.includes(item) ? '#FF6B00' : '#333'}`,
                  backgroundColor: profile.specialisms.includes(item) ? 'rgba(255,107,0,0.1)' : 'transparent',
                  color: profile.specialisms.includes(item) ? '#FF6B00' : '#888',
                  fontSize: '14px', fontWeight: 'bold'
                }}>{item}</button>
              ))}
            </div>

            {/* Training Type */}
            <label style={labelStyle}>How do you train clients?</label>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
              {['Online', 'In Person', 'Hybrid'].map((type, i) => (
                <button key={i} onClick={() => setProfile({ ...profile, training_type: type })} style={{
                  flex: 1, padding: '12px', borderRadius: '12px', cursor: 'pointer',
                  border: `2px solid ${profile.training_type === type ? '#FF6B00' : '#333'}`,
                  backgroundColor: profile.training_type === type ? 'rgba(255,107,0,0.1)' : 'transparent',
                  color: profile.training_type === type ? '#FF6B00' : '#888',
                  fontSize: '15px', fontWeight: 'bold', minWidth: '100px'
                }}>{type}</button>
              ))}
            </div>

            {/* Coaching Style */}
            <label style={labelStyle}>Your Coaching Style</label>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
              {['Tough Love 💪', 'Encouraging 🌟', 'Mix of Both ⚡'].map((style, i) => (
                <button key={i} onClick={() => setProfile({ ...profile, coaching_style: style })} style={{
                  flex: 1, padding: '12px', borderRadius: '12px', cursor: 'pointer',
                  border: `2px solid ${profile.coaching_style === style ? '#FF6B00' : '#333'}`,
                  backgroundColor: profile.coaching_style === style ? 'rgba(255,107,0,0.1)' : 'transparent',
                  color: profile.coaching_style === style ? '#FF6B00' : '#888',
                  fontSize: '14px', fontWeight: 'bold', minWidth: '100px'
                }}>{style}</button>
              ))}
            </div>

            {/* Pricing Tier */}
            <label style={labelStyle}>Your Monthly Pricing</label>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
              {['£49-£79', '£99-£149', '£149-£249'].map((price, i) => (
                <button key={i} onClick={() => setProfile({ ...profile, pricing_tier: price })} style={{
                  flex: 1, padding: '12px', borderRadius: '12px', cursor: 'pointer',
                  border: `2px solid ${profile.pricing_tier === price ? '#FF6B00' : '#333'}`,
                  backgroundColor: profile.pricing_tier === price ? 'rgba(255,107,0,0.1)' : 'transparent',
                  color: profile.pricing_tier === price ? '#FF6B00' : '#888',
                  fontSize: '15px', fontWeight: 'bold'
                }}>{price}</button>
              ))}
            </div>

            {/* Availability */}
            <label style={labelStyle}>Your Availability</label>
            <input
              type="text"
              placeholder="e.g. Weekdays 6am-8pm, Weekends 9am-2pm"
              value={profile.availability}
              onChange={e => setProfile({ ...profile, availability: e.target.value })}
              style={inputStyle}
            />

            {/* Submit */}
            <button
              onClick={handleSave} disabled={loading}
              style={{
                width: '100%', padding: '18px', borderRadius: '12px', border: 'none',
                backgroundColor: '#FF6B00', color: 'white', fontSize: '18px',
                fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1, marginTop: '10px'
              }}>
              {loading ? 'Submitting...' : 'Submit Profile for Review 🚀'}
            </button>

            <p style={{ color: '#555', textAlign: 'center', marginTop: '16px', fontSize: '13px' }}>
              Your profile will be reviewed by EmergeU before going live — usually within 24 hours
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default PTProfile;