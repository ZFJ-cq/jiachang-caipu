import { useState, useRef, useEffect } from 'react'
import { Search, X } from 'lucide-react'
import { useRecipeStore } from '@/store/recipeStore'

interface SearchBarProps {
  onSearch: (keyword: string) => void
  placeholder?: string
  defaultValue?: string
}

export default function SearchBar({ onSearch, placeholder = '搜索菜谱...', defaultValue = '' }: SearchBarProps) {
  const [keyword, setKeyword] = useState(defaultValue)
  const [showHistory, setShowHistory] = useState(false)
  const { searchHistory, addSearchHistory, clearSearchHistory } = useRecipeStore()
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setKeyword(defaultValue)
  }, [defaultValue])

  const handleSearch = () => {
    const trimmed = keyword.trim()
    if (!trimmed) return
    addSearchHistory(trimmed)
    onSearch(trimmed)
    setShowHistory(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch()
  }

  const handleHistoryClick = (item: string) => {
    setKeyword(item)
    onSearch(item)
    setShowHistory(false)
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowHistory(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onFocus={() => setShowHistory(true)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-amber-900 placeholder-gray-400 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
          />
          {keyword && (
            <button
              onClick={() => setKeyword('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <button
          onClick={handleSearch}
          className="rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-orange-600 active:scale-95"
        >
          搜索
        </button>
      </div>

      {showHistory && searchHistory.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-10 mt-1 rounded-xl border border-gray-100 bg-white py-1 shadow-lg">
          <div className="flex items-center justify-between px-4 py-2">
            <span className="text-xs font-medium text-gray-500">搜索历史</span>
            <button
              onClick={clearSearchHistory}
              className="text-xs text-gray-400 hover:text-red-500"
            >
              清空
            </button>
          </div>
          {searchHistory.slice(0, 5).map((item) => (
            <button
              key={item}
              onClick={() => handleHistoryClick(item)}
              className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-amber-900 transition hover:bg-amber-50"
            >
              <Search className="h-3.5 w-3.5 text-gray-400" />
              {item}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
