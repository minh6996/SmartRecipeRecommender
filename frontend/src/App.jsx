import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import Recipes from './pages/Recipes.jsx';
import RecipeDetail from './pages/RecipeDetail.jsx';
import Recommendations from './pages/Recommendations.jsx';
import Login from './pages/Login.jsx';
import Profile from './pages/Profile.jsx';
import AddRecipe from './pages/AddRecipe.jsx';
import EditRecipe from './pages/EditRecipe.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="recipes" element={<Recipes />} />
          <Route path="recipes/:id" element={<RecipeDetail />} />
          <Route path="recommendations" element={<Recommendations />} />
          <Route path="login" element={<Login />} />
          <Route path="profile" element={<Profile />} />
          <Route path="add-recipe" element={<AddRecipe />} />
          <Route path="recipes/:id/edit" element={<EditRecipe />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
