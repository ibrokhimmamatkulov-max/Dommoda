interface Step {
  icon?: string
  number?: number
  label: string
  isActive: boolean
}

interface CheckoutStepperProps {
  currentStep: 1 | 2 | 3
}

export function CheckoutStepper({ currentStep }: CheckoutStepperProps) {
  const steps: Step[] = [
    { icon: 'local_shipping', label: 'Доставка', isActive: currentStep >= 1 },
    { number: 2, label: 'Оплата', isActive: currentStep >= 2 },
    { number: 3, label: 'Готово', isActive: currentStep >= 3 },
  ]

  return (
    <div className="flex items-center justify-between mb-12 relative">
      {/* Background line */}
      <div className="absolute left-0 top-4 w-full h-[1px] bg-outline-variant -z-10" />

      {steps.map((step, i) => (
        <div
          key={i}
          className="flex flex-col items-center gap-2 bg-background px-2"
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step.isActive
                ? 'bg-primary text-on-primary'
                : 'bg-surface-variant text-secondary border border-outline-variant'
            }`}
          >
            {i === 0 ? (
              <span
                aria-hidden="true"
                className="material-symbols-outlined text-sm"
              >
                {step.icon}
              </span>
            ) : (
              <span className="text-sm font-bold">{step.number}</span>
            )}
          </div>
          <span
            className={`text-xs uppercase tracking-wider ${
              step.isActive
                ? 'font-bold text-primary'
                : 'font-medium text-secondary'
            }`}
          >
            {step.label}
          </span>
        </div>
      ))}
    </div>
  )
}
