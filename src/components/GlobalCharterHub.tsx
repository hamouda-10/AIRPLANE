import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeftRight,
  Check,
  Globe2,
  MapPin,
  Plane,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import {
  AIRCRAFT_FLEET,
  AircraftCategory,
  COPY,
  GLOBAL_AIRPORTS,
  Lang,
  RuqaaStyle,
  haversineKm,
} from '../data/charterData';
import { ThreeGlobeRoutes } from './ThreeGlobeRoutes';

interface GlobalCharterHubProps {
  lang: Lang;
  ruqaaStyle: RuqaaStyle;
  onChangeLang: (lang: Lang) => void;
  onChangeRuqaaStyle: (style: RuqaaStyle) => void;
  originCode: string;
  destinationCode: string;
  onChangeOrigin: (code: string) => void;
  onChangeDestination: (code: string) => void;
  selectedAircraftId: string;
  onSelectAircraft: (id: string) => void;
}

export const GlobalCharterHub: React.FC<GlobalCharterHubProps> = ({
  lang,
  ruqaaStyle,
  onChangeLang,
  onChangeRuqaaStyle,
  originCode,
  destinationCode,
  onChangeOrigin,
  onChangeDestination,
  selectedAircraftId,
  onSelectAircraft,
}) => {
  const t = COPY[lang].charter;
  const isRtl = lang === 'ar';

  const [activeCategory, setActiveCategory] = useState<AircraftCategory>('all');
  const [cabinPreviewMap, setCabinPreviewMap] = useState<Record<string, boolean>>({});
  const [passengers, setPassengers] = useState<number>(6);
  const [tripType, setTripType] = useState<'oneway' | 'roundtrip'>('oneway');
  const [departureDate, setDepartureDate] = useState<string>('2026-12-10');

  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [hospitality, setHospitality] = useState<string>(t.form.hospitalityOptions[0]);
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState('');
  const [bookingRef, setBookingRef] = useState<string | null>(null);

  const filteredFleet = useMemo(() => {
    if (activeCategory === 'all') return AIRCRAFT_FLEET;
    return AIRCRAFT_FLEET.filter((jet) => jet.category === activeCategory);
  }, [activeCategory]);

  const selectedAircraft = useMemo(
    () => AIRCRAFT_FLEET.find((j) => j.id === selectedAircraftId) || AIRCRAFT_FLEET[0],
    [selectedAircraftId]
  );

  const originAirport = useMemo(
    () => GLOBAL_AIRPORTS.find((a) => a.code === originCode) || GLOBAL_AIRPORTS[0],
    [originCode]
  );
  const destinationAirport = useMemo(
    () => GLOBAL_AIRPORTS.find((a) => a.code === destinationCode) || GLOBAL_AIRPORTS[4],
    [destinationCode]
  );

  const calculation = useMemo(() => {
    const distKm = Math.max(
      180,
      haversineKm(
        originAirport.lat,
        originAirport.lon,
        destinationAirport.lat,
        destinationAirport.lon
      )
    );
    const distNm = Math.round(distKm * 0.539957);
    const flightHours = distKm / selectedAircraft.cruiseKmh + 0.5;
    const multiplier = tripType === 'roundtrip' ? 1.92 : 1;
    const totalHours = flightHours * multiplier;
    const flightOpsUsd = Math.round(totalHours * selectedAircraft.hourlyRateUsd);
    const fboUsd = Math.round(4800 * (tripType === 'roundtrip' ? 2 : 1));
    const cateringUsd = passengers * 290;
    const totalUsd = flightOpsUsd + fboUsd + cateringUsd;
    const isNonStop = distKm <= selectedAircraft.rangeKm;

    const hrs = Math.floor(flightHours);
    const mins = Math.round((flightHours - hrs) * 60);

    return {
      distKm,
      distNm,
      hrs,
      mins,
      isNonStop,
      flightOpsUsd,
      fboUsd,
      cateringUsd,
      totalUsd,
    };
  }, [originAirport, destinationAirport, selectedAircraft, tripType, passengers]);

  const handleSwapAirports = () => {
    const prev = originCode;
    onChangeOrigin(destinationCode);
    onChangeDestination(prev);
  };

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientEmail.trim());
    if (!clientName.trim() || !emailValid || clientPhone.trim().length < 5) {
      setFormError(t.form.errorRequired);
      return;
    }
    setFormError('');
    const randomCode = Math.floor(100000 + Math.random() * 900000);
    setBookingRef(`SKY-${originCode}-${destinationCode}-${randomCode}`);
  };

  const formatMoney = (amount: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="relative z-20 bg-[#070b0f] text-[#fdf1e1] border-t border-[#fdf1e1]/12"
    >
      {/* 1. SMALL & LONG-RANGE PRIVATE JETS FOR CHARTER */}
      <section id="fleet" className="mx-auto max-w-[1320px] px-6 py-24 md:px-10 md:py-28">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-widest text-[#c8a464] uppercase">
              {t.sectionKicker}
            </p>
            <h2 className="font-editorial-display mt-3 text-4xl font-medium leading-tight text-[#fdf1e1] md:text-5xl">
              {t.fleetTitle}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[#fdf1e1]/75 md:text-lg">
              {t.fleetSubtitle}
            </p>
          </div>

          {/* Ruq'ah Calligraphy Switcher */}
          <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-[#fdf1e1]/12 bg-[#0d141c] p-2">
            <span className="px-2.5 text-xs font-medium text-[#fdf1e1]/60">
              {t.ruqaaLabel}:
            </span>
            {(
              [
                ['classic', t.ruqaaStyles.classic],
                ['ink', t.ruqaaStyles.ink],
                ['amiri', t.ruqaaStyles.amiri],
              ] as [RuqaaStyle, string][]
            ).map(([styleKey, label]) => (
              <button
                key={styleKey}
                type="button"
                onClick={() => {
                  onChangeRuqaaStyle(styleKey);
                  if (lang !== 'ar') onChangeLang('ar');
                }}
                className={`cursor-pointer rounded-xl px-3 py-1.5 text-xs font-medium whitespace-nowrap transition ${
                  ruqaaStyle === styleKey && lang === 'ar'
                    ? 'bg-[#fdf1e1] text-[#111411]'
                    : 'text-[#fdf1e1]/75 hover:bg-[#fdf1e1]/10 hover:text-[#fdf1e1]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div
          className="mt-10 flex flex-wrap items-center gap-2 border-b border-[#fdf1e1]/10 pb-5"
          role="tablist"
          aria-label={t.fleetTitle}
        >
          {(
            [
              ['all', t.categories.all],
              ['ultra', t.categories.ultra],
              ['heavy', t.categories.heavy],
              ['supermid', t.categories.supermid],
              ['light', t.categories.light],
            ] as [AircraftCategory, string][]
          ).map(([catKey, label]) => {
            const active = activeCategory === catKey;
            return (
              <button
                key={catKey}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setActiveCategory(catKey)}
                className={`min-h-[42px] cursor-pointer rounded-full px-5 text-sm font-medium whitespace-nowrap transition ${
                  active
                    ? 'bg-[#fdf1e1] text-[#111411]'
                    : 'border border-[#fdf1e1]/15 bg-[#0d141c] text-[#fdf1e1]/80 hover:border-[#fdf1e1]/35 hover:text-[#fdf1e1]'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Charter Fleet Grid with 3D Card Tilt & Exterior/Cabin Switcher */}
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredFleet.map((jet, idx) => {
            const copy = jet[lang];
            const isSelected = jet.id === selectedAircraft.id;
            const showCabin = Boolean(cabinPreviewMap[jet.id]);

            return (
              <motion.article
                key={jet.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.12 }}
                transition={{ duration: 0.45, delay: Math.min(idx * 0.05, 0.25) }}
                className={`tilt-card-3d flex flex-col justify-between rounded-3xl border p-6 ${
                  isSelected
                    ? 'border-[#c8a464] bg-[#121b24]'
                    : 'border-[#fdf1e1]/12 bg-[#0d141c]'
                }`}
              >
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="font-semibold tracking-wider text-[#c8a464] uppercase">
                      {copy.tag}
                    </span>
                    <span className="text-[#fdf1e1]/55">{copy.manufacturer}</span>
                  </div>

                  <h3 className="font-editorial-display mt-2 text-2xl font-medium text-[#fdf1e1]">
                    {copy.name}
                  </h3>
                  <p className="mt-1 text-xs text-[#fdf1e1]/60">{copy.base}</p>

                  {/* Real Private Jet Photo with Exterior / Cabin Toggle */}
                  <div className="relative mt-4 overflow-hidden rounded-2xl border border-[#fdf1e1]/12 bg-[#070b0f]">
                    <div className="relative h-52 w-full">
                      <img
                        src={showCabin ? jet.cabinImage : jet.exteriorImage}
                        alt={`${copy.name} — ${showCabin ? t.viewCabin : t.viewExterior}`}
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover object-center transition duration-500"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#070b0f]/75 via-transparent to-transparent" />
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2">
                      <div className="inline-flex rounded-full bg-[#070b0f]/82 p-1 text-[11px] font-medium">
                        <button
                          type="button"
                          onClick={() =>
                            setCabinPreviewMap((prev) => ({ ...prev, [jet.id]: false }))
                          }
                          className={`cursor-pointer rounded-full px-3 py-1 transition ${
                            !showCabin
                              ? 'bg-[#fdf1e1] text-[#111411]'
                              : 'text-[#fdf1e1]/80 hover:text-[#fdf1e1]'
                          }`}
                        >
                          {t.viewExterior}
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setCabinPreviewMap((prev) => ({ ...prev, [jet.id]: true }))
                          }
                          className={`cursor-pointer rounded-full px-3 py-1 transition ${
                            showCabin
                              ? 'bg-[#fdf1e1] text-[#111411]'
                              : 'text-[#fdf1e1]/80 hover:text-[#fdf1e1]'
                          }`}
                        >
                          {t.viewCabin}
                        </button>
                      </div>
                    </div>
                  </div>

                  <p className="mt-4 text-sm leading-relaxed text-[#fdf1e1]/80">
                    {copy.description}
                  </p>

                  <p className="mt-3 text-xs font-medium text-[#c8a464]/95">
                    {copy.highlights.join('  ·  ')}
                  </p>
                </div>

                <div className="mt-5 border-t border-[#fdf1e1]/10 pt-4">
                  <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm sm:grid-cols-4">
                    <div>
                      <dt className="text-xs text-[#fdf1e1]/55">{t.specs.range}</dt>
                      <dd className="mt-0.5 font-semibold tabular-nums text-[#fdf1e1]">
                        {jet.rangeKm.toLocaleString()} km
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-[#fdf1e1]/55">{t.specs.speed}</dt>
                      <dd className="mt-0.5 font-semibold tabular-nums text-[#fdf1e1]">
                        M {jet.mach}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-[#fdf1e1]/55">{t.specs.pax}</dt>
                      <dd className="mt-0.5 font-semibold tabular-nums text-[#fdf1e1]">
                        {jet.passengers}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-[#fdf1e1]/55">{t.specs.rate}</dt>
                      <dd className="mt-0.5 font-semibold tabular-nums text-[#c8a464]">
                        {formatMoney(jet.hourlyRateUsd)}
                      </dd>
                    </div>
                  </dl>

                  <button
                    type="button"
                    onClick={() => {
                      onSelectAircraft(jet.id);
                      if (passengers > jet.passengers) {
                        setPassengers(jet.passengers);
                      }
                      document.getElementById('routes')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={`mt-5 flex min-h-[44px] w-full cursor-pointer items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold transition ${
                      isSelected
                        ? 'bg-[#c8a464] text-[#111411]'
                        : 'bg-[#fdf1e1] text-[#111411] hover:bg-white'
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <Check className="h-4 w-4" />
                        <span>{t.specs.selectedBtn}</span>
                      </>
                    ) : (
                      <>
                        <Plane className="h-4 w-4" />
                        <span>{t.specs.selectBtn}</span>
                      </>
                    )}
                  </button>
                </div>
              </motion.article>
            );
          })}
        </div>
      </section>

      {/* 2. INTERACTIVE 3D GLOBE & WORLDWIDE CHARTER ROUTE ESTIMATOR */}
      <section
        id="routes"
        className="border-t border-[#fdf1e1]/10 bg-[#090f15] py-24 md:py-28"
      >
        <div className="mx-auto max-w-[1320px] px-6 md:px-10">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-widest text-[#c8a464] uppercase">
              {originAirport[lang].city} → {destinationAirport[lang].city}
            </p>
            <h2 className="font-editorial-display mt-3 text-4xl font-medium leading-tight text-[#fdf1e1] md:text-5xl">
              {t.routesTitle}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[#fdf1e1]/75 md:text-lg">
              {t.routesSubtitle}
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-stretch">
            {/* Real Three.js 3D Globe */}
            <div className="flex flex-col justify-between rounded-3xl border border-[#fdf1e1]/12 bg-[#0d141c] p-6 lg:col-span-7">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-sm font-medium text-[#fdf1e1]/90">
                  <Globe2 className="h-4 w-4 text-[#c8a464]" />
                  <span>
                    {originAirport.code} — {destinationAirport.code}
                  </span>
                </div>
                <span className="text-xs font-medium text-[#fdf1e1]/65 tabular-nums">
                  {calculation.distKm.toLocaleString()} km · {calculation.distNm.toLocaleString()} nm
                </span>
              </div>

              <ThreeGlobeRoutes
                lang={lang}
                originCode={originCode}
                destinationCode={destinationCode}
                onSelectHub={(code) => {
                  if (code !== originCode) onChangeDestination(code);
                }}
              />

              <div className="mt-5 flex flex-wrap items-center gap-2">
                {[
                  ['DXB', 'FAB'],
                  ['RUH', 'GVA'],
                  ['LBG', 'NCE'],
                  ['FAB', 'TEB'],
                  ['DXB', 'HND'],
                ].map(([from, to]) => (
                  <button
                    key={`${from}-${to}`}
                    type="button"
                    onClick={() => {
                      onChangeOrigin(from);
                      onChangeDestination(to);
                    }}
                    className={`cursor-pointer rounded-full border px-3.5 py-1.5 text-xs font-medium transition ${
                      originCode === from && destinationCode === to
                        ? 'border-[#c8a464] bg-[#c8a464]/15 text-[#fdf1e1]'
                        : 'border-[#fdf1e1]/14 text-[#fdf1e1]/75 hover:border-[#fdf1e1]/35'
                    }`}
                  >
                    {from} → {to}
                  </button>
                ))}
              </div>
            </div>

            {/* Quote Estimator */}
            <div className="flex flex-col justify-between rounded-3xl border border-[#fdf1e1]/12 bg-[#0d141c] p-6 lg:col-span-5 md:p-8">
              <div className="space-y-5">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-xs font-medium text-[#fdf1e1]/65">
                      {t.originLabel}
                    </span>
                    <select
                      value={originCode}
                      onChange={(e) => onChangeOrigin(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-[#fdf1e1]/18 bg-[#070b0f] px-3.5 py-2.5 text-sm text-[#fdf1e1] focus:border-[#c8a464] focus:outline-none"
                    >
                      {GLOBAL_AIRPORTS.map((ap) => (
                        <option key={ap.code} value={ap.code}>
                          {ap.code} — {ap[lang].city}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block">
                    <span className="text-xs font-medium text-[#fdf1e1]/65">
                      {t.destinationLabel}
                    </span>
                    <select
                      value={destinationCode}
                      onChange={(e) => onChangeDestination(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-[#fdf1e1]/18 bg-[#070b0f] px-3.5 py-2.5 text-sm text-[#fdf1e1] focus:border-[#c8a464] focus:outline-none"
                    >
                      {GLOBAL_AIRPORTS.map((ap) => (
                        <option key={ap.code} value={ap.code}>
                          {ap.code} — {ap[lang].city}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={handleSwapAirports}
                    className="inline-flex cursor-pointer items-center gap-2 text-xs font-medium text-[#c8a464] hover:underline"
                  >
                    <ArrowLeftRight className="h-3.5 w-3.5" />
                    <span>{t.swapAirports}</span>
                  </button>

                  <div className="inline-flex rounded-xl border border-[#fdf1e1]/14 bg-[#070b0f] p-1">
                    <button
                      type="button"
                      onClick={() => setTripType('oneway')}
                      className={`cursor-pointer rounded-lg px-3 py-1 text-xs font-medium transition ${
                        tripType === 'oneway'
                          ? 'bg-[#fdf1e1] text-[#111411]'
                          : 'text-[#fdf1e1]/70'
                      }`}
                    >
                      {t.oneWay}
                    </button>
                    <button
                      type="button"
                      onClick={() => setTripType('roundtrip')}
                      className={`cursor-pointer rounded-lg px-3 py-1 text-xs font-medium transition ${
                        tripType === 'roundtrip'
                          ? 'bg-[#fdf1e1] text-[#111411]'
                          : 'text-[#fdf1e1]/70'
                      }`}
                    >
                      {t.roundTrip}
                    </button>
                  </div>
                </div>

                <label className="block">
                  <span className="text-xs font-medium text-[#fdf1e1]/65">
                    {t.aircraftLabel}
                  </span>
                  <select
                    value={selectedAircraft.id}
                    onChange={(e) => onSelectAircraft(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-[#fdf1e1]/18 bg-[#070b0f] px-3.5 py-2.5 text-sm text-[#fdf1e1] focus:border-[#c8a464] focus:outline-none"
                  >
                    {AIRCRAFT_FLEET.map((jet) => (
                      <option key={jet.id} value={jet.id}>
                        {jet[lang].name} ({formatMoney(jet.hourlyRateUsd)}/hr)
                      </option>
                    ))}
                  </select>
                </label>

                <div className="grid grid-cols-2 gap-4">
                  <label className="block">
                    <span className="text-xs font-medium text-[#fdf1e1]/65">
                      {t.passengersLabel}
                    </span>
                    <input
                      type="number"
                      min={1}
                      max={selectedAircraft.passengers}
                      value={passengers}
                      onChange={(e) =>
                        setPassengers(
                          Math.min(
                            selectedAircraft.passengers,
                            Math.max(1, Number(e.target.value) || 1)
                          )
                        )
                      }
                      className="mt-1.5 w-full rounded-xl border border-[#fdf1e1]/18 bg-[#070b0f] px-3.5 py-2.5 text-sm tabular-nums text-[#fdf1e1] focus:border-[#c8a464] focus:outline-none"
                    />
                  </label>

                  <label className="block">
                    <span className="text-xs font-medium text-[#fdf1e1]/65">
                      {t.dateLabel}
                    </span>
                    <input
                      type="date"
                      value={departureDate}
                      onChange={(e) => setDepartureDate(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-[#fdf1e1]/18 bg-[#070b0f] px-3.5 py-2.5 text-sm tabular-nums text-[#fdf1e1] focus:border-[#c8a464] focus:outline-none"
                    />
                  </label>
                </div>

                <dl className="grid grid-cols-3 gap-3 border-y border-[#fdf1e1]/10 py-4 text-sm">
                  <div>
                    <dt className="text-xs text-[#fdf1e1]/55">{t.distanceLabel}</dt>
                    <dd className="mt-1 font-semibold tabular-nums">
                      {calculation.distKm.toLocaleString()} km
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-[#fdf1e1]/55">{t.durationLabel}</dt>
                    <dd className="mt-1 font-semibold tabular-nums">
                      {calculation.hrs}h {calculation.mins}m
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-[#fdf1e1]/55">{t.rangeStatusLabel}</dt>
                    <dd
                      className={`mt-1 font-semibold ${
                        calculation.isNonStop ? 'text-emerald-300' : 'text-amber-300'
                      }`}
                    >
                      {calculation.isNonStop ? t.nonStopOk : t.techStopReq}
                    </dd>
                  </div>
                </dl>

                <div className="space-y-2 text-sm text-[#fdf1e1]/75">
                  <div className="flex justify-between">
                    <span>{t.breakdownFlight}</span>
                    <span className="tabular-nums">{formatMoney(calculation.flightOpsUsd)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t.breakdownFbo}</span>
                    <span className="tabular-nums">{formatMoney(calculation.fboUsd)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t.breakdownCatering}</span>
                    <span className="tabular-nums">{formatMoney(calculation.cateringUsd)}</span>
                  </div>
                  <div className="flex items-baseline justify-between border-t border-[#fdf1e1]/12 pt-3 text-[#fdf1e1]">
                    <span className="font-medium">{t.totalEstimateLabel}</span>
                    <span className="font-editorial-display text-3xl font-medium tabular-nums text-[#c8a464]">
                      {formatMoney(calculation.totalUsd)}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })
                }
                className="mt-6 flex min-h-[48px] w-full cursor-pointer items-center justify-center rounded-full bg-[#fdf1e1] px-6 text-sm font-semibold text-[#111411] transition hover:bg-white"
              >
                {t.proceedBooking}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. OPERATIONAL PILLARS & 24/7 DISPATCH FORM */}
      <section id="booking" className="mx-auto max-w-[1320px] px-6 py-24 md:px-10 md:py-28">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 className="font-editorial-display text-4xl font-medium leading-tight text-[#fdf1e1]">
              {t.bookingTitle}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[#fdf1e1]/75">
              {t.bookingSubtitle}
            </p>

            <div className="mt-10 space-y-8 border-t border-[#fdf1e1]/12 pt-8">
              {t.pillars.map((pillar) => (
                <div key={pillar.num}>
                  <p className="font-editorial-display text-lg text-[#c8a464]">{pillar.num}</p>
                  <h3 className="mt-1 text-lg font-semibold text-[#fdf1e1]">{pillar.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-[#fdf1e1]/75">
                    {pillar.body}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-[#fdf1e1]/14 bg-[#0d141c] p-7 md:p-10">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#fdf1e1]/12 pb-5">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-[#c8a464]" />
                  <div>
                    <p className="text-sm font-semibold text-[#fdf1e1]">
                      {originAirport[lang].city} ({originAirport.code}) →{' '}
                      {destinationAirport[lang].city} ({destinationAirport.code})
                    </p>
                    <p className="text-xs text-[#fdf1e1]/65">
                      {selectedAircraft[lang].name} · {passengers} pax · {departureDate}
                    </p>
                  </div>
                </div>
                <p className="font-editorial-display text-2xl tabular-nums text-[#c8a464]">
                  {formatMoney(calculation.totalUsd)}
                </p>
              </div>

              {bookingRef ? (
                <div className="py-10 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300">
                    <ShieldCheck className="h-7 w-7" />
                  </div>
                  <h3 className="font-editorial-display mt-5 text-3xl text-[#fdf1e1]">
                    {t.form.confirmedTitle}
                  </h3>
                  <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[#fdf1e1]/75">
                    {t.form.confirmedSubtitle}
                  </p>
                  <div className="mx-auto mt-6 inline-block rounded-2xl border border-[#c8a464]/40 bg-[#070b0f] px-6 py-4">
                    <p className="text-xs text-[#fdf1e1]/60">{t.form.refLabel}</p>
                    <p className="mt-1 font-mono text-lg font-bold tracking-wider text-[#c8a464] tabular-nums">
                      {bookingRef}
                    </p>
                  </div>
                  <div className="mt-8">
                    <button
                      type="button"
                      onClick={() => setBookingRef(null)}
                      className="min-h-[44px] cursor-pointer rounded-full border border-[#fdf1e1]/20 px-6 text-sm font-medium text-[#fdf1e1] hover:bg-[#fdf1e1]/10"
                    >
                      {t.form.reset}
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmitBooking} className="mt-6 space-y-5" noValidate>
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <label className="block">
                      <span className="text-xs font-medium text-[#fdf1e1]/75">
                        {t.form.name}
                      </span>
                      <input
                        type="text"
                        required
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        className="mt-1.5 w-full rounded-xl border border-[#fdf1e1]/18 bg-[#070b0f] px-4 py-3 text-sm text-[#fdf1e1] focus:border-[#c8a464] focus:outline-none"
                      />
                    </label>

                    <label className="block">
                      <span className="text-xs font-medium text-[#fdf1e1]/75">
                        {t.form.email}
                      </span>
                      <input
                        type="email"
                        required
                        value={clientEmail}
                        onChange={(e) => setClientEmail(e.target.value)}
                        className="mt-1.5 w-full rounded-xl border border-[#fdf1e1]/18 bg-[#070b0f] px-4 py-3 text-sm text-[#fdf1e1] focus:border-[#c8a464] focus:outline-none"
                      />
                    </label>
                  </div>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <label className="block">
                      <span className="text-xs font-medium text-[#fdf1e1]/75">
                        {t.form.phone}
                      </span>
                      <input
                        type="tel"
                        required
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        className="mt-1.5 w-full rounded-xl border border-[#fdf1e1]/18 bg-[#070b0f] px-4 py-3 text-sm text-[#fdf1e1] focus:border-[#c8a464] focus:outline-none"
                      />
                    </label>

                    <label className="block">
                      <span className="text-xs font-medium text-[#fdf1e1]/75">
                        {t.form.hospitality}
                      </span>
                      <select
                        value={hospitality}
                        onChange={(e) => setHospitality(e.target.value)}
                        className="mt-1.5 w-full rounded-xl border border-[#fdf1e1]/18 bg-[#070b0f] px-4 py-3 text-sm text-[#fdf1e1] focus:border-[#c8a464] focus:outline-none"
                      >
                        {t.form.hospitalityOptions.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>

                  <label className="block">
                    <span className="text-xs font-medium text-[#fdf1e1]/75">
                      {t.form.notes}
                    </span>
                    <textarea
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-[#fdf1e1]/18 bg-[#070b0f] px-4 py-3 text-sm text-[#fdf1e1] focus:border-[#c8a464] focus:outline-none"
                    />
                  </label>

                  {formError && (
                    <p role="alert" className="text-sm font-medium text-amber-300">
                      {formError}
                    </p>
                  )}

                  <button
                    type="submit"
                    className="flex min-h-[50px] w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[#fdf1e1] px-6 text-sm font-semibold text-[#111411] transition hover:bg-white"
                  >
                    <Sparkles className="h-4 w-4" />
                    <span>{t.form.submit}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* QUIET FOOTER */}
      <footer className="border-t border-[#fdf1e1]/10 bg-[#05080b] py-10">
        <div className="mx-auto flex max-w-[1320px] flex-col items-start justify-between gap-6 px-6 md:flex-row md:items-center md:px-10">
          <div>
            <p className="font-editorial-display text-xl text-[#fdf1e1]">
              {COPY[lang].brandName}
            </p>
            <p className="mt-1 text-xs text-[#fdf1e1]/60">{t.footerNote}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => onChangeLang(lang === 'en' ? 'ar' : 'en')}
              className="cursor-pointer rounded-full border border-[#fdf1e1]/20 px-4 py-2 text-xs font-medium text-[#fdf1e1] hover:bg-[#fdf1e1]/10"
            >
              {lang === 'en' ? 'التحويل إلى العربية (خط الرقعة)' : 'Switch to English'}
            </button>
            <a
              href="#cinema"
              className="rounded-full border border-[#fdf1e1]/15 px-4 py-2 text-xs font-medium text-[#fdf1e1]/80 hover:text-[#fdf1e1]"
            >
              ↑ {COPY[lang].nav.intro}
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
