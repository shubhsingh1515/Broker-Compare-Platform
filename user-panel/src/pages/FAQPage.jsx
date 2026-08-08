import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

const FAQPage = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openIdx, setOpenIdx] = useState(0);

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    try {
      const res = await api.get('/faqs');
      setFaqs(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Frequently Asked Questions</h1>
        <p className="text-sm text-gray-400">Everything you need to know about comparing stock and forex brokers</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {faqs.map((f, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div key={f._id} className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden transition-all">
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between font-bold text-white text-base hover:bg-gray-800/40 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <HelpCircle className="w-5 h-5 text-sky-400 flex-shrink-0" />
                    <span>{f.question}</span>
                  </div>
                  {isOpen ? <ChevronUp className="w-5 h-5 text-sky-400" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-sm text-gray-300 border-t border-gray-800/60 leading-relaxed">
                    {f.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FAQPage;
