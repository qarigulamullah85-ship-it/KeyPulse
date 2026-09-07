const fs = require('fs');
let code = fs.readFileSync('src/components/Dashboard.tsx', 'utf8');
const search = '<select \n            className="bg-transparent text-slate-300 outline-none cursor-pointer hover:text-white appearance-none pr-5 font-semibold"';
const replace = `<button 
            className="text-slate-300 hover:text-white transition-colors"
            onClick={() => {
              const current = localStorage.getItem('soundsEnabled') !== 'false';
              localStorage.setItem('soundsEnabled', String(!current));
              setLanguage(language);
            }}
            title="Toggle Typing Sounds"
          >
            {localStorage.getItem('soundsEnabled') !== 'false' ? '🔊' : '🔇'}
          </button>
          <select 
            className="bg-transparent text-slate-300 outline-none cursor-pointer hover:text-white appearance-none pr-5 font-semibold"`;
code = code.replace(search, replace);
fs.writeFileSync('src/components/Dashboard.tsx', code);
