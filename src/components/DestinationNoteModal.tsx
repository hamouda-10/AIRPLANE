import React, { useEffect } from 'react';
import { X, PlaneTakeoff } from 'lucide-react';
import { COPY, HighlightCardData, Lang } from '../data/charterData';

interface DestinationNoteModalProps {
  lang: Lang;
  isOpen: boolean;
  highlight: HighlightCardData | null;
  onClose: () => void;
  onSelectCharterJet: (aircraftId: string) => void;
}

export const DestinationNoteModal: React.FC<DestinationNoteModalProps> = ({
  lang,
  isOpen,
  highlight,
  onClose,
  onSelectCharterJet,
}) => {
  const t = COPY[lang];

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen || !highlight) return null;

  const copy = highlight[lang];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#070b0f]/80 p-4 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-[#fdf1e1]/20 bg-[#0d141b] text-[#fdf1e1] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-52 w-full">
          <img src={highlight.image} alt={copy.title} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d141b] via-[#0d141b]/35 to-transparent" />
          <button
            type="button"
            onClick={onClose}
            aria-label={t.modal.close}
            className="absolute top-4 right-4 inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-[#fdf1e1]/20 bg-[#070b0f]/75 text-[#fdf1e1] transition hover:bg-[#070b0f]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-7 pt-3 md:p-8 md:pt-4">
          <p className="text-xs font-semibold tracking-wider text-[#c8a464] uppercase">
            {copy.kicker}
          </p>
          <h3 className="font-editorial-display mt-1 text-2xl font-medium text-[#fdf1e1] md:text-3xl">
            {copy.title}
          </h3>

          <p className="mt-4 text-sm leading-relaxed text-[#fdf1e1]/85 md:text-base">
            {copy.detailNote}
          </p>

          <div className="mt-5 rounded-2xl border border-[#fdf1e1]/12 bg-[#070b0f]/65 p-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#c8a464] uppercase">
              <PlaneTakeoff className="h-4 w-4" />
              <span>{t.modal.arrivalHeading}</span>
            </div>
            <p className="mt-1.5 text-sm text-[#fdf1e1]/90">{copy.arrivalTip}</p>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-end gap-3 border-t border-[#fdf1e1]/10 pt-5">
            <button
              type="button"
              onClick={onClose}
              className="min-h-[42px] cursor-pointer rounded-full border border-[#fdf1e1]/20 px-5 text-sm font-medium text-[#fdf1e1]/85 hover:bg-[#fdf1e1]/10"
            >
              {t.modal.close}
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onSelectCharterJet(highlight.aircraftId);
              }}
              className="min-h-[42px] cursor-pointer rounded-full bg-[#fdf1e1] px-6 text-sm font-semibold text-[#111411] hover:bg-white"
            >
              {t.modal.charterBtn}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
