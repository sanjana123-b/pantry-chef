import React, { useRef, useEffect } from 'react';

/**
 * Procedural HTML5 Canvas Vintage Woodcut / Charcoal Sketch Generator
 * Renders an authentic vintage cookbook engraving based on recipe title and ingredients.
 */
export default function VintageSketchCanvas({
  title = 'Culinary Dish',
  ingredients = [],
  className = 'w-full h-44 rounded-xl',
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = (canvas.width = 400);
    const height = (canvas.height = 200);

    // Simple deterministic hash from title
    let seed = 0;
    for (let i = 0; i < title.length; i++) {
      seed = (seed * 31 + title.charCodeAt(i)) % 10000;
    }

    // 1. Parchment paper background
    ctx.fillStyle = '#FAF4E6';
    ctx.fillRect(0, 0, width, height);

    // Subtle paper grain dots
    ctx.fillStyle = 'rgba(43, 35, 32, 0.03)';
    for (let i = 0; i < 400; i++) {
      const rx = ((seed * (i + 1) * 17) % width);
      const ry = ((seed * (i + 1) * 23) % height);
      ctx.fillRect(rx, ry, 1.5, 1.5);
    }

    // 2. Woodcut border frame
    ctx.strokeStyle = '#3D332F';
    ctx.lineWidth = 2.5;
    ctx.strokeRect(10, 10, width - 20, height - 20);

    ctx.lineWidth = 1;
    ctx.setLineDash([4, 2]);
    ctx.strokeRect(14, 14, width - 28, height - 28);
    ctx.setLineDash([]); // reset

    // 3. Central Woodcut Engraving
    ctx.strokeStyle = '#2B2320';
    ctx.fillStyle = '#2B2320';

    const cx = width / 2;
    const cy = height / 2 + 10;
    const lowerTitle = title.toLowerCase();

    // Determine motif based on keywords
    const isSkillet = lowerTitle.includes('skillet') || lowerTitle.includes('pan') || lowerTitle.includes('omelet');
    const isPot = lowerTitle.includes('pot') || lowerTitle.includes('stew') || lowerTitle.includes('simmer') || lowerTitle.includes('soup');
    const isBake = lowerTitle.includes('bake') || lowerTitle.includes('crisp') || lowerTitle.includes('roast');

    if (isSkillet || (!isPot && !isBake)) {
      // Draw Cast Iron Skillet Woodcut
      ctx.lineWidth = 3;
      // Pan Oval
      ctx.beginPath();
      ctx.ellipse(cx, cy, 70, 32, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Pan handle
      ctx.beginPath();
      ctx.moveTo(cx + 68, cy - 5);
      ctx.lineTo(cx + 120, cy - 25);
      ctx.lineTo(cx + 115, cy - 35);
      ctx.lineTo(cx + 62, cy - 12);
      ctx.stroke();

      // Food sizzling inside pan (cross-hatching)
      ctx.lineWidth = 1.2;
      for (let h = -45; h < 45; h += 8) {
        ctx.beginPath();
        ctx.moveTo(cx + h - 10, cy - 10);
        ctx.lineTo(cx + h + 10, cy + 10);
        ctx.stroke();
      }

      // Egg / produce yolks
      ctx.beginPath();
      ctx.arc(cx - 20, cy, 9, 0, Math.PI * 2);
      ctx.arc(cx + 15, cy + 2, 8, 0, Math.PI * 2);
      ctx.stroke();
    } else if (isPot) {
      // Draw Stock Pot with Handles Woodcut
      ctx.lineWidth = 3;
      // Pot rim
      ctx.beginPath();
      ctx.ellipse(cx, cy - 20, 50, 14, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Pot body
      ctx.beginPath();
      ctx.moveTo(cx - 50, cy - 20);
      ctx.lineTo(cx - 45, cy + 30);
      ctx.quadraticCurveTo(cx, cy + 45, cx + 45, cy + 30);
      ctx.lineTo(cx + 50, cy - 20);
      ctx.stroke();

      // Side handles
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(cx - 52, cy - 5, 10, Math.PI * 0.5, Math.PI * 1.5);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx + 52, cy - 5, 10, Math.PI * 1.5, Math.PI * 0.5);
      ctx.stroke();

      // Pot cross-hatching shading
      ctx.lineWidth = 1;
      for (let y = cy - 10; y < cy + 25; y += 6) {
        ctx.beginPath();
        ctx.moveTo(cx - 38, y);
        ctx.lineTo(cx - 15, y);
        ctx.stroke();
      }
    } else {
      // Draw Casserole / Bake Dish
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(cx - 65, cy - 22, 130, 48, 12);
      ctx.stroke();

      // Textured crust
      ctx.lineWidth = 1.2;
      for (let i = 0; i < 8; i++) {
        ctx.beginPath();
        ctx.arc(cx - 40 + i * 12, cy + (i % 2 === 0 ? -4 : 4), 6, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    // 4. Steam Curls (Woodcut engraving lines)
    ctx.lineWidth = 1.8;
    ctx.strokeStyle = '#C1502E'; // Burnt tomato accent
    for (let s = -20; s <= 20; s += 20) {
      ctx.beginPath();
      ctx.moveTo(cx + s, cy - 35);
      ctx.bezierCurveTo(cx + s - 10, cy - 55, cx + s + 15, cy - 70, cx + s, cy - 85);
      ctx.stroke();
    }

    // 5. Engraved Bottom Banner
    ctx.fillStyle = '#2B2320';
    ctx.font = 'bold 9px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('★ KITCHEN LEDGER WOODCUT ★', cx, height - 18);
  }, [title, ingredients]);

  return (
    <div className="relative overflow-hidden border border-[#D9CBAC] rounded-xl shadow-inner bg-[#FAF4E6]">
      <canvas
        ref={canvasRef}
        className={className}
        style={{ width: '100%', height: 'auto', display: 'block' }}
      />
    </div>
  );
}
