import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiGetRecipeById, apiUpdateRecipe } from '../utils/api.js';

const EditRecipe = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        image: null,
        imageUrl: '', // For preview
        cookingTime: '',
        cuisine: '',
        tags: '',
        ingredients: '',
        steps: ''
    });

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const data = await apiGetRecipeById(id);
                const recipe = data?.item;
                if (!recipe) throw new Error('Recipe not found');

                setFormData({
                    title: recipe.title || '',
                    image: null,
                    imageUrl: recipe.imageUrl || '',
                    cookingTime: recipe.cookingTime || '',
                    cuisine: recipe.cuisine || '',
                    tags: Array.isArray(recipe.tags) ? recipe.tags.join(', ') : '',
                    ingredients: Array.isArray(recipe.ingredients) ? recipe.ingredients.join('\n') : '',
                    steps: Array.isArray(recipe.steps) ? recipe.steps.join('\n') : ''
                });
            } catch (err) {
                setError(err?.message || 'Failed to load recipe');
            } finally {
                setIsLoading(false);
            }
        };
        fetchRecipe();
    }, [id]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'image') {
            const file = files[0];
            setFormData(prev => ({
                ...prev,
                image: file,
                imageUrl: URL.createObjectURL(file) // Preview
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsSaving(true);

        try {
            const payload = new FormData();
            payload.append('title', formData.title);
            payload.append('cookingTime', formData.cookingTime);
            payload.append('cuisine', formData.cuisine);
            payload.append('tags', formData.tags);
            payload.append('ingredients', formData.ingredients);
            payload.append('steps', formData.steps);

            // Only append image if a new file is selected
            if (formData.image instanceof File) {
                payload.append('image', formData.image);
            }

            await apiUpdateRecipe(id, payload);
            navigate(`/recipes/${id}`);
        } catch (err) {
            setError(err?.message || 'Failed to update recipe');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return <div className="text-center py-12">Loading...</div>;

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h1 className="text-3xl font-extrabold text-slate-900 mb-8 tracking-tight">Edit Recipe</h1>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center gap-3">
                    <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 shadow-lg rounded-2xl border border-slate-100">
                {/* Title */}
                <div>
                    <label htmlFor="title" className="block text-sm font-bold text-slate-700 mb-1">
                        Recipe Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        required
                        value={formData.title}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-xl border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm border p-3 transition-colors"
                    />
                </div>

                {/* Image File */}
                <div className="bg-slate-50 p-6 rounded-xl border border-dashed border-slate-300 hover:border-primary-400 transition-colors group">
                    <label htmlFor="image" className="block text-sm font-bold text-slate-700 mb-2">
                        Recipe Photo
                    </label>
                    <div className="flex items-center gap-4">
                        {formData.imageUrl && (
                            <div className="relative w-20 h-20 rounded-lg overflow-hidden shadow-sm border border-slate-200">
                                <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                            </div>
                        )}
                        <div className="flex-1">
                            <input
                                type="file"
                                id="image"
                                name="image"
                                accept="image/*"
                                onChange={handleChange}
                                className="block w-full text-sm text-slate-500
                                    file:mr-4 file:py-2.5 file:px-4
                                    file:rounded-full file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-primary-50 file:text-primary-700
                                    hover:file:bg-primary-100
                                    cursor-pointer"
                            />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Cooking Time */}
                    <div>
                        <label htmlFor="cookingTime" className="block text-sm font-bold text-slate-700 mb-1">
                            Cooking Time (minutes)
                        </label>
                        <input
                            type="number"
                            id="cookingTime"
                            name="cookingTime"
                            required
                            min="1"
                            value={formData.cookingTime}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-xl border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm border p-3"
                        />
                    </div>

                    {/* Cuisine */}
                    <div>
                        <label htmlFor="cuisine" className="block text-sm font-bold text-slate-700 mb-1">
                            Cuisine / Country
                        </label>
                        <input
                            type="text"
                            id="cuisine"
                            name="cuisine"
                            required
                            value={formData.cuisine}
                            onChange={handleChange}
                            placeholder="e.g. Vietnamese, Italian"
                            className="mt-1 block w-full rounded-xl border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm border p-3"
                        />
                    </div>
                </div>

                {/* Tags */}
                <div>
                    <label htmlFor="tags" className="block text-sm font-bold text-slate-700 mb-1">
                        Tags
                        <span className="ml-2 text-xs font-normal text-slate-400">(comma separated)</span>
                    </label>
                    <input
                        type="text"
                        id="tags"
                        name="tags"
                        value={formData.tags}
                        onChange={handleChange}
                        placeholder="healthy, quick, breakfast"
                        className="mt-1 block w-full rounded-xl border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm border p-3"
                    />
                </div>

                {/* Ingredients */}
                <div>
                    <label htmlFor="ingredients" className="block text-sm font-bold text-slate-700 mb-1">
                        Ingredients
                        <span className="ml-2 text-xs font-normal text-slate-400">(one per line)</span>
                    </label>
                    <textarea
                        id="ingredients"
                        name="ingredients"
                        rows={5}
                        required
                        value={formData.ingredients}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-xl border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm border p-3 font-mono text-sm leading-relaxed"
                    />
                </div>

                {/* Instructions */}
                <div>
                    <label htmlFor="steps" className="block text-sm font-bold text-slate-700 mb-1">
                        Instructions
                        <span className="ml-2 text-xs font-normal text-slate-400">(one per line)</span>
                    </label>
                    <textarea
                        id="steps"
                        name="steps"
                        rows={5}
                        required
                        value={formData.steps}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-xl border-slate-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm border p-3 font-mono text-sm leading-relaxed"
                    />
                </div>

                {/* Submit Button */}
                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={isSaving}
                        className={`inline-flex items-center justify-center px-8 py-3.5 border border-transparent shadow-lg text-base font-bold rounded-xl text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all hover:-translate-y-1 ${isSaving ? 'opacity-70 cursor-not-allowed' : ''
                            }`}
                    >
                        {isSaving ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Saving...
                            </>
                        ) : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditRecipe;
