import { useState } from 'react';
import { Share2, Copy, Image, MessageCircle, X, Check } from 'lucide-react';
import type { Recipe } from '@/types/recipe';

interface ShareButtonProps {
  recipe: Recipe;
}

export default function ShareButton({ recipe }: ShareButtonProps) {
  const [showPanel, setShowPanel] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateText = () => {
    const lines: string[] = [];
    lines.push(`【${recipe.name}】`);
    lines.push('');
    lines.push('食材：');
    recipe.ingredients.forEach((ing) => {
      lines.push(`  ${ing.name} ${ing.amount}`);
    });
    lines.push('');
    lines.push('步骤：');
    recipe.steps.forEach((step) => {
      lines.push(`  ${step.index}. ${step.content}`);
    });
    if (recipe.tips) {
      lines.push('');
      lines.push(`小贴士：${recipe.tips}`);
    }
    return lines.join('\n');
  };

  const handleCopyText = async () => {
    const text = generateText();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleGenerateImage = () => {
    const canvas = document.createElement('canvas');
    const width = 600;
    const padding = 40;
    canvas.width = width;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 计算高度
    let y = padding;
    const lineHeight = 28;
    const titleLineHeight = 40;

    // 背景
    ctx.fillStyle = '#FFFBEB';
    ctx.fillRect(0, 0, width, 2000);

    // 标题
    ctx.fillStyle = '#78350F';
    ctx.font = 'bold 28px sans-serif';
    ctx.fillText(`【${recipe.name}】`, padding, y + titleLineHeight);
    y += titleLineHeight + 20;

    // 分割线
    ctx.fillStyle = '#F97316';
    ctx.fillRect(padding, y, width - padding * 2, 2);
    y += 20;

    // 食材
    ctx.fillStyle = '#92400E';
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText('食材', padding, y + lineHeight);
    y += lineHeight + 10;

    ctx.font = '16px sans-serif';
    ctx.fillStyle = '#78350F';
    recipe.ingredients.forEach((ing) => {
      ctx.fillText(`${ing.name}  ${ing.amount}`, padding + 20, y + lineHeight);
      y += lineHeight;
    });
    y += 10;

    // 步骤
    ctx.fillStyle = '#92400E';
    ctx.font = 'bold 20px sans-serif';
    ctx.fillText('步骤', padding, y + lineHeight);
    y += lineHeight + 10;

    ctx.font = '16px sans-serif';
    ctx.fillStyle = '#78350F';
    recipe.steps.forEach((step) => {
      const text = `${step.index}. ${step.content}`;
      // 简单换行
      const maxWidth = width - padding * 2 - 20;
      const words = text.split('');
      let line = '';
      for (const char of words) {
        const testLine = line + char;
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && line) {
          ctx.fillText(line, padding + 20, y + lineHeight);
          y += lineHeight;
          line = char;
        } else {
          line = testLine;
        }
      }
      if (line) {
        ctx.fillText(line, padding + 20, y + lineHeight);
        y += lineHeight;
      }
      y += 5;
    });

    // 小贴士
    if (recipe.tips) {
      y += 10;
      ctx.fillStyle = '#92400E';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText('小贴士', padding, y + lineHeight);
      y += lineHeight + 10;
      ctx.font = '16px sans-serif';
      ctx.fillStyle = '#78350F';
      ctx.fillText(recipe.tips, padding + 20, y + lineHeight);
      y += lineHeight;
    }

    // 底部水印
    y += 30;
    ctx.fillStyle = '#D97706';
    ctx.font = '14px sans-serif';
    ctx.fillText('来自「家常菜谱」APP', padding, y + 20);

    // 裁剪canvas
    canvas.height = y + 60;
    // 重新绘制背景
    ctx.fillStyle = '#FFFBEB';
    ctx.fillRect(0, 0, width, canvas.height);

    // 重新绘制所有内容（简化：直接用文字版本下载）
    const textContent = generateText();
    const finalCanvas = document.createElement('canvas');
    finalCanvas.width = width;
    finalCanvas.height = canvas.height;
    const fctx = finalCanvas.getContext('2d');
    if (!fctx) return;

    fctx.fillStyle = '#FFFBEB';
    fctx.fillRect(0, 0, width, finalCanvas.height);

    let fy = padding;
    fctx.fillStyle = '#78350F';
    fctx.font = 'bold 28px sans-serif';
    fctx.fillText(`【${recipe.name}】`, padding, fy + 40);
    fy += 60;

    fctx.fillStyle = '#F97316';
    fctx.fillRect(padding, fy, width - padding * 2, 2);
    fy += 20;

    fctx.fillStyle = '#92400E';
    fctx.font = 'bold 20px sans-serif';
    fctx.fillText('食材', padding, fy + 28);
    fy += 38;

    fctx.font = '16px sans-serif';
    fctx.fillStyle = '#78350F';
    recipe.ingredients.forEach((ing) => {
      fctx.fillText(`${ing.name}  ${ing.amount}`, padding + 20, fy + 28);
      fy += 28;
    });
    fy += 10;

    fctx.fillStyle = '#92400E';
    fctx.font = 'bold 20px sans-serif';
    fctx.fillText('步骤', padding, fy + 28);
    fy += 38;

    fctx.font = '16px sans-serif';
    fctx.fillStyle = '#78350F';
    recipe.steps.forEach((step) => {
      const text = `${step.index}. ${step.content}`;
      const maxWidth = width - padding * 2 - 20;
      const words = text.split('');
      let line = '';
      for (const char of words) {
        const testLine = line + char;
        const metrics = fctx.measureText(testLine);
        if (metrics.width > maxWidth && line) {
          fctx.fillText(line, padding + 20, fy + 28);
          fy += 28;
          line = char;
        } else {
          line = testLine;
        }
      }
      if (line) {
        fctx.fillText(line, padding + 20, fy + 28);
        fy += 28;
      }
      fy += 5;
    });

    if (recipe.tips) {
      fy += 10;
      fctx.fillStyle = '#92400E';
      fctx.font = 'bold 20px sans-serif';
      fctx.fillText('小贴士', padding, fy + 28);
      fy += 38;
      fctx.font = '16px sans-serif';
      fctx.fillStyle = '#78350F';
      fctx.fillText(recipe.tips, padding + 20, fy + 28);
      fy += 28;
    }

    fy += 30;
    fctx.fillStyle = '#D97706';
    fctx.font = '14px sans-serif';
    fctx.fillText('来自「家常菜谱」APP', padding, fy + 20);

    // 下载
    const link = document.createElement('a');
    link.download = `${recipe.name}.png`;
    link.href = finalCanvas.toDataURL('image/png');
    link.click();
  };

  const handleWechatShare = async () => {
    const text = generateText();
    try {
      await navigator.clipboard.writeText(text);
      alert('菜谱内容已复制到剪贴板，请打开微信粘贴分享');
    } catch {
      alert('请手动复制菜谱内容分享到微信');
    }
  };

  return (
    <>
      <button
        onClick={() => setShowPanel(true)}
        className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium bg-amber-50 text-amber-600 border border-amber-200"
      >
        <Share2 className="w-4 h-4" />
        分享
      </button>

      {showPanel && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-end justify-center" onClick={() => setShowPanel(false)}>
          <div
            className="bg-white rounded-t-2xl w-full max-w-md p-6 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-amber-900">分享菜谱</h3>
              <button onClick={() => setShowPanel(false)}>
                <X className="w-5 h-5 text-amber-400" />
              </button>
            </div>

            {/* 菜谱摘要 */}
            <div className="bg-amber-50 rounded-xl p-3 mb-4 max-h-32 overflow-y-auto">
              <p className="text-sm text-amber-700 font-medium">{recipe.name}</p>
              <p className="text-xs text-amber-500 mt-1">
                食材：{recipe.ingredients.slice(0, 5).map((i) => i.name).join('、')}
                {recipe.ingredients.length > 5 ? '...' : ''}
              </p>
              <p className="text-xs text-amber-500 mt-0.5">
                共{recipe.steps.length}个步骤
              </p>
            </div>

            {/* 分享选项 */}
            <div className="grid grid-cols-3 gap-4">
              <button
                onClick={handleCopyText}
                className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-amber-50 transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                  {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5 text-orange-500" />}
                </div>
                <span className="text-xs text-amber-700">{copied ? '已复制' : '复制文字'}</span>
              </button>

              <button
                onClick={handleGenerateImage}
                className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-amber-50 transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <Image className="w-5 h-5 text-blue-500" />
                </div>
                <span className="text-xs text-amber-700">生成图片</span>
              </button>

              <button
                onClick={handleWechatShare}
                className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-amber-50 transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-green-500" />
                </div>
                <span className="text-xs text-amber-700">微信分享</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
