import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { useRecipeStore } from '@/store/recipeStore';
import { CATEGORIES, DIFFICULTIES } from '@/types/recipe';
import type { Ingredient, Step } from '@/types/recipe';

export default function RecipeEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getRecipeById, addCustomRecipe, updateCustomRecipe } = useRecipeStore();
  const isEdit = id && id !== 'new';

  const [name, setName] = useState('');
  const [category, setCategory] = useState('家常菜');
  const [difficulty, setDifficulty] = useState('简单');
  const [duration, setDuration] = useState('');
  const [calories, setCalories] = useState('');
  const [ingredients, setIngredients] = useState<Ingredient[]>([{ name: '', amount: '' }]);
  const [steps, setSteps] = useState<Step[]>([{ index: 1, content: '' }]);
  const [tips, setTips] = useState('');
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    if (isEdit) {
      const recipe = getRecipeById(id!);
      if (recipe) {
        setName(recipe.name);
        setCategory(recipe.category);
        setDifficulty(recipe.difficulty);
        setDuration(recipe.duration);
        setCalories(recipe.calories || '');
        setIngredients(recipe.ingredients.length > 0 ? recipe.ingredients : [{ name: '', amount: '' }]);
        setSteps(recipe.steps.length > 0 ? recipe.steps : [{ index: 1, content: '' }]);
        setTips(recipe.tips || '');
      }
    }
  }, [id, isEdit, getRecipeById]);

  const addIngredient = () => {
    setIngredients([...ingredients, { name: '', amount: '' }]);
  };

  const removeIngredient = (index: number) => {
    if (ingredients.length <= 1) return;
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const updateIngredient = (idx: number, field: keyof Ingredient, value: string) => {
    const updated = [...ingredients];
    updated[idx] = { ...updated[idx], [field]: value };
    setIngredients(updated);
  };

  const addStep = () => {
    setSteps([...steps, { index: steps.length + 1, content: '' }]);
  };

  const removeStep = (idx: number) => {
    if (steps.length <= 1) return;
    const updated = steps.filter((_, i) => i !== idx);
    updated.forEach((s, i) => (s.index = i + 1));
    setSteps(updated);
  };

  const updateStep = (idx: number, content: string) => {
    const updated = [...steps];
    updated[idx] = { ...updated[idx], content };
    setSteps(updated);
  };

  const validate = (): string[] => {
    const errs: string[] = [];
    if (!name.trim()) errs.push('请输入菜名');
    if (!ingredients.some((i) => i.name.trim())) errs.push('请至少添加一个食材');
    if (!steps.some((s) => s.content.trim())) errs.push('请至少添加一个步骤');
    return errs;
  };

  const handleSave = () => {
    const errs = validate();
    if (errs.length > 0) {
      setErrors(errs);
      return;
    }

    const validIngredients = ingredients.filter((i) => i.name.trim());
    const validSteps = steps.filter((s) => s.content.trim()).map((s, i) => ({ ...s, index: i + 1 }));
    const now = new Date().toISOString();

    const recipeData: import('@/types/recipe').Recipe = {
      id: isEdit ? id! : `custom_${Date.now()}`,
      name: name.trim(),
      category,
      scene: category,
      difficulty,
      duration: duration || '15-30分钟',
      calories: calories || '',
      coverImage: '',
      ingredients: validIngredients,
      steps: validSteps,
      tips: tips.trim(),
      source: 'custom',
      createdAt: now,
      updatedAt: now,
      isCustom: true,
    };

    if (isEdit) {
      updateCustomRecipe(recipeData);
    } else {
      addCustomRecipe(recipeData);
    }
    navigate('/my-recipes');
  };

  return (
    <div className="min-h-screen bg-amber-50 pb-6">
      {/* 顶部导航 */}
      <div className="sticky top-0 z-10 bg-white border-b border-amber-100 px-4 py-3 flex items-center justify-between">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5 text-amber-700" />
        </button>
        <h1 className="font-bold text-amber-900 text-base">{isEdit ? '编辑菜谱' : '新增菜谱'}</h1>
        <button onClick={handleSave} className="px-4 py-1.5 bg-orange-500 text-white rounded-xl text-sm font-medium">
          保存
        </button>
      </div>

      <div className="px-4 mt-4 space-y-4">
        {/* 错误提示 */}
        {errors.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3">
            {errors.map((err, i) => (
              <p key={i} className="text-red-500 text-sm">{err}</p>
            ))}
          </div>
        )}

        {/* 菜名 */}
        <div>
          <label className="block text-sm font-medium text-amber-800 mb-1">菜名 *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="输入菜名"
            className="w-full px-3 py-2.5 bg-white rounded-xl border border-amber-200 focus:outline-none focus:border-orange-400 text-amber-900 text-sm placeholder-amber-300"
          />
        </div>

        {/* 菜系 + 难度 */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-amber-800 mb-1">菜系</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2.5 bg-white rounded-xl border border-amber-200 focus:outline-none focus:border-orange-400 text-amber-900 text-sm"
            >
              {CATEGORIES.filter((c) => c.key !== 'all').map((c) => (
                <option key={c.key} value={c.key}>{c.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-amber-800 mb-1">难度</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full px-3 py-2.5 bg-white rounded-xl border border-amber-200 focus:outline-none focus:border-orange-400 text-amber-900 text-sm"
            >
              {DIFFICULTIES.filter((d) => d.key).map((d) => (
                <option key={d.key} value={d.key}>{d.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* 时长 + 热量 */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-amber-800 mb-1">烹饪时长</label>
            <input
              type="text"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="如：15-30分钟"
              className="w-full px-3 py-2.5 bg-white rounded-xl border border-amber-200 focus:outline-none focus:border-orange-400 text-amber-900 text-sm placeholder-amber-300"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-amber-800 mb-1">热量（可选）</label>
            <input
              type="text"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              placeholder="如：200kcal"
              className="w-full px-3 py-2.5 bg-white rounded-xl border border-amber-200 focus:outline-none focus:border-orange-400 text-amber-900 text-sm placeholder-amber-300"
            />
          </div>
        </div>

        {/* 食材清单 */}
        <div className="bg-white rounded-xl p-4 border border-amber-100">
          <h3 className="font-bold text-amber-900 text-sm mb-3">食材清单 *</h3>
          <div className="space-y-2">
            {ingredients.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => updateIngredient(index, 'name', e.target.value)}
                  placeholder="食材名"
                  className="flex-1 px-3 py-2 bg-amber-50 rounded-lg border border-amber-100 focus:outline-none focus:border-orange-400 text-amber-900 text-sm placeholder-amber-300"
                />
                <input
                  type="text"
                  value={item.amount}
                  onChange={(e) => updateIngredient(index, 'amount', e.target.value)}
                  placeholder="用量"
                  className="w-24 px-3 py-2 bg-amber-50 rounded-lg border border-amber-100 focus:outline-none focus:border-orange-400 text-amber-900 text-sm placeholder-amber-300"
                />
                {ingredients.length > 1 && (
                  <button onClick={() => removeIngredient(index)} className="shrink-0">
                    <X className="w-4 h-4 text-red-400 hover:text-red-500" />
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            onClick={addIngredient}
            className="mt-2 flex items-center gap-1 text-sm text-orange-500 hover:text-orange-600"
          >
            <Plus className="w-4 h-4" />
            添加食材
          </button>
        </div>

        {/* 烹饪步骤 */}
        <div className="bg-white rounded-xl p-4 border border-amber-100">
          <h3 className="font-bold text-amber-900 text-sm mb-3">烹饪步骤 *</h3>
          <div className="space-y-2">
            {steps.map((step, index) => (
              <div key={index} className="flex items-start gap-2">
                <span className="shrink-0 w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs font-bold mt-2">
                  {index + 1}
                </span>
                <textarea
                  value={step.content}
                  onChange={(e) => updateStep(index, e.target.value)}
                  placeholder="描述步骤..."
                  rows={2}
                  className="flex-1 px-3 py-2 bg-amber-50 rounded-lg border border-amber-100 focus:outline-none focus:border-orange-400 text-amber-900 text-sm placeholder-amber-300 resize-none"
                />
                {steps.length > 1 && (
                  <button onClick={() => removeStep(index)} className="shrink-0 mt-2">
                    <X className="w-4 h-4 text-red-400 hover:text-red-500" />
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            onClick={addStep}
            className="mt-2 flex items-center gap-1 text-sm text-orange-500 hover:text-orange-600"
          >
            <Plus className="w-4 h-4" />
            添加步骤
          </button>
        </div>

        {/* 烹饪提醒 */}
        <div>
          <label className="block text-sm font-medium text-amber-800 mb-1">烹饪提醒（可选）</label>
          <textarea
            value={tips}
            onChange={(e) => setTips(e.target.value)}
            placeholder="输入烹饪小贴士..."
            rows={3}
            className="w-full px-3 py-2.5 bg-white rounded-xl border border-amber-200 focus:outline-none focus:border-orange-400 text-amber-900 text-sm placeholder-amber-300 resize-none"
          />
        </div>
      </div>
    </div>
  );
}
