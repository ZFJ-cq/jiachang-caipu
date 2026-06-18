import { Recipe } from '@/types/recipe';

const LUCKYCOLA_API_URL = 'https://luckycola.com.cn/food/getFoodMenu';
// 用户需要在设置中配置自己的appKey和uid
const APP_KEY = '6626c7b48c6f4e7e9a8e5d3c1b2a4f6e';
const UID = 'recipeapp001';

interface LuckycolaStep {
  index: number;
  image: string;
  content: string;
}

interface LuckycolaMenuItem {
  id: string;
  title: string;
  intro: string;
  image: string;
  ingredients: Record<string, string>;
  steps: LuckycolaStep[];
  notice: string;
  level: string;
  craft: string;
  duration: string;
  flavor: string;
  tags: string[];
}

interface LuckycolaResponse {
  code: number;
  msg: string;
  data: {
    foodMenu: LuckycolaMenuItem[];
  };
}

function mapToRecipe(item: LuckycolaMenuItem): Recipe {
  const ingredients = Object.entries(item.ingredients).map(([name, amount]) => ({
    name,
    amount,
  }));

  return {
    id: `lc_${item.id}`,
    name: item.title,
    category: item.craft || '其他',
    scene: '家常菜',
    difficulty: item.level || '普通',
    duration: item.duration || '未知',
    calories: '',
    coverImage: item.image || '',
    ingredients,
    steps: item.steps.map((s) => ({
      index: s.index,
      content: s.content,
      image: s.image || undefined,
    })),
    tips: item.notice || '',
    source: 'luckycola',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export async function searchRecipesByKeyword(keyword: string): Promise<Recipe[]> {
  try {
    const response = await fetch(LUCKYCOLA_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        foodTitle: keyword,
        appKey: APP_KEY,
        uid: UID,
      }),
    });

    const data: LuckycolaResponse = await response.json();

    if (data.code === 0 && data.data?.foodMenu) {
      return data.data.foodMenu.map(mapToRecipe);
    }

    return [];
  } catch (error) {
    console.error('Luckycola API error:', error);
    return [];
  }
}
