// Replace these with your Supabase project details
  const supabaseUrl = "https://zmvtemlsufgximzgoqyn.supabase.co"
  const supabaseKey = "sb_publishable_pxX1Vxm-kiqnmQj9GBYvww_7h_BYRYU"

// Initialize Supabase client
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// Signup function
async function signup() {
    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;

    const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password
    });

    if (error) {
        document.getElementById("status").innerText = `Signup error: ${error.message}`;
    } else {
        document.getElementById("status").innerText = `Signup successful! Check your email.`;
    }
}

// Login function
async function login() {
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
    });

    if (error) {
        document.getElementById("status").innerText = `Login error: ${error.message}`;
    } else {
        document.getElementById("status").innerText = `Logged in successfully!`;
    }
}

// Attach buttons
document.getElementById("signup-btn").addEventListener("click", signup);
document.getElementById("login-btn").addEventListener("click", login);
