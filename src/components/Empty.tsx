import { Search, HeartOff, UtensilsCrossed } from 'lucide-react'

interface EmptyProps {
  type?: 'no-results' | 'no-favorites' | 'no-custom'
  onAction?: () => void
  message?: string
}

const CONFIGS = {
  'no-results': {
    icon: Search,
    title: '没有找到相关菜谱',
    description: '换个关键词试试吧',
    actionLabel: '清除搜索',
  },
  'no-favorites': {
    icon: HeartOff,
    title: '还没有收藏菜谱',
    description: '浏览菜谱时点击心形即可收藏',
    actionLabel: '去发现菜谱',
  },
  'no-custom': {
    icon: UtensilsCrossed,
    title: '还没有自定义菜谱',
    description: '创建属于你的独家菜谱吧',
    actionLabel: '创建菜谱',
  },
}

export default function Empty({ type = 'no-results', onAction, message }: EmptyProps) {
  if (message) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="mb-4 rounded-full bg-amber-50 p-4">
          <Search className="h-10 w-10 text-orange-400" />
        </div>
        <p className="text-sm text-gray-500">{message}</p>
      </div>
    )
  }

  const config = CONFIGS[type]
  const Icon = config.icon

  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="mb-4 rounded-full bg-amber-50 p-4">
        <Icon className="h-10 w-10 text-orange-400" />
      </div>
      <h3 className="mb-1 text-base font-bold text-amber-900">{config.title}</h3>
      <p className="mb-6 text-sm text-gray-500">{config.description}</p>
      {onAction && (
        <button
          onClick={onAction}
          className="rounded-xl bg-orange-500 px-6 py-2 text-sm font-medium text-white transition hover:bg-orange-600 active:scale-95"
        >
          {config.actionLabel}
        </button>
      )}
    </div>
  )
}
