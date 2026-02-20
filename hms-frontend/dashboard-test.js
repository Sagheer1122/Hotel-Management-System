// Quick diagnostic test for the dashboard
console.log('=== DASHBOARD DIAGNOSTIC TEST ===');

// Test 1: Check if user is logged in
const user = JSON.parse(localStorage.getItem('user') || 'null');
console.log('1. User from localStorage:', user);

if (!user) {
    console.error('❌ No user found in localStorage - you need to login first!');
} else {
    console.log('✅ User found:', user.username, 'ID:', user.id);

    // Test 2: Try to fetch bookings
    console.log('2. Attempting to fetch bookings for user:', user.id);

    fetch(`http://localhost:3000/api/v1/bookings?user_id=${user.id}`, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
        .then(response => {
            console.log('3. Response status:', response.status);
            console.log('3. Response headers:', Object.fromEntries(response.headers.entries()));
            return response.text();
        })
        .then(text => {
            console.log('4. Raw response:', text);
            try {
                const data = JSON.parse(text);
                console.log('✅ Parsed JSON data:', data);
                console.log('✅ Number of bookings:', Array.isArray(data) ? data.length : 'Not an array!');
            } catch (e) {
                console.error('❌ Failed to parse JSON:', e.message);
                console.error('Response was:', text);
            }
        })
        .catch(error => {
            console.error('❌ Network error:', error);
        });
}
