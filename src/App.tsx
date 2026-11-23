/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { CinemaScrollStage } from './components/CinemaScrollStage';
import { DestinationNoteModal } from './components/DestinationNoteModal';
import { GlobalCharterHub } from './components/GlobalCharterHub';
import { ThreeJetInspector } from './components/ThreeJetInspector';
import { HighlightCardData, Lang, RuqaaStyle } from './data/charterData';

export default function App() {
  const [lang, setLang] = useState<Lang>('ar');
  const [ruqaaStyle, setRuqaaStyle] = useState<RuqaaStyle>('classic');

  const [modalOpen, setModalOpen] = useState(false);
  const [activeHighlight, setActiveHighlight] = useState<HighlightCardData | null>(null);

  const [originCode, setOriginCode] = useState('DXB');
  const [destinationCode, setDestinationCode] = useState('FAB');
  const [selectedAircraftId, setSelectedAircraftId] = useState('gulfstream-g650er');

  useEffect(() => {
    const root = document.documentElement;
    root.lang = lang;
    root.dir = lang === 'ar' ? 'rtl' : 'ltr';
    root.dataset.ruqaa = ruqaaStyle;
  }, [lang, ruqaaStyle]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <main className="site-shell">
      <CinemaScrollStage
        lang={lang}
        onToggleLang={() => setLang((prev) => (prev === 'en' ? 'ar' : 'en'))}
        onOpenHighlightModal={(item) => {
          setActiveHighlight(item);
          setModalOpen(true);
        }}
        onScrollToSection={scrollToSection}
      />

      <ThreeJetInspector lang={lang} />

      <GlobalCharterHub
        lang={lang}
        ruqaaStyle={ruqaaStyle}
        onChangeLang={setLang}
        onChangeRuqaaStyle={setRuqaaStyle}
        originCode={originCode}
        destinationCode={destinationCode}
        onChangeOrigin={setOriginCode}
        onChangeDestination={setDestinationCode}
        selectedAircraftId={selectedAircraftId}
        onSelectAircraft={setSelectedAircraftId}
      />

      <DestinationNoteModal
        lang={lang}
        isOpen={modalOpen}
        highlight={activeHighlight}
        onClose={() => setModalOpen(false)}
        onSelectCharterJet={(aircraftId) => {
          setSelectedAircraftId(aircraftId);
          scrollToSection('routes');
        }}
      />
    </main>
  );
}
