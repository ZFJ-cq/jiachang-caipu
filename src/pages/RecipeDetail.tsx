import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Heart, Clock, Flame, MapPin, Pencil, Trash2, Timer, ShoppingCart, ChefHat, Check } from 'lucide-react';
import { useRecipeStore } from '@/store/recipeStore';
import IngredientList from '@/components/IngredientList';
import StepList from '@/components/StepList';
import TipsBox from '@/components/TipsBox';
import CookTimer from '@/components/CookTimer';
import StarRating from '@/components/StarRating';
import ShareButton from '@/components/ShareButton';

export default function RecipeDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getRecipeById, isFavorite, toggleFavorite, deleteCustomRecipe, addBrowseHistory, addIngredientsToList, addCookRecord, checkAchievements } = useRecipeStore();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [addedToList, setAddedToList] = useState(false);
  const [markedCooked, setMarkedCooked] = useState(false);

  const recipe = id ? getRecipeById(id) : undefined;
  const favorited = id ? isFavorite(id) : false;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    if (recipe) {
      addBrowseHistory(recipe);
    }
  }, [recipe, addBrowseHistory]);

  if (!recipe) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <p className="text-amber-400">菜谱不存在</p>
      </div>
    );
  }

  const coverSrc = recipe.coverImage || recipe.image;

  const handleDelete = () => {
    if (id) {
      deleteCustomRecipe(id);
      navigate(-1);
    }
  };

  const handleAddToShoppingList = () => {
    addIngredientsToList(recipe.ingredients, recipe.name);
    setAddedToList(true);
    setTimeout(() => setAddedToList(false), 2000);
  };

  const handleMarkCooked = () => {
    if (markedCooked || !recipe) return;
    addCookRecord({
      recipeId: recipe.id,
      recipeName: recipe.name,
      calories: recipe.calories || '',
      cookedAt: new Date().toISOString(),
    });
    checkAchievements();
    setMarkedCooked(true);
  };

  return (
    <div className="min-h-screen bg-amber-50 pb-24">
      {/* 顶部导航 */}
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm border-b border-amber-100 px-4 py-3 flex items-center justify-between">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5 text-amber-700" />
        </button>
        <h1 className="font-bold text-amber-900 text-base truncate max-w-[60%]">{recipe.name}</h1>
        <button onClick={() => toggleFavorite(recipe)}>
          <Heart className={`w-5 h-5 ${favorited ? 'fill-green-500 text-green-500' : 'text-amber-300'}`} />
        </button>
      </div>

      {/* 封面图 */}
      <div className="aspect-[16/9] bg-gradient-to-br from-orange-300 to-amber-200 flex items-center justify-center">
        {coverSrc ? (
          <img src={coverSrc} alt={recipe.name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-8xl font-bold text-white/80">{recipe.name[0]}</span>
        )}
      </div>

      {/* 基础信息标签 */}
      <div className="flex items-center gap-3 px-4 py-3 overflow-x-auto scrollbar-hide">
        <span className="shrink-0 px-3 py-1 bg-orange-100 text-orange-600 rounded-xl text-xs font-medium">
          {recipe.difficulty}
        </span>
        <span className="shrink-0 flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-700 rounded-xl text-xs">
          <Clock className="w-3 h-3" />
          {recipe.duration}
        </span>
        {recipe.calories && (
          <span className="shrink-0 flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-700 rounded-xl text-xs">
            <Flame className="w-3 h-3" />
            {recipe.calories}
          </span>
        )}
        {(recipe.cuisine || recipe.scene) && (
          <span className="shrink-0 flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-700 rounded-xl text-xs">
            <MapPin className="w-3 h-3" />
            {recipe.cuisine || recipe.scene}
          </span>
        )}
      </div>

      {/* 评分区域 */}
      <div className="px-4 py-3 bg-white mx-4 rounded-xl border border-amber-100">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-amber-700">我的评分</span>
          <StarRating recipeId={recipe.id} size="md" />
        </div>
      </div>

      {/* 内容区域 */}
      <div className="px-4 space-y-4 mt-4">
        {/* 食材区域 + 购物清单按钮 */}
        <div className="relative">
          <button
            onClick={handleAddToShoppingList}
            className={`absolute top-0 right-0 flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors z-10 ${
              addedToList
                ? 'bg-green-100 text-green-600'
                : 'bg-orange-100 text-orange-600 hover:bg-orange-200'
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            {addedToList ? '已添加' : '加入购物清单'}
          </button>
          <IngredientList ingredients={recipe.ingredients} />
        </div>

        {/* 步骤区域 + 计时器按钮 */}
        <div className="relative">
          <button
            onClick={() => setShowTimer(true)}
            className="absolute top-0 right-0 flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-orange-100 text-orange-600 hover:bg-orange-200 transition-colors z-10"
          >
            <Timer className="w-3.5 h-3.5" />
            计时器
          </button>
          <StepList steps={recipe.steps} />
        </div>

        {recipe.tips && <TipsBox tips={recipe.tips} />}
      </div>

      {/* 底部操作栏 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-amber-100 px-4 py-3 flex items-center gap-3 z-20">
        <button
          onClick={() => toggleFavorite(recipe)}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
            favorited
              ? 'bg-green-50 text-green-600 border border-green-200'
              : 'bg-amber-50 text-amber-600 border border-amber-200'
          }`}
        >
          <Heart className={`w-4 h-4 ${favorited ? 'fill-green-500' : ''}`} />
          {favorited ? '已收藏' : '收藏'}
        </button>
        <button
          onClick={handleMarkCooked}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
            markedCooked
              ? 'bg-orange-100 text-orange-600 border border-orange-200'
              : 'bg-orange-500 text-white'
          }`}
          disabled={markedCooked}
        >
          {markedCooked ? <Check className="w-4 h-4" /> : <ChefHat className="w-4 h-4" />}
          {markedCooked ? '已做' : '标记已做'}
        </button>
        <ShareButton recipe={recipe} />
        {recipe.isCustom && (
          <>
            <button
              onClick={() => navigate(`/recipe/${recipe.id}/edit`)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium bg-orange-500 text-white"
            >
              <Pencil className="w-4 h-4" />
              编辑
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium bg-red-50 text-red-500 border border-red-200"
            >
              <Trash2 className="w-4 h-4" />
              删除
            </button>
          </>
        )}
      </div>

      {/* 删除确认弹窗 */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-6">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-bold text-amber-900 mb-2">确认删除</h3>
            <p className="text-amber-600 text-sm mb-6">删除后将无法恢复，确定要删除这道菜谱吗？</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-amber-50 text-amber-700 border border-amber-200"
              >
                取消
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-red-500 text-white"
              >
                删除
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 计时器浮窗 */}
      {showTimer && (
        <CookTimer floating onClose={() => setShowTimer(false)} />
      )}
    </div>
  );
}
