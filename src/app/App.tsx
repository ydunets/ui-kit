import { useState } from 'react';
import { cx } from '@/shared/lib/cx';
import { Navbar } from '@/shared/ui/navbar';
import { ProductDetailsSection, type DemoState } from '@/widgets/product-details';

const DEMO_STATES: { value: DemoState; label: string }[] = [
  { value: 'default', label: 'Default' },
  { value: 'out-of-stock', label: 'Out of stock' },
  { value: 'max', label: 'Max stock' },
];

function App() {
  const [demoState, setDemoState] = useState<DemoState>('default');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-100 to-gray-200">
      <Navbar />
      <main className="mx-auto flex max-w-[1120px] flex-col gap-10 px-4 py-10">
        <div>
          <div
            role="group"
            aria-label="Demo state"
            className="mb-6 inline-flex rounded-lg border border-gray-200 bg-white p-1"
          >
            {DEMO_STATES.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setDemoState(option.value)}
                aria-pressed={demoState === option.value}
                className={cx(
                  'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                  demoState === option.value
                    ? 'bg-brand text-white'
                    : 'text-muted hover:text-ink',
                )}
              >
                {option.label}
              </button>
            ))}
          </div>

          <ProductDetailsSection productId="voyager-hoodie" demoState={demoState} />
        </div>
      </main>
    </div>
  );
}

export default App;
