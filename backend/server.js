require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
let supabase = null;
if (SUPABASE_URL && SUPABASE_KEY) {
  supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  console.log('Supabase client initialized');
} else {
  console.warn('Supabase not configured. Set SUPABASE_URL and SUPABASE_KEY in environment.');
}

app.post('/register', async (req, res) => {
  const { name, email, phone } = req.body;
  console.log('Received /register:', { name, email, phone });

  if (supabase) {
    try {
      // accept optional password field
      const password = req.body.password;
      const insertObj = { name, email, phone, created_at: new Date().toISOString() };
      if (password) insertObj.password = password;

      const { data, error } = await supabase
        .from('users')
        .insert([insertObj]);

      if (error) {
        console.error('Supabase insert error:', error);
        return res.status(500).json({ message: 'Registration received but failed to save to Supabase', error: error.message });
      }

      return res.json({ success: true, data });
    } catch (err) {
      console.error('Supabase error:', err);
      return res.status(500).json({ message: 'Registration received but Supabase error', error: err.message });
    }
  }

  // If Supabase isn't configured, still acknowledge receipt.
  return res.json({ message: 'User registered (Supabase not configured)' });
});

app.post('/driver-application', async (req, res) => {
  const application = req.body;
  console.log('Received /driver-application:', application && application.fullName ? { name: application.fullName, email: application.email } : application);

  if (supabase) {
    try {
        // normalize keys to snake_case to match typical DB column naming
        const toSnake = (str) => str.replace(/([A-Z])/g, '_$1').toLowerCase();
        const convertKeysToSnake = (obj) => {
          if (obj === null || typeof obj !== 'object' || Array.isArray(obj)) return obj;
          return Object.keys(obj).reduce((acc, key) => {
            const snakeKey = toSnake(key);
            const val = obj[key];
            acc[snakeKey] = convertKeysToSnake(val);
            return acc;
          }, {});
        };

        const insertObj = convertKeysToSnake(Object.assign({}, application, { created_at: new Date().toISOString() }));
        
        // Save to driver_applications table
        const { data, error } = await supabase
          .from('driver_applications')
          .insert([insertObj]);

        if (error) {
          console.error('Supabase insert error (driver_application):', error);
          return res.status(500).json({ message: 'Application received but failed to save to Supabase', error: error.message });
        }

        // Also update the users table with driver application data so profile queries work
        if (application.email) {
          const userUpdateObj = {
            full_name: application.fullName,
            phone: application.phone,
            address: application.address,
            date_of_birth: application.dateOfBirth,
            vehicle_type: application.vehicleType,
            vehicle_brand: application.vehicleBrand,
            vehicle_model: application.vehicleModel,
            license_plate: application.licensePlate,
            license_number: application.licenseNumber,
            updated_at: new Date().toISOString()
          };

          const { error: updateError } = await supabase
            .from('users')
            .update(userUpdateObj)
            .eq('email', application.email);

          if (updateError) {
            console.warn('Warning: Could not update users table:', updateError);
            // Don't fail the response, driver_applications was saved successfully
          } else {
            console.log('Successfully synced driver data to users table for', application.email);
          }
        }

        return res.json({ success: true, data });
    } catch (err) {
      console.error('Supabase error (driver_application):', err);
      return res.status(500).json({ message: 'Application received but Supabase error', error: err.message });
    }
  }

  return res.json({ message: 'Application received (Supabase not configured)' });
});

// Simple auth login endpoint — checks if a user exists in the Supabase `users` table.
app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body || {};
  console.log('Received /auth/login for', email);
  console.log('Login payload:', { email: email, passwordProvided: typeof password === 'string' });

  if (!supabase) {
    return res.status(500).json({ error: 'Auth not available' });
  }

  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .limit(1);

    if (error) {
      console.error('Supabase select error (auth):', error);
      return res.status(500).json({ error: 'Database error' });
    }

    if (!data || data.length === 0) {
      console.log('Auth: no user found for', email);
      return res.status(404).json({ error: 'No user found' });
    }

    const user = data[0];
    // Debug log: indicate whether user has a stored password column
    const stored = user.password || user.password_hash || user.pass || null;
    console.log('Auth: found user id=', user.id, 'storedPasswordExists=', !!stored);

    // If a password was provided, verify it (plaintext compare for dev-only)
    if (password) {
      if (!stored) {
        console.log('Auth: no stored password for user, rejecting');
        return res.status(401).json({ error: 'Incorrect email or password' });
      }
      const match = String(stored) === String(password);
      console.log('Auth: password match=', match);
      if (!match) {
        return res.status(401).json({ error: 'Incorrect email or password' });
      }
    }

    return res.json({ token: 'demo-token', user: { name: user.name || user.full_name || '', email: user.email } });
  } catch (err) {
    console.error('Auth error:', err);
    return res.status(500).json({ error: 'Auth error' });
  }
});

// Signup endpoint: create a new user in `users` table (stores password plaintext for dev only)
app.post('/auth/signup', async (req, res) => {
  const { name, email, password, phone } = req.body || {};
  console.log('Received /auth/signup for', email);

  if (!supabase) return res.status(500).json({ error: 'Supabase not configured' });

  try {
    // check existing
    const { data: existing, error: selErr } = await supabase.from('users').select('id,email').eq('email', email).limit(1);
    if (selErr) {
      console.error('Supabase select error (signup):', selErr);
      return res.status(500).json({ error: 'Database error' });
    }
    if (existing && existing.length) return res.status(409).json({ error: 'User already exists' });

    const insertObj = { name, email, phone, created_at: new Date().toISOString() };
    if (password) insertObj.password = password;

    const { data, error } = await supabase.from('users').insert([insertObj]).select('*');
    if (error) {
      console.error('Supabase insert error (signup):', error);
      return res.status(500).json({ error: error.message || 'Insert failed' });
    }

    const user = data && data[0];
    return res.json({ token: 'demo-token', user: { name: user?.name || user?.full_name || '', email: user?.email } });
  } catch (err) {
    console.error('Signup error:', err);
    return res.status(500).json({ error: 'Signup error' });
  }
});

// Helper: convert snake_case keys to camelCase
const toCamel = (s) => s.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
const convertKeysToCamel = (obj) => {
  if (obj === null || typeof obj !== 'object' || Array.isArray(obj)) return obj;
  return Object.keys(obj).reduce((acc, key) => {
    const camel = toCamel(key);
    const val = obj[key];
    acc[camel] = convertKeysToCamel(val);
    return acc;
  }, {});
};

// GET profile by email query param (returns driver_application or merged user data)
app.get('/profile', async (req, res) => {
  const email = req.query.email || (req.query && req.query.email);
  console.log('GET /profile for', email);
  if (!supabase) return res.status(500).json({ error: 'Supabase not configured' });

  try {
    if (!email) {
      return res.status(400).json({ error: 'Missing email query parameter' });
    }

    // First try driver_applications table (most complete data)
    const { data: appData, error: appError } = await supabase
      .from('driver_applications')
      .select('*')
      .eq('email', email)
      .order('created_at', { ascending: false })
      .limit(1);

    if (appError) {
      console.error('Supabase select error (driver_applications):', appError);
    }

    if (appData && appData.length > 0) {
      console.log('Found driver application for', email);
      const row = appData[0];
      console.log('Driver application data:', JSON.stringify(row, null, 2));
      const camel = convertKeysToCamel(row);
      return res.json(camel);
    }

    // Fallback to users table if driver_applications is empty
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .limit(1);

    if (userError) {
      console.error('Supabase select error (users):', userError);
      return res.status(500).json({ error: 'Database error' });
    }

    if (userData && userData.length > 0) {
      console.log('Found user profile for', email);
      const row = userData[0];
      console.log('User data:', JSON.stringify(row, null, 2));
      const camel = convertKeysToCamel(row);
      console.log('Converted to camelCase:', JSON.stringify(camel, null, 2));
      return res.json(camel);
    }

    console.log('No profile found for', email);
    return res.json({});
  } catch (err) {
    console.error('Profile error:', err);
    return res.status(500).json({ error: 'Profile error' });
  }
});

// PUT profile - update driver data in both driver_applications and users tables
app.put('/profile', async (req, res) => {
  const payload = req.body || {};
  const email = payload.email;
  console.log('PUT /profile for', email, 'with data:', Object.keys(payload));
  if (!supabase) return res.status(500).json({ error: 'Supabase not configured' });
  if (!email) return res.status(400).json({ error: 'Missing email in payload' });

  try {
    // convert camelCase payload to snake_case for DB
    const toSnake = (str) => str.replace(/([A-Z])/g, '_$1').toLowerCase();
    const convertKeysToSnake = (obj) => {
      if (obj === null || typeof obj !== 'object' || Array.isArray(obj)) return obj;
      return Object.keys(obj).reduce((acc, key) => {
        const snakeKey = toSnake(key);
        acc[snakeKey] = convertKeysToSnake(obj[key]);
        return acc;
      }, {});
    };

    const updateObj = convertKeysToSnake(payload);
    // remove id if present
    delete updateObj.id;

    // Try to update driver_applications
    const { data, error } = await supabase
      .from('driver_applications')
      .update(updateObj)
      .eq('email', email)
      .select()
      .limit(1);

    if (error) {
      console.error('Supabase update error (driver_applications):', error);
      return res.status(500).json({ error: 'Database update error' });
    }

    // Also update users table so profile always loads with latest data
    const userUpdateObj = {
      full_name: payload.fullName,
      phone: payload.phone,
      address: payload.address,
      date_of_birth: payload.dateOfBirth,
      vehicle_type: payload.vehicleType,
      vehicle_brand: payload.vehicleBrand,
      vehicle_model: payload.vehicleModel,
      license_plate: payload.licensePlate,
      license_number: payload.licenseNumber,
      updated_at: new Date().toISOString()
    };

    // Remove undefined values
    Object.keys(userUpdateObj).forEach(key => userUpdateObj[key] === undefined && delete userUpdateObj[key]);

    const { error: userError } = await supabase
      .from('users')
      .update(userUpdateObj)
      .eq('email', email);

    if (userError) {
      console.warn('Warning: Could not update users table:', userError);
    } else {
      console.log('Successfully synced profile updates to users table');
    }

    const updated = data && data[0] ? convertKeysToCamel(data[0]) : payload;
    return res.json(updated);
  } catch (err) {
    console.error('Profile update error:', err);
    return res.status(500).json({ error: 'Profile update error' });
  }
});

// GET bookings for a driver - fetches all bookings for the logged-in driver
app.get('/bookings', async (req, res) => {
  const driverEmail = req.query.email || (req.query && req.query.email);
  console.log('GET /bookings for driver:', driverEmail);
  if (!supabase) return res.status(500).json({ error: 'Supabase not configured' });

  try {
    if (!driverEmail) {
      return res.status(400).json({ error: 'Missing email query parameter' });
    }

    // Fetch all bookings assigned to this driver or with pending status (not yet assigned)
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .or(`driver_email.eq.${driverEmail},status.eq.pending`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase select error (bookings):', error);
      return res.status(500).json({ error: 'Database error' });
    }

    // Convert snake_case keys to camelCase for frontend
    const bookings = (data || []).map(b => convertKeysToCamel(b));
    return res.json(bookings);
  } catch (err) {
    console.error('Bookings fetch error:', err);
    return res.status(500).json({ error: 'Bookings fetch error' });
  }
});

// POST create a new booking (from passenger)
app.post('/bookings', async (req, res) => {
  const booking = req.body;
  console.log('POST /bookings:', booking && booking.passengerName ? { passenger: booking.passengerName, email: booking.passengerEmail } : 'unknown');

  if (!supabase) return res.status(500).json({ error: 'Supabase not configured' });

  try {
    // Convert camelCase to snake_case for DB
    const toSnake = (str) => str.replace(/([A-Z])/g, '_$1').toLowerCase();
    const convertKeysToSnake = (obj) => {
      if (obj === null || typeof obj !== 'object' || Array.isArray(obj)) return obj;
      return Object.keys(obj).reduce((acc, key) => {
        const snakeKey = toSnake(key);
        acc[snakeKey] = convertKeysToSnake(obj[key]);
        return acc;
      }, {});
    };

    const insertObj = convertKeysToSnake(Object.assign({}, booking, {
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));

    const { data, error } = await supabase
      .from('bookings')
      .insert([insertObj])
      .select('*');

    if (error) {
      console.error('Supabase insert error (bookings):', error);
      return res.status(500).json({ error: error.message || 'Insert failed' });
    }

    const created = data && data[0] ? convertKeysToCamel(data[0]) : insertObj;
    return res.json({ success: true, booking: created });
  } catch (err) {
    console.error('Booking creation error:', err);
    return res.status(500).json({ error: 'Booking creation error' });
  }
});

// PUT accept a booking (driver accepts the ride)
app.put('/bookings/:id/accept', async (req, res) => {
  const { id } = req.params;
  const { driverEmail } = req.body;
  console.log('PUT /bookings/:id/accept for booking:', id, 'driver:', driverEmail);

  if (!supabase) return res.status(500).json({ error: 'Supabase not configured' });
  if (!driverEmail) return res.status(400).json({ error: 'Missing driverEmail in request' });

  try {
    const { data, error } = await supabase
      .from('bookings')
      .update({
        driver_email: driverEmail,
        status: 'accepted',
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select('*');

    if (error) {
      console.error('Supabase update error (booking accept):', error);
      return res.status(500).json({ error: 'Database error' });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const updated = convertKeysToCamel(data[0]);
    return res.json({ success: true, booking: updated });
  } catch (err) {
    console.error('Booking accept error:', err);
    return res.status(500).json({ error: 'Booking accept error' });
  }
});

// PUT reject a booking (driver rejects the ride - makes it available for other drivers)
app.put('/bookings/:id/reject', async (req, res) => {
  const { id } = req.params;
  console.log('PUT /bookings/:id/reject for booking:', id);

  if (!supabase) return res.status(500).json({ error: 'Supabase not configured' });

  try {
    const { data, error } = await supabase
      .from('bookings')
      .update({
        status: 'pending',
        driver_email: null,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select('*');

    if (error) {
      console.error('Supabase update error (booking reject):', error);
      return res.status(500).json({ error: 'Database error' });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const updated = convertKeysToCamel(data[0]);
    return res.json({ success: true, booking: updated });
  } catch (err) {
    console.error('Booking reject error:', err);
    return res.status(500).json({ error: 'Booking reject error' });
  }
});

// PUT cancel a booking (driver cancels an ongoing ride)
app.put('/bookings/:id/cancel', async (req, res) => {
  const { id } = req.params;
  console.log('PUT /bookings/:id/cancel for booking:', id);

  if (!supabase) return res.status(500).json({ error: 'Supabase not configured' });

  try {
    // First fetch the booking
    console.log('Fetching booking:', id);
    const { data: bookingData, error: fetchError } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !bookingData) {
      console.error('Booking fetch error:', fetchError);
      return res.status(404).json({ error: 'Booking not found' });
    }

    console.log('Booking found, moving to rides_complete:', bookingData);

    // Insert into rides_complete table
    const { error: insertError } = await supabase
      .from('rides_complete')
      .insert([{
        booking_id: id,
        driver_email: bookingData.driver_email,
        passenger_name: bookingData.passenger_name,
        passenger_email: bookingData.passenger_email,
        passenger_phone: bookingData.passenger_phone,
        pickup_address: bookingData.pickup_address,
        pickup_latitude: bookingData.pickup_latitude,
        pickup_longitude: bookingData.pickup_longitude,
        dropoff_address: bookingData.dropoff_address,
        dropoff_latitude: bookingData.dropoff_latitude,
        dropoff_longitude: bookingData.dropoff_longitude,
        status: 'cancelled',
        booking_created_at: bookingData.created_at,
        completed_at: new Date().toISOString()
      }]);

    if (insertError) {
      console.error('Error inserting into rides_complete:', insertError);
      return res.status(500).json({ error: 'Failed to archive booking: ' + insertError.message });
    }

    // Delete associated transactions first
    console.log('Deleting associated transactions for booking:', id);
    const { error: deleteTransError } = await supabase
      .from('transactions')
      .delete()
      .eq('booking_id', id);

    if (deleteTransError) {
      console.error('Error deleting transactions:', deleteTransError);
      // Continue anyway, not critical
    }

    console.log('Successfully deleted transactions, now deleting booking from bookings table');

    // Delete from bookings table
    const { error: deleteError } = await supabase
      .from('bookings')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Error deleting from bookings:', deleteError);
      return res.status(500).json({ error: 'Failed to remove from bookings: ' + deleteError.message });
    }

    console.log('Successfully deleted booking:', id);
    return res.json({ success: true, message: 'Booking cancelled and moved to history' });
  } catch (err) {
    console.error('Booking cancel error:', err);
    return res.status(500).json({ error: 'Booking cancel error: ' + err.message });
  }
});

// POST send a message (from driver or passenger)
app.post('/messages', async (req, res) => {
  const { bookingId, senderEmail, senderName, senderType, messageText } = req.body;
  console.log('POST /messages for booking:', bookingId, 'from:', senderEmail);

  if (!supabase) return res.status(500).json({ error: 'Supabase not configured' });
  if (!bookingId || !senderEmail || !messageText) {
    return res.status(400).json({ error: 'Missing required fields: bookingId, senderEmail, messageText' });
  }

  try {
    const { data, error } = await supabase
      .from('messages')
      .insert([{
        booking_id: bookingId,
        sender_email: senderEmail,
        sender_name: senderName,
        sender_type: senderType || 'driver',
        message_text: messageText,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select('*');

    if (error) {
      console.error('Supabase insert error (messages):', error);
      return res.status(500).json({ error: error.message || 'Insert failed' });
    }

    const created = data && data[0] ? convertKeysToCamel(data[0]) : {};
    return res.json({ success: true, message: created });
  } catch (err) {
    console.error('Message send error:', err);
    return res.status(500).json({ error: 'Message send error' });
  }
});

// GET messages for a specific booking
app.get('/messages/:bookingId', async (req, res) => {
  const { bookingId } = req.params;
  console.log('GET /messages for booking:', bookingId);

  if (!supabase) return res.status(500).json({ error: 'Supabase not configured' });
  if (!bookingId) return res.status(400).json({ error: 'Missing bookingId' });

  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('booking_id', bookingId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Supabase select error (messages):', error);
      return res.status(500).json({ error: 'Database error' });
    }

    const messages = (data || []).map(m => convertKeysToCamel(m));
    return res.json(messages);
  } catch (err) {
    console.error('Messages fetch error:', err);
    return res.status(500).json({ error: 'Messages fetch error' });
  }
});

// GET all conversations (accepted bookings) for a driver with latest message
app.get('/conversations', async (req, res) => {
  const driverEmail = req.query.email || (req.query && req.query.email);
  console.log('GET /conversations for driver:', driverEmail);

  if (!supabase) return res.status(500).json({ error: 'Supabase not configured' });
  if (!driverEmail) return res.status(400).json({ error: 'Missing email query parameter' });

  try {
    // Fetch all accepted bookings for this driver
    const { data: bookings, error: bookingError } = await supabase
      .from('bookings')
      .select('*')
      .eq('driver_email', driverEmail)
      .eq('status', 'accepted')
      .order('updated_at', { ascending: false });

    if (bookingError) {
      console.error('Supabase select error (bookings):', bookingError);
      return res.status(500).json({ error: 'Database error' });
    }

    // For each booking, fetch the latest message
    const conversations = await Promise.all((bookings || []).map(async (booking) => {
      const { data: messages } = await supabase
        .from('messages')
        .select('*')
        .eq('booking_id', booking.id)
        .order('created_at', { ascending: false })
        .limit(1);

      const latestMessage = messages && messages[0] ? messages[0] : null;

      return {
        id: booking.id,
        bookingId: booking.id,
        passengerName: booking.passenger_name,
        passengerEmail: booking.passenger_email,
        passengerPhone: booking.passenger_phone,
        pickupAddress: booking.pickup_address,
        dropoffAddress: booking.dropoff_address,
        pickupLat: booking.pickup_latitude,
        pickupLng: booking.pickup_longitude,
        dropoffLat: booking.dropoff_latitude,
        dropoffLng: booking.dropoff_longitude,
        status: booking.status,
        lastMessage: latestMessage ? latestMessage.message_text : 'No messages yet',
        lastMessageTime: latestMessage ? new Date(latestMessage.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
        lastMessageSender: latestMessage ? latestMessage.sender_name : '',
        createdAt: booking.created_at
      };
    }));

    return res.json(conversations);
  } catch (err) {
    console.error('Conversations fetch error:', err);
    return res.status(500).json({ error: 'Conversations fetch error' });
  }
});

// GET ride history for a driver - fetches all completed/cancelled bookings from rides_complete table
app.get('/ride-history', async (req, res) => {
  const driverEmail = req.query.email || (req.query && req.query.email);
  console.log('GET /ride-history for driver:', driverEmail);

  if (!supabase) return res.status(500).json({ error: 'Supabase not configured' });
  if (!driverEmail) return res.status(400).json({ error: 'Missing email query parameter' });

  try {
    // Fetch all completed or cancelled rides from rides_complete table
    const { data, error } = await supabase
      .from('rides_complete')
      .select('*')
      .eq('driver_email', driverEmail)
      .order('completed_at', { ascending: false });

    if (error) {
      console.error('Supabase select error (ride-history):', error);
      return res.status(500).json({ error: 'Database error' });
    }

    // Convert snake_case to camelCase and format for frontend
    const rides = (data || []).map(ride => {
      const camelCased = convertKeysToCamel(ride);
      return {
        id: camelCased.bookingId,
        date: new Date(camelCased.completedAt).toISOString().split('T')[0],
        time: new Date(camelCased.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        pickupLocation: camelCased.pickupAddress,
        dropoffLocation: camelCased.dropoffAddress,
        passenger: camelCased.passengerName,
        passengerEmail: camelCased.passengerEmail,
        passengerPhone: camelCased.passengerPhone,
        pickupLat: camelCased.pickupLatitude,
        pickupLng: camelCased.pickupLongitude,
        dropoffLat: camelCased.dropoffLatitude,
        dropoffLng: camelCased.dropoffLongitude,
        status: camelCased.status,
        distance: camelCased.distance || 0,
        duration: camelCased.duration || 'N/A',
        fare: camelCased.fare || null,
        rating: camelCased.rating || null,
        paymentMethod: camelCased.paymentMethod || 'Card',
        rideType: camelCased.rideType || 'Standard',
        createdAt: camelCased.bookingCreatedAt,
        completedAt: camelCased.completedAt
      };
    });

    return res.json(rides);
  } catch (err) {
    console.error('Ride history fetch error:', err);
    return res.status(500).json({ error: 'Ride history fetch error' });
  }
});

// PUT update ride status (complete a booking)
app.put('/bookings/:id/complete', async (req, res) => {
  const { id } = req.params;
  const { fare, distance, duration, rating, paymentMethod } = req.body;
  console.log('PUT /bookings/:id/complete for booking:', id, 'fare:', fare);

  if (!supabase) return res.status(500).json({ error: 'Supabase not configured' });

  try {
    // First fetch the booking
    console.log('Fetching booking:', id);
    const { data: bookingData, error: fetchError } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !bookingData) {
      console.error('Booking fetch error:', fetchError);
      return res.status(404).json({ error: 'Booking not found' });
    }

    console.log('Booking found, moving to rides_complete:', bookingData);

    // Insert into rides_complete table with payment details
    const { error: insertError } = await supabase
      .from('rides_complete')
      .insert([{
        booking_id: id,
        driver_email: bookingData.driver_email,
        passenger_name: bookingData.passenger_name,
        passenger_email: bookingData.passenger_email,
        passenger_phone: bookingData.passenger_phone,
        pickup_address: bookingData.pickup_address,
        pickup_latitude: bookingData.pickup_latitude,
        pickup_longitude: bookingData.pickup_longitude,
        dropoff_address: bookingData.dropoff_address,
        dropoff_latitude: bookingData.dropoff_latitude,
        dropoff_longitude: bookingData.dropoff_longitude,
        status: 'completed',
        booking_created_at: bookingData.created_at,
        fare: fare || 0,
        distance: distance || 0,
        duration: duration || 'N/A',
        rating: rating || null,
        payment_method: paymentMethod || 'Cash',
        payment_status: 'completed',
        completed_at: new Date().toISOString()
      }]);

    if (insertError) {
      console.error('Error inserting into rides_complete:', insertError);
      return res.status(500).json({ error: 'Failed to archive booking: ' + insertError.message });
    }

    // Delete associated transactions first
    console.log('Deleting associated transactions for booking:', id);
    const { error: deleteTransError } = await supabase
      .from('transactions')
      .delete()
      .eq('booking_id', id);

    if (deleteTransError) {
      console.error('Error deleting transactions:', deleteTransError);
      // Continue anyway, not critical
    }

    console.log('Successfully deleted transactions, now deleting booking from bookings table');

    // Delete from bookings table
    const { error: deleteError } = await supabase
      .from('bookings')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Error deleting from bookings:', deleteError);
      return res.status(500).json({ error: 'Failed to remove from bookings: ' + deleteError.message });
    }

    console.log('Successfully deleted booking:', id);
    return res.json({ success: true, message: 'Booking completed and moved to history' });
  } catch (err) {
    console.error('Booking complete error:', err);
    return res.status(500).json({ error: 'Booking complete error: ' + err.message });
  }
});

// GET transactions (payment history from transactions table)
app.get('/transactions', async (req, res) => {
  const driverEmail = req.query.email || (req.query && req.query.email);
  console.log('GET /transactions for driver:', driverEmail);

  if (!supabase) return res.status(500).json({ error: 'Supabase not configured' });
  if (!driverEmail) return res.status(400).json({ error: 'Missing email query parameter' });

  try {
    // Fetch all bookings for this driver from rides_complete
    const { data: rides, error: ridesError } = await supabase
      .from('rides_complete')
      .select('booking_id')
      .eq('driver_email', driverEmail);

    if (ridesError) {
      console.error('Rides fetch error:', ridesError);
      return res.status(500).json({ error: 'Failed to fetch rides' });
    }

    const bookingIds = (rides || []).map(r => r.booking_id);
    
    if (bookingIds.length === 0) {
      console.log('No rides found for driver:', driverEmail);
      return res.json({
        transactions: [],
        summary: {
          totalEarnings: 0,
          totalDeductions: 0,
          netBalance: 0,
          transactionCount: 0
        }
      });
    }

    // Fetch transactions for these bookings
    const { data: transactionData, error: transError } = await supabase
      .from('transactions')
      .select('*')
      .in('booking_id', bookingIds)
      .order('created_at', { ascending: false });

    if (transError) {
      console.error('Supabase select error (transactions):', transError);
      return res.status(500).json({ error: 'Database error' });
    }

    console.log(`Found ${transactionData?.length || 0} transactions`);
    if (transactionData && transactionData.length > 0) {
      console.log('Transaction sample:', transactionData[0]);
    }

    // Convert transactions to frontend format
    const transactions = (transactionData || []).map((transaction, index) => {
      const camelCased = convertKeysToCamel(transaction);
      const date = new Date(camelCased.createdAt).toISOString().split('T')[0];
      const time = new Date(camelCased.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      return {
        id: `TXN-${camelCased.bookingId?.substring(0, 8)}-${index}`,
        bookingId: camelCased.bookingId,
        date: date,
        time: time,
        type: 'Ride Earnings',
        amount: camelCased.amount || 0,
        status: camelCased.status || 'completed',
        paymentStatus: camelCased.status || 'completed',
        description: `Payment from ${camelCased.passengerName}`,
        paymentMethod: camelCased.paymentMethod || 'GCash',
        reference: camelCased.bookingId,
        passengerName: camelCased.passengerName,
        passengerEmail: camelCased.passengerEmail,
        distance: camelCased.distance || 0,
        duration: camelCased.duration || 'N/A',
        rating: camelCased.rating,
        createdAt: camelCased.createdAt
      };
    });

    // Calculate summary - only include completed/paid transactions
    const completedTransactions = transactions.filter(t => 
      t.paymentStatus === 'completed' || 
      t.status === 'completed' || 
      t.paymentStatus === 'paid' || 
      t.status === 'paid'
    );
    const totalEarnings = completedTransactions.reduce((sum, t) => sum + t.amount, 0);
    const commission = Math.round(totalEarnings * 0.1); // 10% commission
    const netEarnings = totalEarnings - commission;

    console.log(`Total transactions: ${transactions.length}, Completed: ${completedTransactions.length}`);
    console.log(`Total Earnings (raw centavos): ${totalEarnings}, Commission: ${commission}, Net: ${netEarnings}`);

    return res.json({
      transactions,
      summary: {
        totalEarnings,
        totalDeductions: commission,
        netBalance: netEarnings,
        transactionCount: completedTransactions.length
      }
    });
  } catch (err) {
    console.error('Transactions fetch error:', err);
    return res.status(500).json({ error: 'Transactions fetch error: ' + err.message });
  }
});

// POST create a new driver support ticket
app.post('/support-tickets', async (req, res) => {
  const { name, email, subject, category, message } = req.body;
  console.log('POST /support-tickets:', { name, email, subject, category });

  if (!supabase) return res.status(500).json({ error: 'Supabase not configured' });

  try {
    if (!email || !name || !subject || !category || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const insertObj = {
      driver_email: email,
      driver_name: name,
      subject,
      category,
      message,
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('driver_support')
      .insert([insertObj])
      .select('*');

    if (error) {
      console.error('Supabase insert error (driver_support):', error);
      return res.status(500).json({ error: 'Failed to create support ticket', details: error.message });
    }

    const ticket = data && data[0] ? convertKeysToCamel(data[0]) : insertObj;
    console.log('Driver support ticket created:', ticket.id);
    return res.json({ success: true, ticket });
  } catch (err) {
    console.error('Driver support ticket creation error:', err);
    return res.status(500).json({ error: 'Driver support ticket creation error: ' + err.message });
  }
});

// GET driver support tickets for a driver
app.get('/support-tickets', async (req, res) => {
  const driverEmail = req.query.email;
  console.log('GET /support-tickets for driver:', driverEmail);

  if (!supabase) return res.status(500).json({ error: 'Supabase not configured' });

  try {
    if (!driverEmail) {
      return res.status(400).json({ error: 'Missing email query parameter' });
    }

    const { data, error } = await supabase
      .from('driver_support')
      .select('*')
      .eq('driver_email', driverEmail)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase select error (driver_support):', error);
      return res.status(500).json({ error: 'Database error' });
    }

    // Convert snake_case keys to camelCase for frontend
    const tickets = (data || []).map(t => convertKeysToCamel(t));
    console.log(`Found ${tickets.length} driver support tickets for ${driverEmail}`);
    return res.json(tickets);
  } catch (err) {
    console.error('Driver support tickets fetch error:', err);
    return res.status(500).json({ error: 'Driver support tickets fetch error: ' + err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
