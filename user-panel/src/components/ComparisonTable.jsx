import React from 'react';
import {
  Trophy,
  Check,
  X,
  Star,
  ExternalLink,
  ShieldCheck,
  Zap,
  Award,
  DollarSign,
  TrendingUp,
  Layers,
  Headphones,
  Sliders
} from 'lucide-react';

const ComparisonTable = ({ data }) => {
  if (!data || !data.brokers || data.brokers.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        Please select brokers to view side-by-side comparison.
      </div>
    );
  }

  const { brokers, dynamicFeatures = [], highlights = {} } = data;

  const renderBadge = (brokerId) => {
    const badges = [];
    if (highlights.bestOverall === brokerId) badges.push({ text: 'Best Overall', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' });
    if (highlights.bestValue === brokerId) badges.push({ text: 'Best Value', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' });
    if (highlights.lowestCharges === brokerId) badges.push({ text: 'Lowest Charges', color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' });
    if (highlights.highestRating === brokerId) badges.push({ text: 'Highest Rating', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' });
    if (highlights.fastestExecution === brokerId) badges.push({ text: 'Fastest Speed', color: 'bg-sky-500/20 text-sky-300 border-sky-500/30' });
    if (highlights.bestSupport === brokerId) badges.push({ text: 'Top Support', color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' });
    if (highlights.bestPlatform === brokerId) badges.push({ text: 'Best Platform', color: 'bg-teal-500/20 text-teal-300 border-teal-500/30' });

    if (badges.length === 0) return null;

    return (
      <div className="flex flex-wrap gap-1 mt-2">
        {badges.map((b, idx) => (
          <span key={idx} className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold border uppercase tracking-wider flex items-center gap-1 ${b.color}`}>
            <Trophy className="w-3 h-3" />
            <span>{b.text}</span>
          </span>
        ))}
      </div>
    );
  };

  const renderBool = (val) => {
    return val ? (
      <div className="flex items-center space-x-1 text-emerald-400 font-bold text-xs">
        <Check className="w-4 h-4" />
        <span>Yes</span>
      </div>
    ) : (
      <div className="flex items-center space-x-1 text-gray-500 text-xs">
        <X className="w-4 h-4" />
        <span>No</span>
      </div>
    );
  };

  const sections = [
    {
      title: '1. Basic Information',
      icon: Award,
      rows: [
        { label: 'Broker Name', render: (b) => <span className="font-extrabold text-white text-base">{b.name}</span> },
        { label: 'Broker Type', render: (b) => <span className="uppercase text-xs font-bold text-sky-400">{b.brokerType} Broker</span> },
        { label: 'Founded Year', render: (b) => b.founded },
        { label: 'Head Office', render: (b) => b.headOffice },
        { label: 'Country', render: (b) => b.country },
        { label: 'Regulations', render: (b) => <span className="font-semibold text-emerald-400">{b.regulation?.join(', ') || 'N/A'}</span> },
        { label: 'Trust Score', render: (b) => <span className="font-extrabold text-emerald-400">{b.trustScore} / 100</span> },
        { label: 'Overall Rating', render: (b) => <div className="flex items-center space-x-1 text-amber-400 font-bold"><Star className="w-4 h-4 fill-amber-400" /><span>{b.overallRating} / 5</span></div> },
        { label: 'Website', render: (b) => <a href={b.website} target="_blank" rel="noreferrer" className="text-sky-400 underline hover:text-sky-300 flex items-center space-x-1 text-xs"><span>Visit Site</span><ExternalLink className="w-3 h-3" /></a> }
      ]
    },
    {
      title: '2. Account & Deposit Specs',
      icon: DollarSign,
      rows: [
        { label: 'Minimum Deposit', render: (b) => <span className="font-extrabold text-white">{b.minDepositCurrency || '$'} {b.minDeposit}</span> },
        { label: 'Maximum Leverage', render: (b) => <span className="font-bold text-sky-400">{b.maxLeverage}</span> },
        { label: 'Account Types', render: (b) => b.accountTypes?.join(', ') || 'Standard' },
        { label: 'Deposit Methods', render: (b) => b.depositMethods?.join(', ') || 'N/A' },
        { label: 'Withdrawal Methods', render: (b) => b.withdrawalMethods?.join(', ') || 'N/A' },
        { label: 'Processing Time', render: (b) => b.processingTime }
      ]
    },
    {
      title: '3. Trading Platforms & Apps',
      icon: Layers,
      rows: [
        { label: 'MetaTrader 4 (MT4)', render: (b) => renderBool(b.tradingPlatforms?.mt4) },
        { label: 'MetaTrader 5 (MT5)', render: (b) => renderBool(b.tradingPlatforms?.mt5) },
        { label: 'TradingView Charts', render: (b) => renderBool(b.tradingPlatforms?.tradingView) },
        { label: 'Web Trading Platform', render: (b) => renderBool(b.tradingPlatforms?.webPlatform) },
        { label: 'Mobile Trading App', render: (b) => renderBool(b.tradingPlatforms?.mobileApp) },
        { label: 'Desktop App', render: (b) => renderBool(b.tradingPlatforms?.desktopApp) }
      ]
    },
    {
      title: '4. Tradable Products',
      icon: TrendingUp,
      rows: [
        { label: 'Forex Pairs', render: (b) => renderBool(b.products?.forex) },
        { label: 'Stocks & Equities', render: (b) => renderBool(b.products?.stocks) },
        { label: 'Indices', render: (b) => renderBool(b.products?.indices) },
        { label: 'Cryptocurrency', render: (b) => renderBool(b.products?.crypto) },
        { label: 'Commodities (Gold/Oil)', render: (b) => renderBool(b.products?.commodity) },
        { label: 'Mutual Funds', render: (b) => renderBool(b.products?.mutualFunds) },
        { label: 'Options & Futures', render: (b) => renderBool(b.products?.options || b.products?.futures) }
      ]
    },
    {
      title: '5. Brokerage & Charges',
      icon: DollarSign,
      rows: [
        { label: 'Account Opening Charges', render: (b) => b.brokerage?.accountOpeningCharges || 'Free' },
        { label: 'AMC (Annual Maintenance)', render: (b) => b.brokerage?.amc || 'Free' },
        { label: 'Equity Delivery', render: (b) => b.brokerage?.equityDelivery || 'N/A' },
        { label: 'Intraday Trading', render: (b) => b.brokerage?.intraday || 'N/A' },
        { label: 'Options Brokerage', render: (b) => b.brokerage?.optionsCharges || 'N/A' },
        { label: 'Average Spread', render: (b) => <span className="font-bold text-emerald-400">{b.brokerage?.spread || 'From 0.0 pips'}</span> },
        { label: 'Commission per Lot', render: (b) => b.brokerage?.commission || '$0' }
      ]
    },
    {
      title: '6. Execution & Advanced Tools',
      icon: Zap,
      rows: [
        { label: 'Execution Speed', render: (b) => <span className="font-bold text-sky-400">{b.executionSpeed}</span> },
        { label: 'Islamic Swap Free', render: (b) => renderBool(b.swapFree) },
        { label: 'Negative Balance Protection', render: (b) => renderBool(b.negativeBalanceProtection) },
        { label: 'Copy Trading Support', render: (b) => renderBool(b.copyTrading) },
        { label: 'PAMM / MAM Accounts', render: (b) => renderBool(b.pamm || b.mam) },
        { label: 'API & Algo Trading', render: (b) => renderBool(b.apiTrading || b.algoTrading) },
        { label: 'Margin Trading (MTF)', render: (b) => renderBool(b.marginTrading) }
      ]
    },
    {
      title: '7. Customer Support & Languages',
      icon: Headphones,
      rows: [
        { label: 'Live Chat 24/7', render: (b) => renderBool(b.customerSupport?.liveChat) },
        { label: 'Email Support', render: (b) => renderBool(b.customerSupport?.email) },
        { label: 'Phone Support', render: (b) => renderBool(b.customerSupport?.phone) },
        { label: 'WhatsApp Support', render: (b) => renderBool(b.customerSupport?.whatsapp) },
        { label: 'Languages Supported', render: (b) => b.customerSupport?.languages?.join(', ') || 'English' }
      ]
    }
  ];

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden shadow-2xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          
          {/* Sticky Header Row */}
          <thead>
            <tr className="bg-gray-950/90 backdrop-blur-md border-b border-gray-800 sticky top-20 z-20">
              <th className="p-6 w-1/4 bg-gray-950/95 border-r border-gray-800">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block">Comparing</span>
                <span className="text-lg font-extrabold text-white">{brokers.length} Brokers</span>
              </th>

              {brokers.map((b) => (
                <th key={b._id} className="p-6 text-center border-r border-gray-800 last:border-r-0 bg-gray-950/95">
                  <div className="flex flex-col items-center space-y-3">
                    <img src={b.logo} alt={b.name} className="w-16 h-16 rounded-2xl object-cover bg-white p-2 border border-gray-700 shadow-xl" />
                    <div>
                      <h3 className="font-extrabold text-white text-lg">{b.name}</h3>
                      {renderBadge(b._id)}
                    </div>
                    <a
                      href={b.website}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 text-white font-bold py-2 px-3 rounded-xl text-xs shadow-lg shadow-sky-600/20 flex items-center justify-center space-x-1"
                    >
                      <span>Open Account</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-800/80">
            {sections.map((section, idx) => {
              const SectionIcon = section.icon;
              return (
                <React.Fragment key={idx}>
                  {/* Category Header Row */}
                  <tr className="bg-gray-950/80 text-sky-400 border-t-2 border-b border-gray-800">
                    <td colSpan={brokers.length + 1} className="py-4 px-6 font-extrabold text-sm uppercase tracking-wider">
                      <div className="flex items-center space-x-2">
                        <SectionIcon className="w-4 h-4 text-sky-400" />
                        <span>{section.title}</span>
                      </div>
                    </td>
                  </tr>

                  {/* Section Spec Rows */}
                  {section.rows.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-gray-800/30 transition-colors">
                      <td className="py-4 px-6 text-xs font-bold text-gray-300 bg-gray-900/60 border-r border-gray-800">
                        {row.label}
                      </td>
                      {brokers.map((b) => (
                        <td key={b._id} className="py-4 px-6 text-center text-xs text-gray-200 border-r border-gray-800/60 last:border-r-0">
                          {row.render(b)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </React.Fragment>
              );
            })}

            {/* Dynamic Custom Features Section */}
            {dynamicFeatures && dynamicFeatures.length > 0 && (
              <>
                <tr className="bg-gray-950/80 text-sky-400 border-t-2 border-b border-gray-800">
                  <td colSpan={brokers.length + 1} className="py-4 px-6 font-extrabold text-sm uppercase tracking-wider">
                    <div className="flex items-center space-x-2">
                      <Sliders className="w-4 h-4 text-sky-400" />
                      <span>8. Admin Dynamic Custom Fields</span>
                    </div>
                  </td>
                </tr>
                {dynamicFeatures.map((feat) => (
                  <tr key={feat._id} className="hover:bg-gray-800/30 transition-colors">
                    <td className="py-4 px-6 text-xs font-bold text-sky-300 bg-gray-900/60 border-r border-gray-800">
                      {feat.label}
                    </td>
                    {brokers.map((b) => {
                      const customValObj = b.customFeatures?.[feat.key];
                      const val = customValObj?.value;
                      return (
                        <td key={b._id} className="py-4 px-6 text-center text-xs text-gray-200 border-r border-gray-800/60 last:border-r-0">
                          {feat.type === 'boolean' ? renderBool(val) : (val ?? 'N/A')}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </>
            )}

            {/* Verdict Section */}
            <tr className="bg-gray-950/80 text-sky-400 border-t-2 border-b border-gray-800">
              <td colSpan={brokers.length + 1} className="py-4 px-6 font-extrabold text-sm uppercase tracking-wider">
                9. Final Verdict & Summary
              </td>
            </tr>

            <tr className="hover:bg-gray-800/30">
              <td className="py-4 px-6 text-xs font-bold text-gray-300 bg-gray-900/60 border-r border-gray-800">
                Pros Summary
              </td>
              {brokers.map((b) => (
                <td key={b._id} className="py-4 px-6 text-left text-xs text-gray-300 border-r border-gray-800/60 last:border-r-0">
                  <ul className="space-y-1">
                    {b.pros?.map((p, i) => (
                      <li key={i} className="flex items-start space-x-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </td>
              ))}
            </tr>

            <tr className="hover:bg-gray-800/30">
              <td className="py-4 px-6 text-xs font-bold text-gray-300 bg-gray-900/60 border-r border-gray-800">
                Final Verdict
              </td>
              {brokers.map((b) => (
                <td key={b._id} className="py-4 px-6 text-left text-xs text-gray-300 border-r border-gray-800/60 last:border-r-0 leading-relaxed italic">
                  "{b.finalVerdict}"
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComparisonTable;
