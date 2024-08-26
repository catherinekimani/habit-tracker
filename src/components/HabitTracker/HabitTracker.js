import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaFire, FaTrash } from "react-icons/fa";
import "./HabitTracker.css";

function HabitTracker({ user, onLogout }) {
  const [habits, setHabits] = useState([]);
  const [newHabitName, setNewHabitName] = useState("");

  useEffect(() => {
    const storedHabits = localStorage.getItem(`habits_${user.email}`);
    if (storedHabits) {
      setHabits(JSON.parse(storedHabits));
    }
  }, [user.email]);

  useEffect(() => {
    localStorage.setItem(`habits_${user.email}`, JSON.stringify(habits));
  }, [habits, user.email]);

  const addHabit = () => {
    if (newHabitName.trim() !== "") {
      setHabits([
        ...habits,
        {
          id: Date.now().toString(),
          name: newHabitName,
          completedDates: [],
          streak: 0,
        },
      ]);
      setNewHabitName("");
    }
  };

  const toggleHabit = (habitId) => {
    setHabits(
      habits.map((habit) => {
        if (habit.id === habitId) {
          const today = new Date().toISOString().split("T")[0];
          const yesterday = new Date(Date.now() - 86400000)
            .toISOString()
            .split("T")[0];
          let newCompletedDates;
          let newStreak = habit.streak;

          if (habit.completedDates.includes(today)) {
            newCompletedDates = habit.completedDates.filter(
              (date) => date !== today
            );
            newStreak = Math.max(0, newStreak - 1);
          } else {
            newCompletedDates = [...habit.completedDates, today];
            if (habit.completedDates.includes(yesterday) || newStreak === 0) {
              newStreak += 1;
            }
          }

          return {
            ...habit,
            completedDates: newCompletedDates,
            streak: newStreak,
          };
        }
        return habit;
      })
    );
  };

  const removeHabit = (habitId) => {
    setHabits(habits.filter((habit) => habit.id !== habitId));
  };

  const calculateProgress = (habit) => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split("T")[0];
    });
    const completedInLast7Days = habit.completedDates.filter((date) =>
      last7Days.includes(date)
    );
    return (completedInLast7Days.length / 7) * 100;
  };

  return (
    <div className="container">
      <div className="card habit-tracker">
        <h2>Habit Tracker</h2>
        <div className="habit-form">
          <input
            type="text"
            placeholder="New habit"
            value={newHabitName}
            onChange={(e) => setNewHabitName(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addHabit()}
          />
          <button onClick={addHabit} className="btn">
            Add Habit
          </button>
        </div>
        <AnimatePresence>
          <ul className="habit-list">
            {habits.map((habit) => (
              <motion.li
                key={habit.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="habit-item"
              >
                <input
                  type="checkbox"
                  checked={habit.completedDates.includes(
                    new Date().toISOString().split("T")[0]
                  )}
                  onChange={() => toggleHabit(habit.id)}
                />
                <span className="habit-name">{habit.name}</span>
                <div className="habit-actions">
                  <span className="streak">
                    <FaFire /> {habit.streak}
                  </span>
                  <button
                    onClick={() => removeHabit(habit.id)}
                    className="btn btn-secondary"
                  >
                    <FaTrash />
                  </button>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${calculateProgress(habit)}%` }}
                  ></div>
                </div>
              </motion.li>
            ))}
          </ul>
        </AnimatePresence>
      </div>
      <button onClick={onLogout} className="logout-btn">
        Logout
      </button>
    </div>
  );
}

export default HabitTracker;
