import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { LogOut, History } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./components/context/user"; // ✅ Adjust path if needed

const ProfilePage = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    mobile: "",
    dateOfBirth: "",
    studentClass: "",
    city: "",
  });

  const navigate = useNavigate();
  const { logout } = useContext(UserContext); // ✅ Using context logout

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/profile", { withCredentials: true })
      .then((res) => setUser(res.data))
      .catch((err) => console.log(err));
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .put("http://localhost:3000/api/profile/update", user, { withCredentials: true })
      .then(() => alert("✅ Profile updated successfully!"))
      .catch((err) => console.log(err));
  };

  const handleViewHistory = () => {
    navigate("/history");
  };

  const handleLogout = async () => {
    await logout(); // ✅ Logout using context
    alert("You have been logged out!");
    navigate("/");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-lg mx-auto mt-10 bg-white shadow-2xl p-6 rounded-2xl border border-gray-100"
    >
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-3xl font-bold mb-6 text-center text-blue-700"
      >
        My Profile
      </motion.h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block font-semibold text-gray-700 mb-1">Full Name</label>
          <input
            type="text"
            name="name"
            value={user.name || ""}
            onChange={handleChange}
            placeholder="Enter your name"
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>

        <div>
          <label className="block font-semibold text-gray-700 mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={user.email || ""}
            disabled
            className="w-full border rounded-lg p-2 bg-gray-100 cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block font-semibold text-gray-700 mb-1">Mobile</label>
          <input
            type="text"
            name="mobile"
            value={user.mobile || ""}
            onChange={handleChange}
            placeholder="Mobile Number"
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>

        <div>
          <label className="block font-semibold text-gray-700 mb-1">Date of Birth</label>
          <input
            type="date"
            name="dateOfBirth"
            value={user.dateOfBirth ? user.dateOfBirth.substring(0, 10) : ""}
            onChange={handleChange}
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>

        <div>
          <label className="block font-semibold text-gray-700 mb-1">Class</label>
          <input
            type="text"
            name="studentClass"
            value={user.studentClass || ""}
            onChange={handleChange}
            placeholder="Class"
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>

        <div>
          <label className="block font-semibold text-gray-700 mb-1">City</label>
          <input
            type="text"
            name="city"
            value={user.city || ""}
            onChange={handleChange}
            placeholder="City"
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded-lg font-semibold hover:bg-blue-700 transition-all"
        >
          Save Changes
        </motion.button>
      </form>

      {/* Buttons Below Form */}
      <div className="flex justify-between mt-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleViewHistory}
          className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all"
        >
          <History size={18} />
          View History
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all"
        >
          <LogOut size={18} />
          Logout
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ProfilePage;
