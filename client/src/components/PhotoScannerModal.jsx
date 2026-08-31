import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Upload, Sparkles, X, Check, RefreshCw, AlertCircle, CheckCircle2, Image as ImageIcon } from 'lucide-react';
import { scanPantryPhoto } from '../api/client';

export default function PhotoScannerModal({ isOpen, onClose, onAddIngredients }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [mimeType, setMimeType] = useState('image/jpeg');
  const [isScanning, setIsScanning] = useState(false);
  const [detectedItems, setDetectedItems] = useState([]);
  const [selectedTokens, setSelectedTokens] = useState({});
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setMimeType(file.type || 'image/jpeg');
    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result);
      setDetectedItems([]);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleSampleReceipt = () => {
    // 1x1 demo placeholder or simulated base64
    setSelectedImage('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="300" height="200" fill="%23FAF5E8"/><text x="50%" y="40%" dominant-baseline="middle" text-anchor="middle" font-family="monospace" font-size="14" fill="%232B2320">★ DEMO GROCERY RECEIPT ★</text><text x="50%" y="60%" dominant-baseline="middle" text-anchor="middle" font-family="monospace" font-size="12" fill="%23C1502E">Eggs, Spinach, Garlic, Tomatoes</text></svg>');
    setMimeType('image/svg+xml');
    setDetectedItems([]);
    setError(null);
  };

  const handleSampleFridge = () => {
    setSelectedImage('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="300" height="200" fill="%23EAF1EC"/><text x="50%" y="40%" dominant-baseline="middle" text-anchor="middle" font-family="monospace" font-size="14" fill="%232B2320">★ DEMO CRISPER DRAWER ★</text><text x="50%" y="60%" dominant-baseline="middle" text-anchor="middle" font-family="monospace" font-size="12" fill="%236B8F71">Bell Peppers, Cheddar, Chicken, Onions</text></svg>');
    setMimeType('image/svg+xml');
    setDetectedItems([]);
    setError(null);
  };

  const handleScan = async () => {
    if (!selectedImage) return;

    setIsScanning(true);
    setError(null);

    try {
      const items = await scanPantryPhoto(selectedImage, mimeType);
      if (items && items.length > 0) {
        setDetectedItems(items);
        // Select all by default
        const initialSelected = {};
        items.forEach((item) => {
          initialSelected[item] = true;
        });
        setSelectedTokens(initialSelected);
      } else {
        setError('No ingredients recognized in this photo. Please try a clearer shot.');
      }
    } catch (err) {
      console.error('Scan error:', err);
      setError(err.message || 'Failed to scan image. Please try again.');
    } finally {
      setIsScanning(false);
    }
  };

  const toggleToken = (item) => {
    setSelectedTokens((prev) => ({
      ...prev,
      [item]: !prev[item],
    }));
  };

  const handleImportToLedger = () => {
    const chosen = Object.keys(selectedTokens).filter((k) => selectedTokens[k]);
    if (chosen.length > 0 && onAddIngredients) {
      onAddIngredients(chosen);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/50 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="w-full max-w-lg bg-[#FAF5E8] border-2 border-[#D9CBAC] rounded-3xl p-6 sm:p-7 shadow-card-elevated relative max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#E4D7BF]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-tomato/15 text-tomato border border-tomato/30">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-charcoal">
                Smart Pantry Photo Scanner
              </h3>
              <p className="text-xs text-charcoal-muted font-sans">
                Scan your fridge shelf or grocery receipt with Gemini Vision
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-charcoal-muted hover:text-tomato hover:bg-tomato/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Upload / Drop Area */}
        <div className="space-y-4">
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />

          {!selectedImage ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="cursor-pointer border-2 border-dashed border-[#D5C6A6] hover:border-tomato rounded-2xl p-8 text-center bg-[#FAF6EE] hover:bg-[#F4ECDB] transition-all space-y-3"
            >
              <div className="w-12 h-12 rounded-2xl bg-tomato/10 text-tomato flex items-center justify-center mx-auto border border-tomato/20">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <p className="font-serif font-bold text-sm text-charcoal">
                  Click to snap or upload a photo
                </p>
                <p className="text-xs text-charcoal-muted font-sans mt-0.5">
                  Supports JPEG, PNG, WEBP receipts & fridge snapshots
                </p>
              </div>
            </div>
          ) : (
            <div className="relative rounded-2xl overflow-hidden border-2 border-[#D5C6A6] bg-black/5 max-h-56 flex items-center justify-center">
              <img
                src={selectedImage}
                alt="Selected pantry preview"
                className="max-h-52 object-contain"
              />
              <button
                type="button"
                onClick={() => {
                  setSelectedImage(null);
                  setDetectedItems([]);
                }}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-charcoal/70 hover:bg-charcoal text-white transition-colors"
                title="Remove photo"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Quick Demo Presets */}
          {!selectedImage && (
            <div className="pt-1">
              <span className="text-[11px] font-mono uppercase tracking-wider text-charcoal-muted font-bold block mb-1.5">
                ★ Quick Demo Photo Tests:
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleSampleReceipt}
                  className="flex-1 text-xs font-mono p-2 rounded-xl bg-[#F4ECDB] hover:bg-[#EFE4CF] text-charcoal border border-[#DECFA4] transition-colors"
                >
                  🧾 Demo Receipt
                </button>
                <button
                  type="button"
                  onClick={handleSampleFridge}
                  className="flex-1 text-xs font-mono p-2 rounded-xl bg-[#F4ECDB] hover:bg-[#EFE4CF] text-charcoal border border-[#DECFA4] transition-colors"
                >
                  🥬 Demo Crisper
                </button>
              </div>
            </div>
          )}

          {/* Scan Action Button */}
          {selectedImage && detectedItems.length === 0 && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={handleScan}
              disabled={isScanning}
              className="w-full py-3.5 bg-tomato hover:bg-tomato-hover disabled:opacity-50 text-white font-serif font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 border border-[#A83E1E]"
            >
              {isScanning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Gemini Vision is inspecting items...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-mustard" />
                  <span>Scan Photo with AI</span>
                </>
              )}
            </motion.button>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-xl bg-tomato/10 border border-tomato/30 text-tomato text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Detected Items Result */}
          {detectedItems.length > 0 && (
            <div className="space-y-3 pt-2 border-t border-[#E4D7BF]">
              <div className="flex items-center justify-between">
                <span className="font-serif font-bold text-sm text-charcoal">
                  Detected {detectedItems.length} Ingredients:
                </span>
                <span className="text-xs font-mono text-sage-hover font-bold">
                  Tap to toggle
                </span>
              </div>

              <div className="flex flex-wrap gap-2 p-3 bg-[#F4EDE0] rounded-xl border border-[#E3D7BE] max-h-40 overflow-y-auto">
                {detectedItems.map((item) => {
                  const isChecked = !!selectedTokens[item];
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleToken(item)}
                      className={`text-xs font-mono px-2.5 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 ${
                        isChecked
                          ? 'bg-sage text-white font-bold border-sage-hover shadow-sm'
                          : 'bg-[#FAF5E8] text-charcoal-muted border-[#D5C6A6] opacity-60'
                      }`}
                    >
                      <span>🫙 {item}</span>
                      {isChecked && <Check className="w-3 h-3" />}
                    </button>
                  );
                })}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={handleImportToLedger}
                className="w-full py-3.5 bg-sage hover:bg-sage-hover text-white font-serif font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 border border-sage-hover"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Import Selected Jars to Pantry Shelf</span>
              </motion.button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
