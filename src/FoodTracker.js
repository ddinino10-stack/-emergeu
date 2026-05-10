/* eslint-disable */
import { useState, useEffect, useRef } from 'react';
import { supabase } from './supabase';
import BarcodeScanner from './BarcodeScanner';

function FoodTracker({ user, onBack }) {
  const [activeTab, setActiveTab] = useState('diary');
  const [foodLogs, setFoodLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState('breakfast');  const [manualFood, setManualFood] = useState({ name: '', calories: '', protein: '', carbs: '', fat: '' });
  const [showManual, setShowManual] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [todayStats, setTodayStats] = useState({ calories: 0, protein: 0, carbs: 0, fat: 0 });
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    fetchTodayLogs();
  }, []);

  const fetchTodayLogs = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('food_logs')
      .select('*')
      .eq('user_id', user?.id)
      .eq('logged_date', today)
      .order('created_at', { ascending: true });
    if (data) {
      setFoodLogs(data);
      calculateStats(data);
    }
    setLoading(false);
  };

  const calculateStats = (logs) => {
    const stats = logs.reduce((acc, log) => ({
      calories: acc.calories + (log.calories || 0),
      protein: acc.protein + (log.protein || 0),
      carbs: acc.carbs + (log.carbs || 0),
      fat: acc.fat + (log.fat || 0)
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
    setTodayStats(stats);
  };

  const searchFood = async () => {
    if (!searchQuery.trim()) return;
    setSearching(true);
    try {
      const response = await fetch(
        `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(searchQuery)}&search_simple=1&action=process&json=1&page_size=5`
      );
      const data = await response.json();
      const products = data.products?.filter(p => p.product_name && p.nutriments) || [];
      setSearchResults(products);
    } catch (err) {
      console.error(err);
    }
    setSearching(false);
  };

  const addFood = async (product) => {
    console.log('Adding food:', product.product_name);
    console.log('Meal type:', selectedMeal);
    console.log('User:', user?.id);
    const nutriments = product.nutriments || {};
    const entry = {
      user_id: user?.id,
      food_name: product.product_name || 'Unknown food',
      calories: Math.round(nutriments['energy-kcal_100g'] || nutriments['energy-kcal'] || 0),
      protein: Math.round((nutriments.proteins_100g || 0) * 10) / 10,
      carbs: Math.round((nutriments.carbohydrates_100g || 0) * 10) / 10,
      fat: Math.round((nutriments.fat_100g || 0) * 10) / 10,
      quantity: 100,
      meal_type: selectedMeal,
      logged_date: today,
      created_at: new Date().toISOString()
    };
    await supabase.from('food_logs').insert([entry]);
    setSearchResults([]);
    setSearchQuery('');
    fetchTodayLogs();
    setActiveTab('diary');
  };

  const addManualFood = async () => {
    if (!manualFood.name || !manualFood.calories) return;
    const entry = {
      user_id: user?.id,
      food_name: manualFood.name,
      calories: parseInt(manualFood.calories) || 0,
      protein: parseFloat(manualFood.protein) || 0,
      carbs: parseFloat(manualFood.carbs) || 0,
      fat: parseFloat(manualFood.fat) || 0,
      quantity: 100,
      meal_type: selectedMeal,
      logged_date: today,
      created_at: new Date().toISOString()
    };
    await supabase.from('food_logs').insert([entry]);
    setManualFood({ name: '', calories: '', protein: '', carbs: '', fat: '' });
    setShowManual(false);
    fetchTodayLogs();
    setActiveTab('diary');
  };

  const deleteFood = async (id) => {
    await supabase.from('food_logs').delete().eq('id', id);
    fetchTodayLogs();
  };

  const getMealLogs = (mealType) => foodLogs.filter(log => log.meal_type === mealType);

  const inputStyle = {
    width: '100%', padding: '12px', borderRadius: '10px',
    border: '1px solid #333', backgroundColor: '#1a1a1a',
    color: 'white', fontSize: '15px', marginBottom: '12px',
    boxSizing: 'border-box'
  };

  const tabStyle = (tab) => ({
    flex: 1, padding: '12px', cursor: 'pointer', fontWeight: 'bold',
    fontSize: '14px', border: 'none',
    borderBottom: `3px solid ${activeTab === tab ? '#FF6B00' : 'transparent'}`,
    backgroundColor: 'transparent',
    color: activeTab === tab ? '#FF6B00' : '#888'
  });

  return (
    <div style={{
      backgroundColor: '#0a0a0a', minHeight: '100vh',
      fontFamily: 'Arial, sans-serif', color: 'white'
    }}>

      {/* Header */}
      <nav style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '20px 30px', borderBottom: '1px solid #222',
        backgroundColor: 'rgba(0,0,0,0.8)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <img src={process.env.PUBLIC_URL + '/logo.jpg'} alt="EmergeU"
            style={{ height: '45px', borderRadius: '8px' }} />
          <div>
            <h3 style={{ color: 'white', margin: 0 }}>Food Tracker</h3>
            <p style={{ color: '#FF6B00', margin: 0, fontSize: '13px' }}>
              {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
          </div>
        </div>
        <button onClick={onBack} style={{
          backgroundColor: 'transparent', color: '#888',
          border: '1px solid #333', padding: '8px 16px',
          borderRadius: '20px', cursor: 'pointer', fontSize: '13px'
        }}>Back</button>
      </nav>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid #222', padding: '0 20px' }}>
        <button style={tabStyle('diary')} onClick={() => setActiveTab('diary')}>📋 Today's Diary</button>
        <button style={tabStyle('add')} onClick={() => setActiveTab('add')}>➕ Add Food</button>
        <button style={tabStyle('stats')} onClick={() => setActiveTab('stats')}>📊 Nutrition</button>
      </div>

      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '30px 20px' }}>

        {/* DIARY TAB */}
        {activeTab === 'diary' && (
          <div>
            <div style={{
              backgroundColor: '#111', border: '1px solid #FF6B00',
              borderRadius: '20px', padding: '24px', marginBottom: '30px'
            }}>
              <h3 style={{ color: '#FF6B00', margin: '0 0 20px 0' }}>Today's Summary</h3>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                {[
                  { label: 'Calories', value: Math.round(todayStats.calories), unit: 'kcal', color: '#FF6B00' },
                  { label: 'Protein', value: Math.round(todayStats.protein), unit: 'g', color: '#00ff88' },
                  { label: 'Carbs', value: Math.round(todayStats.carbs), unit: 'g', color: '#4488ff' },
                  { label: 'Fat', value: Math.round(todayStats.fat), unit: 'g', color: '#ffaa00' }
                ].map((stat, i) => (
                  <div key={i} style={{
                    flex: 1, minWidth: '80px', backgroundColor: '#1a1a1a',
                    borderRadius: '12px', padding: '16px', textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', color: stat.color }}>{stat.value}</div>
                    <div style={{ color: '#555', fontSize: '12px' }}>{stat.unit}</div>
                    <div style={{ color: '#888', fontSize: '12px', marginTop: '4px' }}>{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {['breakfast', 'lunch', 'dinner', 'snacks'].map((meal, i) => (
              <div key={i} style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h4 style={{ color: 'white', margin: 0, textTransform: 'capitalize', fontSize: '16px' }}>
                    {meal === 'breakfast' ? '🌅' : meal === 'lunch' ? '☀️' : meal === 'dinner' ? '🌙' : '🍎'} {meal}
                  </h4>
                  <span style={{ color: '#555', fontSize: '13px' }}>
                    {getMealLogs(meal).reduce((acc, log) => acc + (log.calories || 0), 0)} kcal
                  </span>
                </div>
                {getMealLogs(meal).length === 0 ? (
                  <div style={{
                    backgroundColor: '#111', border: '1px dashed #333',
                    borderRadius: '12px', padding: '16px', textAlign: 'center'
                  }}>
                    <p style={{ color: '#555', margin: 0, fontSize: '14px' }}>Nothing logged yet</p>
                  </div>
                ) : (
                  getMealLogs(meal).map((log, j) => (
                    <div key={j} style={{
                      backgroundColor: '#111', border: '1px solid #222',
                      borderRadius: '12px', padding: '14px 16px', marginBottom: '8px',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                    }}>
                      <div>
                        <p style={{ color: 'white', margin: '0 0 4px 0', fontWeight: 'bold', fontSize: '14px' }}>
                          {log.food_name}
                        </p>
                        <p style={{ color: '#555', margin: 0, fontSize: '12px' }}>
                          P: {log.protein}g | C: {log.carbs}g | F: {log.fat}g
                        </p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ color: '#FF6B00', fontWeight: 'bold' }}>{log.calories} kcal</span>
                        <button onClick={() => deleteFood(log.id)} style={{
                          backgroundColor: 'transparent', border: 'none',
                          color: '#555', cursor: 'pointer', fontSize: '16px'
                        }}>🗑️</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ))}

            <button onClick={() => setActiveTab('add')} style={{
              width: '100%', padding: '16px', borderRadius: '12px',
              border: 'none', backgroundColor: '#FF6B00', color: 'white',
              fontSize: '16px', fontWeight: 'bold', cursor: 'pointer'
            }}>+ Add Food 🍔</button>
          </div>
        )}

        {/* ADD FOOD TAB */}
        {activeTab === 'add' && (
          <div>
            <h2 style={{ marginBottom: '24px' }}>
              Add <span style={{ color: '#FF6B00' }}>Food</span>
            </h2>

            <label style={{ color: '#888', fontSize: '14px', display: 'block', marginBottom: '8px' }}>
              Which meal? 🍽️
            </label>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', flexWrap: 'wrap' }}>
              {['breakfast', 'lunch', 'dinner', 'snacks'].map((meal, i) => (
                <button key={i} onClick={() => setSelectedMeal(meal)} style={{
                  padding: '10px 16px', borderRadius: '20px', cursor: 'pointer',
                  border: `2px solid ${selectedMeal === meal ? '#FF6B00' : '#333'}`,
                  backgroundColor: selectedMeal === meal ? 'rgba(255,107,0,0.1)' : 'transparent',
                  color: selectedMeal === meal ? '#FF6B00' : '#888',
                  fontSize: '14px', fontWeight: 'bold', textTransform: 'capitalize'
                }}>{meal}</button>
              ))}
            </div>

            {/* Barcode Scanner */}
            <div style={{
              backgroundColor: '#111', border: '1px solid #333',
              borderRadius: '16px', padding: '20px', marginBottom: '20px'
            }}>
              <h4 style={{ color: 'white', margin: '0 0 12px 0' }}>📱 Scan Barcode</h4>
              <p style={{ color: '#555', fontSize: '14px', margin: '0 0 16px 0' }}>
                Scan a product barcode to automatically get nutrition info
              </p>
              <button
                onClick={() => setShowScanner(true)}
                disabled={scanning}
                style={{
                  width: '100%', padding: '14px', borderRadius: '12px',
                  border: '2px solid #FF6B00', backgroundColor: 'transparent',
                  color: '#FF6B00', fontSize: '16px', fontWeight: 'bold',
                  cursor: scanning ? 'not-allowed' : 'pointer',
                  opacity: scanning ? 0.7 : 1
                }}>
                {scanning ? '🔍 Looking up product...' : '📷 Scan Barcode'}
              </button>
            </div>

            {/* Search */}
            <div style={{
              backgroundColor: '#111', border: '1px solid #333',
              borderRadius: '16px', padding: '20px', marginBottom: '20px'
            }}>
              <h4 style={{ color: 'white', margin: '0 0 12px 0' }}>🔍 Search Food</h4>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="text" placeholder="Search any food..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && searchFood()}
                  style={{ ...inputStyle, marginBottom: 0, flex: 1 }}
                />
                <button onClick={searchFood} disabled={searching} style={{
                  padding: '12px 20px', borderRadius: '10px', border: 'none',
                  backgroundColor: '#FF6B00', color: 'white', fontWeight: 'bold', cursor: 'pointer'
                }}>{searching ? '...' : 'Search'}</button>
              </div>

              {searchResults.length > 0 && (
                <div style={{ marginTop: '16px' }}>
                  {searchResults.map((product, i) => (
                    <div key={i} style={{
                      backgroundColor: '#1a1a1a', border: '1px solid #222',
                      borderRadius: '12px', padding: '14px', marginBottom: '8px',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                    }}>
                      <div>
                        <p style={{ color: 'white', margin: '0 0 4px 0', fontWeight: 'bold', fontSize: '14px' }}>
                          {product.product_name}
                        </p>
                        <p style={{ color: '#555', margin: 0, fontSize: '12px' }}>
                          {Math.round(product.nutriments?.['energy-kcal_100g'] || 0)} kcal per 100g
                          {' | '}P: {Math.round(product.nutriments?.proteins_100g || 0)}g
                          {' | '}C: {Math.round(product.nutriments?.carbohydrates_100g || 0)}g
                          {' | '}F: {Math.round(product.nutriments?.fat_100g || 0)}g
                        </p>
                      </div>
                      <button onClick={() => addFood(product)} style={{
                        backgroundColor: '#FF6B00', color: 'white', border: 'none',
                        padding: '8px 16px', borderRadius: '20px', cursor: 'pointer',
                        fontWeight: 'bold', fontSize: '13px', flexShrink: 0
                      }}>+ Add</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Manual Entry */}
            <div style={{
              backgroundColor: '#111', border: '1px solid #333',
              borderRadius: '16px', padding: '20px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h4 style={{ color: 'white', margin: 0 }}>✏️ Add Manually</h4>
                <button onClick={() => setShowManual(!showManual)} style={{
                  backgroundColor: 'transparent', color: '#FF6B00',
                  border: '1px solid #FF6B00', padding: '6px 14px',
                  borderRadius: '20px', cursor: 'pointer', fontSize: '13px'
                }}>{showManual ? 'Hide' : 'Show'}</button>
              </div>

              {showManual && (
                <>
                  <input type="text" placeholder="Food name *" value={manualFood.name}
                    onChange={e => setManualFood({ ...manualFood, name: e.target.value })}
                    style={inputStyle} />
                  <input type="number" placeholder="Calories (kcal) *" value={manualFood.calories}
                    onChange={e => setManualFood({ ...manualFood, calories: e.target.value })}
                    style={inputStyle} />
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <input type="number" placeholder="Protein (g)" value={manualFood.protein}
                      onChange={e => setManualFood({ ...manualFood, protein: e.target.value })}
                      style={{ ...inputStyle, flex: 1 }} />
                    <input type="number" placeholder="Carbs (g)" value={manualFood.carbs}
                      onChange={e => setManualFood({ ...manualFood, carbs: e.target.value })}
                      style={{ ...inputStyle, flex: 1 }} />
                    <input type="number" placeholder="Fat (g)" value={manualFood.fat}
                      onChange={e => setManualFood({ ...manualFood, fat: e.target.value })}
                      style={{ ...inputStyle, flex: 1 }} />
                  </div>
                  <button onClick={addManualFood} style={{
                    width: '100%', padding: '14px', borderRadius: '12px',
                    border: 'none', backgroundColor: '#FF6B00', color: 'white',
                    fontSize: '16px', fontWeight: 'bold', cursor: 'pointer'
                  }}>Add Food ✅</button>
                </>
              )}
            </div>
          </div>
        )}

        {/* STATS TAB */}
        {activeTab === 'stats' && (
          <div>
            <h2 style={{ marginBottom: '30px' }}>
              Today's <span style={{ color: '#FF6B00' }}>Nutrition</span>
            </h2>
            {[
              { label: 'Calories', value: Math.round(todayStats.calories), target: 2000, unit: 'kcal', color: '#FF6B00' },
              { label: 'Protein', value: Math.round(todayStats.protein), target: 150, unit: 'g', color: '#00ff88' },
              { label: 'Carbohydrates', value: Math.round(todayStats.carbs), target: 250, unit: 'g', color: '#4488ff' },
              { label: 'Fat', value: Math.round(todayStats.fat), target: 65, unit: 'g', color: '#ffaa00' }
            ].map((stat, i) => (
              <div key={i} style={{
                backgroundColor: '#111', border: '1px solid #222',
                borderRadius: '16px', padding: '20px', marginBottom: '16px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ color: 'white', fontWeight: 'bold' }}>{stat.label}</span>
                  <span style={{ color: stat.color, fontWeight: 'bold' }}>
                    {stat.value} / {stat.target} {stat.unit}
                  </span>
                </div>
                <div style={{ backgroundColor: '#222', borderRadius: '10px', height: '10px', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', borderRadius: '10px', backgroundColor: stat.color,
                    width: `${Math.min((stat.value / stat.target) * 100, 100)}%`,
                    transition: 'width 0.5s ease'
                  }}></div>
                </div>
                <p style={{ color: '#555', fontSize: '12px', margin: '8px 0 0 0' }}>
                  {stat.target - stat.value > 0
                    ? `${stat.target - stat.value} ${stat.unit} remaining`
                    : `${stat.value - stat.target} ${stat.unit} over target`}
                </p>
              </div>
            ))}
            <div style={{
              backgroundColor: '#111', border: '1px solid #333',
              borderRadius: '16px', padding: '20px', marginTop: '10px'
            }}>
              <p style={{ color: '#888', margin: 0, fontSize: '14px', textAlign: 'center' }}>
                💡 Targets are based on general recommendations. Your PT can adjust these based on your specific goals.
              </p>
            </div>
          </div>
        )}

      </div>

      {/* Barcode Scanner Modal */}
      {showScanner && (
        <BarcodeScanner
          onResult={async (barcode) => {
            setShowScanner(false);
            setScanning(true);
            try {
              const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
              const data = await response.json();
              if (data.status === 1) {
                setSearchResults([data.product]);
                setActiveTab('add');
              } else {
                alert('Product not found. Try searching by name instead.');
              }
            } catch (err) {
              alert('Could not find product. Try searching by name.');
            }
            setScanning(false);
          }}
          onClose={() => setShowScanner(false)}
        />
      )}

    </div>
  );
}

export default FoodTracker;