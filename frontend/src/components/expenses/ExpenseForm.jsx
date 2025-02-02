import React, { useState, useEffect } from "react";
import axios from "axios";
import { useThemeContext } from '../../contexts/ThemeContext'; 

const ExpenseForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    category: "food",
    date: new Date().toISOString().split('T')[0]
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const token = localStorage.getItem('accessToken');


  const { darkMode } = useThemeContext();

  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
  });

  useEffect(() => {
    if (!token) {
      setError("You must be logged in to add an expense.");
      return;
    }

    try {
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      // console.log("Decoded token payload:", tokenPayload);

      // Check common fields for user ID (e.g., 'id', 'userId', 'sub')
      const userId = tokenPayload.id || tokenPayload.userId || tokenPayload.sub;
      if (!userId) {
        console.error("User ID not found in token payload");
        setError("Authentication error: User ID missing");
        return;
      }

      setFormData(prev => ({
        ...prev,
        user: userId  // Using .id instead of .userId
      }));
      
        // Log the updated form data
        //console.log("Updated form data with user:", formData);
      
    } catch (err) {
      console.error("Error decoding token:", err);
      setError("Error loading user data");
    }
  }, [token]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    if (!token) {
      setError("You must be logged in to add an expense.");
      setIsSubmitting(false);
      return;
    }

    // Client-side validation
    if (!formData.description.trim() || !formData.amount) {
      setError("Description and amount are required!");
      setIsSubmitting(false);
      return;
    }

    if (isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      setError("Amount must be a positive number!");
      setIsSubmitting(false);
      return;
    }

    if (!formData.user) {
      setError("User ID is missing. Please try logging in again.");
      setIsSubmitting(false);
      return;
    }
  
    try {
      const payload = {
        description: formData.description,
        amount: parseFloat(formData.amount),
        category: formData.category,
        date: new Date(formData.date).toISOString()
      };
      
      // Log the complete payload for debugging
      // console.log("Submitting payload:", payload); 

      // console.log("User",formData.user)
      // // Log both the token and payload
      // console.log("Authorization Token:", token);
      // console.log("Decoded Token:", JSON.parse(atob(token.split('.')[1])));
      // console.log("Sending payload:", payload);

      const response = await api.post("/expenses/add-expense", payload);
      // console.log("Expense saved:", response.data);
      
      if (onSuccess) { // Changed to onSuccess
        onSuccess();
      }
      // // Reset form on success
      // setFormData(prev => ({
      //   description: "",
      //   amount: "",
      //   category: "food",
      //   date: new Date().toISOString().split('T')[0],
      //   user: "679dec84744b4fc59173bf95"
      // }));
      
    } catch (err) {
      if (err.response) {
        console.error("Server error:", err.response.data);
        // Log the full error response for debugging
        console.log("Full error response:", err.response);
        setError(err.response.data.message || "Server error occurred");
      } else if (err.request) {
        console.error("Network error:", err.message);
        setError("Unable to connect to server");
      } else {
        console.error("Error:", err.message);
        setError("An unexpected error occurred");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
     <div className={`max-w-lg mx-auto p-6 rounded-lg shadow-md ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
      <h2 className="text-2xl font-bold mb-4 text-center">Add New Expense</h2>
      {error && <div className="text-red-500 text-sm mb-3">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Description:</label>
          <input 
            type="text" 
            name="description" 
            value={formData.description} 
            onChange={handleChange} 
            placeholder="Enter expense description" 
            className={`w-full border ${darkMode ? 'border-gray-600' : 'border-gray-300'} p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400`}
          />
        </div>

        <div>
          <label className="block font-medium">Amount:</label>
          <input 
            type="number" 
            name="amount" 
            value={formData.amount} 
            onChange={handleChange} 
            placeholder="0.00" 
            step="0.01" 
            className={`w-full border ${darkMode ? 'border-gray-600' : 'border-gray-300'} p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400`}
          />
        </div>

        <div>
          <label className="block font-medium">Category:</label>
          <select 
            name="category" 
            value={formData.category} 
            onChange={handleChange} 
            className={`w-full border ${darkMode ? 'border-gray-600' : 'border-gray-300'} p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400`}
          >
            <option value="food">Food</option>
            <option value="transport">Transport</option>
            <option value="housing">Housing</option>
            <option value="entertainment">Entertainment</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block font-medium">Date:</label>
          <input 
            type="date" 
            name="date" 
            value={formData.date} 
            onChange={handleChange} 
            className={`w-full border ${darkMode ? 'border-gray-600' : 'border-gray-300'} p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400`}
          />
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting} 
          className={`w-full p-3 text-white font-bold rounded-lg ${isSubmitting ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"}`}
        >
          {isSubmitting ? "Saving..." : "Add Expense"}
        </button>
      </form>
    </div>
  );
};

export default ExpenseForm;