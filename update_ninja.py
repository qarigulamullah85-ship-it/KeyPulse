import os

with open("src/components/TypingView.tsx", "r") as f:
    content = f.read()

content = content.replace(
    "interface TypingViewProps {",
    "interface TypingViewProps {\n  ninjaMode?: boolean;"
)
content = content.replace(
    "export function TypingView({ lesson, onComplete, onBack, onNext }: TypingViewProps) {",
    "export function TypingView({ lesson, onComplete, onBack, onNext, ninjaMode }: TypingViewProps) {"
)
# Update text rendering in TypingView
content = content.replace(
    "let colorClass = 'text-slate-400 dark:text-slate-500';",
    "let colorClass = ninjaMode ? 'text-slate-400/20 dark:text-slate-500/20' : 'text-slate-400 dark:text-slate-500';"
)
content = content.replace(
    "if (index < cursorIndex) colorClass = 'text-slate-800 dark:text-white font-medium';",
    "if (index < cursorIndex) colorClass = ninjaMode ? 'text-transparent bg-slate-300 dark:bg-slate-700' : 'text-slate-800 dark:text-white font-medium';"
)

with open("src/components/TypingView.tsx", "w") as f:
    f.write(content)

with open("src/components/TypingTest.tsx", "r") as f:
    content = f.read()

content = content.replace(
    "interface TypingTestProps {",
    "interface TypingTestProps {\n  ninjaMode?: boolean;"
)
content = content.replace(
    "export function TypingTest({ duration, onComplete, onBack }: TypingTestProps) {",
    "export function TypingTest({ duration, onComplete, onBack, ninjaMode }: TypingTestProps) {"
)
content = content.replace(
    "let colorClass = 'text-slate-400 dark:text-slate-500';",
    "let colorClass = ninjaMode ? 'text-slate-400/20 dark:text-slate-500/20' : 'text-slate-400 dark:text-slate-500';"
)
content = content.replace(
    "if (typed[index] === char) {\n                  colorClass = 'text-slate-800 dark:text-white font-medium';",
    "if (typed[index] === char) {\n                  colorClass = ninjaMode ? 'text-transparent bg-slate-300 dark:bg-slate-700' : 'text-slate-800 dark:text-white font-medium';"
)

with open("src/components/TypingTest.tsx", "w") as f:
    f.write(content)

with open("src/App.tsx", "r") as f:
    content = f.read()

content = content.replace(
    "onNext={() => {",
    "ninjaMode={stats.ninjaMode}\n            onNext={() => {"
)
content = content.replace(
    "duration={testDuration}",
    "duration={testDuration}\n            ninjaMode={stats.ninjaMode}"
)
with open("src/App.tsx", "w") as f:
    f.write(content)

print("Ninja mode updated")
