export type Audit = {
  company: { name: string; url: string };
  generated_at: string;
  current_positioning_summary: string;
  dunford: {
    competitive_alternatives: string[];
    unique_attributes: string[];
    value: string[];
    best_fit_customer: string;
    market_category: string;
  };
  diagnosis: {
    hedging: string[];
    contradictions: string[];
    missing: string[];
    first_change: string;
  };
  rewrite: {
    current_headline: string;
    sharper_headline: string;
    current_subhead: string;
    sharper_subhead: string;
  };
};
