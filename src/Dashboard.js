import { supabase } from './supabase';

function Dashboard({ user, onStartChat, onBuildProfile, onOpenAdmin, onOpenMessaging, onOpenSantiago, onOpenEmma, onOpenMealIdeas }) {
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const userType = user?.user_metadata?.type || 'client';
  const userName = user?.user_metadata?.name || 'there';

  return (
    <div style={{
      backgroundColor: '#0a0a0a', minHeight: '100vh',
      fontFamily: 'Arial, sans-serif', color: 'white'
    }}>
      {/* Nav */}
      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '20px 40px', borderBottom: '1px solid #222',
        backgroundColor: 'rgba(0,0,0,0.8)'
      }}>
        <img
          src={process.env.PUBLIC_URL + '/logo.jpg'}
          alt="EmergeU"
          style={{ height: '50px', borderRadius: '8px' }}
        />
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <span style={{ color: '#888' }}>
            {userType === 'pt' ? '💪 PT Account' : '👤 Client Account'}
          </span>
          {user?.id === '9406cb25-1185-4629-b1e8-f4cad9dcaa75' && (
            <button onClick={onOpenAdmin} style={{
              backgroundColor: '#FF6B00', color: 'white', border: 'none',
              padding: '10px 20px', borderRadius: '20px', cursor: 'pointer',
              fontWeight: 'bold', fontSize: '14px'
            }}>⚙️ Admin</button>
          )}
          <button onClick={handleLogout} style={{
            backgroundColor: 'transparent', color: '#FF6B00',
            border: '2px solid #FF6B00', padding: '10px 20px',
            borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold'
          }}>Sign Out</button>
        </div>
      </nav>

      {/* Dashboard Content */}
      <div style={{ padding: '60px 40px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '42px', marginBottom: '16px' }}>
          Welcome, <span style={{ color: '#FF6B00' }}>{userName}!</span> 🔥
        </h1>
        <p style={{ color: '#888', fontSize: '18px', marginBottom: '60px' }}>
          {userType === 'pt'
            ? 'Your PT dashboard is being built. Check back soon!'
            : 'Your client dashboard is being built. Check back soon!'}
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
          {(userType === 'pt' ? [
            { icon: '👤', title: 'My Profile', desc: 'Build your PT profile', action: onBuildProfile },
            { icon: '👥', title: 'My Clients', desc: 'Coming soon' },
            { icon: '💰', title: 'Earnings', desc: 'Coming soon' },
            { icon: '⭐', title: 'Reviews', desc: 'Coming soon' },
            { icon: '🍔', title: 'Meal Ideas', desc: 'Generate meal ideas', action: onOpenMealIdeas }
          ] : [
            { icon: '🤖', title: 'Find My PT', desc: 'Start AI matching now!', action: onStartChat },
            { icon: '🏋️', title: 'Santiago AI PT', desc: 'Your 24/7 AI fitness coach', action: onOpenSantiago },
            { icon: '👩', title: 'Emma AI PT', desc: 'Your supportive AI coach', action: onOpenEmma },
            { icon: '🍔', title: 'Meal Ideas', desc: 'AI meal inspiration', action: onOpenMealIdeas },
            { icon: '📅', title: 'My Sessions', desc: 'Coming soon' },
            { icon: '📊', title: 'My Progress', desc: 'Coming soon' },
            { icon: '💬', title: 'Messages', desc: 'Chat with your PT', action: onOpenMessaging }

          ]).map((item, i) => (
            <div key={i} onClick={item.action || null} style={{
              backgroundColor: '#111', border: '1px solid #222',
              borderRadius: '16px', padding: '30px', width: '180px', textAlign: 'center',
              cursor: item.action ? 'pointer' : 'default'
            }}>
              <div style={{ fontSize: '36px', marginBottom: '12px' }}>{item.icon}</div>
              <h3 style={{ color: '#FF6B00', marginBottom: '8px', fontSize: '16px' }}>{item.title}</h3>
              <p style={{ color: '#555', margin: 0, fontSize: '13px' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;