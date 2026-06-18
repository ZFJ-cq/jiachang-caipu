import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, FolderPlus, FolderOpen, X } from 'lucide-react';
import { useRecipeStore } from '@/store/recipeStore';
import RecipeCard from '@/components/RecipeCard';
import Empty from '@/components/Empty';
import BottomNav from '@/components/BottomNav';

export default function MyRecipes() {
  const navigate = useNavigate();
  const { favorites, customRecipes, loadFavorites, loadCustomRecipes, favoriteGroups, loadFavoriteGroups, addFavoriteGroup, deleteFavoriteGroup, addRecipeToGroup, removeRecipeFromGroup } = useRecipeStore();
  const [activeTab, setActiveTab] = useState<'favorites' | 'custom'>('favorites');
  const [activeGroup, setActiveGroup] = useState<string>('all');
  const [showNewGroup, setShowNewGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [showAddToGroup, setShowAddToGroup] = useState<string | null>(null);

  useEffect(() => {
    loadFavorites();
    loadCustomRecipes();
    loadFavoriteGroups();
  }, [loadFavorites, loadCustomRecipes, loadFavoriteGroups]);

  const filteredFavorites = activeGroup === 'all'
    ? favorites
    : activeGroup === 'recent'
    ? [...favorites].reverse().slice(0, 10)
    : favorites.filter((f) => {
        const group = favoriteGroups.find((g) => g.id === activeGroup);
        return group?.recipeIds.includes(f.id);
      });

  const handleCreateGroup = () => {
    if (newGroupName.trim()) {
      addFavoriteGroup(newGroupName.trim());
      setNewGroupName('');
      setShowNewGroup(false);
    }
  };

  const handleAddToGroup = (groupId: string, recipeId: string) => {
    addRecipeToGroup(groupId, recipeId);
    setShowAddToGroup(null);
  };

  return (
    <div className="min-h-screen bg-amber-50 dark:bg-stone-900 pb-24">
      {/* 顶部标题 */}
      <div className="bg-white dark:bg-stone-800 border-b border-amber-100 dark:border-stone-700 px-4 pt-10 pb-4">
        <h1 className="text-xl font-bold text-amber-900 dark:text-stone-100">我的菜谱</h1>
      </div>

      {/* Tab切换 */}
      <div className="px-4 pt-3">
        <div className="flex bg-white dark:bg-stone-800 rounded-xl border border-amber-200 dark:border-stone-700 p-1">
          <button
            onClick={() => setActiveTab('favorites')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'favorites' ? 'bg-orange-500 text-white' : 'text-amber-600 dark:text-stone-400'
            }`}
          >
            收藏
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'custom' ? 'bg-orange-500 text-white' : 'text-amber-600 dark:text-stone-400'
            }`}
          >
            自定义菜谱
          </button>
        </div>
      </div>

      {/* 收藏Tab - 分组管理 */}
      {activeTab === 'favorites' && (
        <div className="px-4 mt-3">
          {/* 分组导航 */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-2">
            <button
              onClick={() => setActiveGroup('all')}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                activeGroup === 'all'
                  ? 'bg-orange-500 text-white'
                  : 'bg-amber-100 dark:bg-stone-700 text-amber-700 dark:text-stone-300'
              }`}
            >
              全部
            </button>
            <button
              onClick={() => setActiveGroup('recent')}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                activeGroup === 'recent'
                  ? 'bg-orange-500 text-white'
                  : 'bg-amber-100 dark:bg-stone-700 text-amber-700 dark:text-stone-300'
              }`}
            >
              最近收藏
            </button>
            {favoriteGroups.map((group) => (
              <div key={group.id} className="shrink-0 flex items-center gap-1">
                <button
                  onClick={() => setActiveGroup(group.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    activeGroup === group.id
                      ? 'bg-orange-500 text-white'
                      : 'bg-amber-100 dark:bg-stone-700 text-amber-700 dark:text-stone-300'
                  }`}
                >
                  {group.name}
                </button>
                <button
                  onClick={() => deleteFavoriteGroup(group.id)}
                  className="w-4 h-4 flex items-center justify-center"
                >
                  <X className="w-3 h-3 text-amber-400 dark:text-stone-500 hover:text-red-500" />
                </button>
              </div>
            ))}
            <button
              onClick={() => setShowNewGroup(true)}
              className="shrink-0 px-3 py-1.5 rounded-full text-xs font-medium bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-300 flex items-center gap-1"
            >
              <FolderPlus className="w-3 h-3" />
              新建分组
            </button>
          </div>

          {/* 新建分组输入 */}
          {showNewGroup && (
            <div className="flex items-center gap-2 mt-2 bg-white dark:bg-stone-800 rounded-xl p-3 border border-amber-100 dark:border-stone-700">
              <input
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                placeholder="输入分组名称"
                className="flex-1 px-3 py-2 bg-amber-50 dark:bg-stone-700 rounded-lg text-sm text-amber-900 dark:text-stone-100 placeholder-amber-400 dark:placeholder-stone-400 outline-none"
                onKeyDown={(e) => e.key === 'Enter' && handleCreateGroup()}
                autoFocus
              />
              <button
                onClick={handleCreateGroup}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium"
              >
                创建
              </button>
              <button
                onClick={() => { setShowNewGroup(false); setNewGroupName(''); }}
                className="px-3 py-2 bg-amber-100 dark:bg-stone-700 text-amber-600 dark:text-stone-300 rounded-lg text-sm"
              >
                取消
              </button>
            </div>
          )}
        </div>
      )}

      {/* 内容区域 */}
      <div className="px-4 mt-4">
        {activeTab === 'favorites' ? (
          filteredFavorites.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {filteredFavorites.map((recipe) => (
                <div key={recipe.id} className="relative">
                  <RecipeCard recipe={recipe} />
                  {/* 添加到分组按钮 */}
                  {favoriteGroups.length > 0 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowAddToGroup(recipe.id);
                      }}
                      className="absolute top-2 left-2 w-7 h-7 bg-white/80 dark:bg-stone-800/80 rounded-full flex items-center justify-center backdrop-blur-sm z-10"
                    >
                      <FolderOpen className="w-3.5 h-3.5 text-orange-500" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <Empty message="还没有收藏菜谱" />
          )
        ) : customRecipes.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {customRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        ) : (
          <Empty message="还没有自定义菜谱" />
        )}
      </div>

      {/* 添加到分组弹窗 */}
      {showAddToGroup && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-6" onClick={() => setShowAddToGroup(null)}>
          <div className="bg-white dark:bg-stone-800 rounded-2xl p-5 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-bold text-amber-900 dark:text-stone-100 mb-3">添加到分组</h3>
            <div className="space-y-2">
              {favoriteGroups.map((group) => {
                const isInGroup = group.recipeIds.includes(showAddToGroup);
                return (
                  <button
                    key={group.id}
                    onClick={() => {
                      if (isInGroup) {
                        removeRecipeFromGroup(group.id, showAddToGroup);
                      } else {
                        handleAddToGroup(group.id, showAddToGroup);
                      }
                    }}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      isInGroup
                        ? 'bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-300 border border-orange-200 dark:border-orange-700'
                        : 'bg-amber-50 dark:bg-stone-700 text-amber-700 dark:text-stone-200 border border-amber-100 dark:border-stone-600'
                    }`}
                  >
                    <span>{group.name}</span>
                    <span className="text-xs">{group.recipeIds.length}道菜谱</span>
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => setShowAddToGroup(null)}
              className="w-full mt-3 py-2.5 bg-amber-50 dark:bg-stone-700 text-amber-700 dark:text-stone-300 rounded-xl text-sm font-medium"
            >
              关闭
            </button>
          </div>
        </div>
      )}

      {/* 新增按钮（仅自定义Tab显示） */}
      {activeTab === 'custom' && (
        <button
          onClick={() => navigate('/recipe/new')}
          className="fixed bottom-20 right-6 w-14 h-14 bg-orange-500 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-orange-600 transition-colors"
        >
          <Plus className="w-6 h-6" />
        </button>
      )}

      {/* 底部导航 */}
      <BottomNav />
    </div>
  );
}
