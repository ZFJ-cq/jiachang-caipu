import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Search from "@/pages/Search";
import RecipeDetail from "@/pages/RecipeDetail";
import MyRecipes from "@/pages/MyRecipes";
import RecipeEdit from "@/pages/RecipeEdit";
import WhatToEat from "@/pages/WhatToEat";
import ShoppingList from "@/pages/ShoppingList";
import History from "@/pages/History";
import SmartMatch from "@/pages/SmartMatch";
import WeeklyPlan from "@/pages/WeeklyPlan";
import Nutrition from "@/pages/Nutrition";
import Achievements from "@/pages/Achievements";
import Compare from "@/pages/Compare";
import { useTheme } from "@/hooks/useTheme";

function ThemeInitializer({ children }: { children: React.ReactNode }) {
  const init = useTheme((s) => s.init);
  useEffect(() => {
    init();
  }, [init]);
  return <>{children}</>;
}

export default function App() {
  return (
    <Router>
      <ThemeInitializer>
        <div className="min-h-screen bg-amber-50 dark:bg-stone-900 transition-colors duration-300">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/recipe/:id" element={<RecipeDetail />} />
            <Route path="/my-recipes" element={<MyRecipes />} />
            <Route path="/recipe/new" element={<RecipeEdit />} />
            <Route path="/recipe/:id/edit" element={<RecipeEdit />} />
            <Route path="/what-to-eat" element={<WhatToEat />} />
            <Route path="/shopping-list" element={<ShoppingList />} />
            <Route path="/history" element={<History />} />
            <Route path="/smart-match" element={<SmartMatch />} />
            <Route path="/weekly-plan" element={<WeeklyPlan />} />
            <Route path="/nutrition" element={<Nutrition />} />
            <Route path="/achievements" element={<Achievements />} />
            <Route path="/compare" element={<Compare />} />
          </Routes>
        </div>
      </ThemeInitializer>
    </Router>
  );
}
