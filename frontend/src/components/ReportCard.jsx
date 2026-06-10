import React from 'react';
import { ClipboardCheck, AlertTriangle, ArrowRight, UserCog } from 'lucide-react';

const ReportCard = ({ data }) => {
  if (!data) return null;

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="p-6 border-b border-border bg-primary/5">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <ClipboardCheck className="text-primary" />
          Report Analysis Result
        </h3>
      </div>
      
      <div className="p-8 space-y-8">
        <section>
          <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Summary</h4>
          <p className="text-gray-200 leading-relaxed text-lg">
            {data.summary}
          </p>
        </section>

        <section>
          <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Key Findings</h4>
          <ul className="space-y-2">
            {data.key_findings.map((finding, i) => (
              <li key={i} className="flex items-start gap-3 text-gray-300">
                <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                {finding}
              </li>
            ))}
          </ul>
        </section>

        {data.red_flags && data.red_flags.length > 0 && (
          <section className="bg-danger/5 border border-danger/20 p-5 rounded-xl">
            <h4 className="text-sm font-bold text-danger uppercase tracking-wider mb-3 flex items-center gap-2">
              <AlertTriangle size={16} />
              Red Flags / Abnormalities
            </h4>
            <ul className="space-y-2">
              {data.red_flags.map((flag, i) => (
                <li key={i} className="text-danger-light font-medium flex items-center gap-2">
                   • {flag}
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          <section className="bg-success/5 border border-success/20 p-5 rounded-xl">
            <h4 className="text-sm font-bold text-success uppercase tracking-wider mb-3 flex items-center gap-2">
              <ArrowRight size={16} />
              Next Steps
            </h4>
            <p className="text-gray-300 text-sm">
              {data.recommended_next_steps}
            </p>
          </section>

          <section className="bg-primary/5 border border-primary/20 p-5 rounded-xl">
            <h4 className="text-sm font-bold text-primary uppercase tracking-wider mb-3 flex items-center gap-2">
              <UserCog size={16} />
              Consult Specialist
            </h4>
            <p className="text-gray-300 text-sm font-bold">
              {data.specialist_recommended}
            </p>
          </section>
        </div>

        <div className="pt-6 border-t border-border">
          <p className="text-[11px] text-gray-500 italic text-center">
            {data.disclaimer}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReportCard;
