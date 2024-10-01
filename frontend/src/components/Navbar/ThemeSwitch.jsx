import { useEffect, useState } from "react";
import { FiSun, FiMoon } from "react-icons/fi";

function DarkModeToggle() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
    }
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  return (
    <button
      className="p-2 rounded-full bg-gray-200 dark:bg-gray-800"
      onClick={toggleTheme}
    >
      {theme === "dark" ? (
        <FiSun className="text-yellow-400" />
      ) : (
        <FiMoon className="text-gray-600" />
      )}
    </button>
  );
}

export default DarkModeToggle;
