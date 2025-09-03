import React, { useState } from 'react';

function LogInForm({setloggedIn}) {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent page refresh


    // Example: API call or validation
    if (formData.username == 'admin' && formData.password == 'tst') {
      setloggedIn(true);
    } 
    else if(formData.username != 'admin' && formData.password != 'tst'){
        alert("Incorrect User and Password!!")
    }
    else {
      alert('Please fill in all fields.');
    }
  };

  return (
    <div
      style={{
        maxWidth: "350px",
        margin: "50px auto",
        padding: "30px",
        border: "2px solid #ccc",
        borderRadius: "10px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        backgroundColor: "#ffffffff",
        textAlign: "center",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Logo at the top */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "15px" }}>
            <img
            src="../public/sjb_logo.jpg" 
            alt="Logo"
            style={{ width: "80px" }}
        />
       </div>

      <h2 style={{ marginBottom: "20px", color: "#333" }}>Login</h2>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px", textAlign: "left" }}>
          <label style={{ fontWeight: "bold" }}>Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "5px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        <div style={{ marginBottom: "15px", textAlign: "left" }}>
          <label style={{ fontWeight: "bold" }}>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "5px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            backgroundColor: "#4CAF50",
            color: "white",
            fontSize: "16px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default LogInForm;
