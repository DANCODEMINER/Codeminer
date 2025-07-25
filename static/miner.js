// Toggle menu in login page
function toggleMenu() {
  const menu = document.getElementById("menu");
  menu.style.display = menu.style.display === "flex" ? "none" : "flex";
}

function showForm(formType) {
  document.getElementById("login-form").style.display = formType === "login" ? "block" : "none";
  document.getElementById("register-form").style.display = formType === "register" ? "block" : "none";
  document.getElementById("forgot-form").style.display = formType === "forgot" ? "block" : "none";
  document.getElementById("otp-form").style.display = formType === "otp-form" ? "block" : "none";
  document.getElementById("pin-form").style.display = formType === "pin-form" ? "block" : "none";
  document.getElementById("pin-verify-form").style.display = formType === "pin-verify" ? "block" : "none";
  document.getElementById("dashboard-page").style.display = formType === "dashboard" ? "block" : "none";
}

function signupUser() {
  const fullName = document.getElementById("signup-name").value.trim();
  const country = document.getElementById("signup-country").value.trim();
  const email = document.getElementById("signup-email").value.trim();
  const password = document.getElementById("signup-password").value.trim();
  const otpMsg = document.getElementById("otp-message");

  const signupData = {
    full_name: fullName,
    country: country,
    email: email,
    password: password
  };

  fetch("https://danoski-backend.onrender.com/user/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(signupData)
  })
  .then(res => res.json().then(data => ({ ok: res.ok, data })))
  .then(({ ok, data }) => {
    if (ok) {
      localStorage.setItem("name", fullName);
      localStorage.setItem("country", country);
      localStorage.setItem("email", email);
      localStorage.setItem("password", password);

      otpMsg.style.color = "green";
      otpMsg.innerText = "✅ OTP sent to your email.";
      document.getElementById("otp-email").value = email;
      showForm("otp-form");
      otpMsg.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      otpMsg.style.color = "red";
      otpMsg.innerText = "❌ " + (data.error || "Signup failed.");
      otpMsg.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    setTimeout(() => {
      otpMsg.innerText = "";
    }, 5000);
  })
  .catch(err => {
    otpMsg.style.color = "orange";
    otpMsg.innerText = "⚠️ Failed to connect to server.";
    otpMsg.scrollIntoView({ behavior: "smooth", block: "center" });
    console.error(err);
  });
  
}
function verifyOtp() {
  const email = document.getElementById("otp-email").value.trim();
  const otp = document.getElementById("otp-code").value.trim();

  if (!email || !otp) {
    alert("Please enter both email and OTP.");
    return;
  }

  fetch("https://danoski-backend.onrender.com/user/verify-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp }),
  })
    .then(res => res.json().then(data => ({ ok: res.ok, data })))
    .then(({ ok, data }) => {
      if (ok) {
        alert("✅ OTP verified! Please create your PIN.");
        document.getElementById("otp-form").style.display = "none";
        document.getElementById("pin-form").style.display = "block";

        // Save user info temporarily if not already saved
        localStorage.setItem("email", email);
      } else {
        alert("❌ " + data.error);
      }
    })
    .catch(err => {
      alert("⚠️ Could not connect to the server.");
      console.error(err);
    });
}

function loginUser() {
  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value;

  if (!email || !password) {
    alert("Please fill in all login fields.");
    return;
  }

  fetch("https://danoski-backend.onrender.com/user/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  })
    .then(res => res.json().then(data => ({ ok: res.ok, data })))
    .then(({ ok, data }) => {
      if (ok) {
        // Save user email for PIN check
        sessionStorage.setItem("loginEmail", email);

        // Show PIN verification form
        document.getElementById("login-form").style.display = "none";
        document.getElementById("pin-verify-form").style.display = "block";
        document.getElementById("pin-message").innerText = "Please enter your 4-digit PIN to continue.";
        focusFirstPinVerifyInput();
      } else {
        alert("❌ " + data.error);
      }
    })
    .catch((err) => {
      alert("⚠️ Server error during login.");
      console.error(err);
    });
}

function verifyLoginPin() {
  const pin = 
    document.getElementById("pinverify1").value +
    document.getElementById("pinverify2").value +
    document.getElementById("pinverify3").value +
    document.getElementById("pinverify4").value;

  if (pin.length !== 4) {
    alert("Please enter a valid 4-digit PIN.");
    return;
  }

  const email = sessionStorage.getItem("loginEmail");

  fetch("https://danoski-backend.onrender.com/user/verify-login-pin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, pin })
  })
    .then(res => res.json().then(data => ({ ok: res.ok, data })))
    .then(({ ok, data }) => {
      if (ok) {
        alert("✅ PIN verified. Welcome back!");
        sessionStorage.setItem("isLoggedIn", "true");
        showDashboard();
      } else {
        alert("❌ " + data.error);
      }
    })
    .catch((err) => {
      alert("⚠️ Server error during PIN verification.");
      console.error(err);
    });
}

function setUserPin() {
  const pin1 = document.getElementById("pin1").value.trim();
  const pin2 = document.getElementById("pin2").value.trim();
  const pin3 = document.getElementById("pin3").value.trim();
  const pin4 = document.getElementById("pin4").value.trim();

  const pin = pin1 + pin2 + pin3 + pin4;

  console.log("PIN1:", pin1);
  console.log("PIN2:", pin2);
  console.log("PIN3:", pin3);
  console.log("PIN4:", pin4);
  console.log("Combined PIN:", pin);

  if (pin.length !== 4 || !/^\d{4}$/.test(pin)) {
    alert("Please enter a valid 4-digit PIN.");
    return;
  }

  const full_name = localStorage.getItem("name");
  const country = localStorage.getItem("country");
  const email = localStorage.getItem("email");
  const password = localStorage.getItem("password");

  console.log("Full Name:", full_name);
  console.log("Country:", country);
  console.log("Email:", email);
  console.log("Password:", password);

  if (!full_name || !country || !email || !password) {
    alert("User details missing. Please restart registration.");
    return;
  }

  fetch("https://danoski-backend.onrender.com/user/create-account", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      full_name,
      country,
      email,
      password,
      pin,
    }),
  })
    .then((res) => res.json().then((data) => ({ ok: res.ok, data })))
    .then(({ ok, data }) => {
      if (ok) {
        alert("✅ Account created successfully!");
        sessionStorage.setItem("isLoggedIn", "true");
        showDashboard();
      } else {
        alert("❌ " + (data.error || "Failed to create account."));
      }
    })
    .catch((err) => {
      console.error(err);
      alert("⚠️ Server connection failed.");
    });
}

// === PIN Input Activation ===
function bindPinInputs() {
  const inputs = ["pin1", "pin2", "pin3", "pin4"];
  inputs.forEach((id, index) => {
    const input = document.getElementById(id);
    if (input) {
      input.addEventListener("input", () => {
        input.value = input.value.replace(/[^0-9]/g, "");
        if (input.value.length === 1 && index < inputs.length - 1) {
          const next = document.getElementById(inputs[index + 1]);
          if (next) next.focus();
        }
        checkPinLength();
      });

      function bindVerifyPinInputs() {
  const inputs = ["pinverify1", "pinverify2", "pinverify3", "pinverify4"];
  inputs.forEach((id, index) => {
    const input = document.getElementById(id);
    if (input) {
      input.addEventListener("input", () => {
        input.value = input.value.replace(/[^0-9]/g, "");
        if (input.value.length === 1 && index < inputs.length - 1) {
          const next = document.getElementById(inputs[index + 1]);
          if (next) next.focus();
        }
      });

      input.addEventListener("keydown", (e) => {
        if (e.key === "Backspace" && input.value === "" && index > 0) {
          const prev = document.getElementById(inputs[index - 1]);
          if (prev) prev.focus();
        }
      });
    }
  });
      }

      input.addEventListener("keydown", (e) => {
        if (e.key === "Backspace" && input.value === "" && index > 0) {
          const prev = document.getElementById(inputs[index - 1]);
          if (prev) prev.focus();
        }
      });
    }
  });
}

function checkPinLength() {
  const pin = document.getElementById("pin1").value +
              document.getElementById("pin2").value +
              document.getElementById("pin3").value +
              document.getElementById("pin4").value;

  const btn = document.getElementById("create-account-btn");
  if (btn) {
    if (pin.length === 4) {
      btn.disabled = false;
      btn.style.opacity = "1";
      btn.style.cursor = "pointer";
    } else {
      btn.disabled = true;
      btn.style.opacity = "0.5";
      btn.style.cursor = "not-allowed";
    }
  }
}

function logout() {
  sessionStorage.clear();
  localStorage.clear();
  window.location.href = "login.html"; // or whatever your login page is
}

function showDashboard() {
  document.getElementById("login-form").style.display = "none";
  document.getElementById("register-form").style.display = "none";
  document.getElementById("forgot-form").style.display = "none";
  document.getElementById("otp-form").style.display = "none";
  document.getElementById("pin-form").style.display = "none";
  document.getElementById("pin-verify-form").style.display = "none";
  document.getElementById("dashboard-page").style.display = "block";
}

let btcValue = 0.00000000;
setInterval(() => {
  const btcCounter = document.getElementById("btc-counter");
  if (btcCounter) {
    btcValue += 0.00000001;
    btcCounter.innerText = btcValue.toFixed(8) + " BTC";
  }
}, 1000);

// === DOMContentLoaded Init ===
document.addEventListener("DOMContentLoaded", () => {
  if (sessionStorage.getItem("isLoggedIn") === "true") {
    showDashboard();
  }

  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      loginUser();
    });
  }

  const forgotForm = document.getElementById("forgot-form");
  if (forgotForm) {
    forgotForm.addEventListener("submit", function (e) {
      e.preventDefault();
      alert("Forgot password functionality to be implemented");
    });
  }

  bindPinInputs();         // Already present
  bindVerifyPinInputs();   // ✅ Add this for pinverify1–4
});

function focusFirstPinVerifyInput() {
  const input = document.getElementById("pinverify1");
  if (input) input.focus();
}
