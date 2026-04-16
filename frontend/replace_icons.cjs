const fs = require('fs');

const file = '/Users/arnav/Desktop/phantasia-blockchain/frontend/src/app/dashboard/page.tsx';
let data = fs.readFileSync(file, 'utf8');

const replacements = [
  { match: /<span className="material-symbols-outlined ([^"]+)">wallet<\/span>/g, replace: '<Wallet className="$1" />' },
  { match: /<span className="material-symbols-outlined">wallet<\/span>/g, replace: '<Wallet className="w-5 h-5" />' },
  { match: /<span className="material-symbols-outlined ([^"]+)">refresh<\/span>/g, replace: '<RefreshCw className="$1" />' },
  { match: /<span className="material-symbols-outlined ([^"]+)">notifications<\/span>/g, replace: '<Bell className="$1" />' },
  { match: /<span className="material-symbols-outlined ([^"]+)">settings<\/span>/g, replace: '<Settings className="$1" />' },
  { match: /<span className="material-symbols-outlined ([^"]+)">error<\/span>/g, replace: '<AlertTriangle className="$1" />' },
  { match: /<span className="material-symbols-outlined ([^"]+)">check_circle<\/span>/g, replace: '<CheckCircle2 className="$1" />' },
  { match: /<span className="material-symbols-outlined ([^"]+)">terminal<\/span>/g, replace: '<Terminal className="$1" />' },
  { match: /<span className="material-symbols-outlined ([^"]+)">verified_user<\/span>/g, replace: '<ShieldCheck className="$1" />' },
  { match: /<span className="material-symbols-outlined ([^"]+)">hub<\/span>/g, replace: '<Network className="$1" />' },
  { match: /<span className="material-symbols-outlined ([^"]+)">database<\/span>/g, replace: '<Database className="$1" />' },
  { match: /<span className="material-symbols-outlined ([^"]+)">expand_more<\/span>/g, replace: '<ChevronDown className="$1" />' },
  { match: /<span className="material-symbols-outlined ([^"]+)">\s*link\s*<\/span>/g, replace: '<Link2 className="$1" />' },
  { match: /<span className="material-symbols-outlined ([^"]+)">arrow_drop_down<\/span>/g, replace: '<ChevronDown className="$1" />' },
  { match: /<span className="material-symbols-outlined ([^"]+)">security<\/span>/g, replace: '<Shield className="$1" />' },
  { match: /<span className="material-symbols-outlined ([^"]+)">open_in_new<\/span>/g, replace: '<ExternalLink className="$1" />' },
  { match: /<span className="material-symbols-outlined ([^"]+)">storage<\/span>/g, replace: '<Database className="$1" />' },
  { match: /<span className="material-symbols-outlined ([^"]+)">explore<\/span>/g, replace: '<Compass className="$1" />' },
  { match: /<span className="material-symbols-outlined">\s*\{submitting \? "hourglass_empty" \: "link"\}\s*<\/span>/g, replace: '{submitting ? <Hourglass className="w-5 h-5" /> : <Link2 className="w-5 h-5" />}' },
  { match: /<span className="material-symbols-outlined ([^"]+)">\s*\{showAll \? "expand_less" : "history"\}\s*<\/span>/g, replace: '{showAll ? <ChevronUp className="$1" /> : <History className="$1" />}' }
];

replacements.forEach(r => {
  data = data.replace(r.match, r.replace);
});

// Add imports
if (!data.includes('import { Wallet')) {
  data = data.replace('import { ContributionCard } from "@/components/ContributionCard";',
    'import { ContributionCard } from "@/components/ContributionCard";\nimport { Wallet, RefreshCw, Bell, Settings, AlertTriangle, CheckCircle2, Terminal, ShieldCheck, Network, Database, ChevronDown, Link2, Shield, ExternalLink, Compass, Hourglass, ChevronUp, History } from "lucide-react";');
}

fs.writeFileSync(file, data, 'utf8');
console.log("Done");
