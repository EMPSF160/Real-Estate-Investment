/* ==========================================================================
   NY REALTY INVESTMENT GROUP - FINANCIAL YIELD & IRR CALCULATOR
   ========================================================================== */

const InvestmentCalculator = {
  profiles: {
    'core-plus': {
      name: 'Core-Plus Institutional',
      targetIRR: 0.145,
      cashYield: 0.075,
      appreciation: 0.045
    },
    'value-add': {
      name: 'Value-Add Repositioning',
      targetIRR: 0.182,
      cashYield: 0.088,
      appreciation: 0.065
    },
    'opportunistic': {
      name: 'Opportunistic & Development',
      targetIRR: 0.225,
      cashYield: 0.060,
      appreciation: 0.110
    }
  },

  calculate(principal, years, strategyKey) {
    const profile = this.profiles[strategyKey] || this.profiles['value-add'];
    const annualCashYield = principal * profile.cashYield;
    const totalCashDistributed = annualCashYield * years;
    
    // Capital appreciation compounding
    const estimatedExitValue = principal * Math.pow(1 + profile.appreciation, years);
    const totalNetProfit = (totalCashDistributed + estimatedExitValue) - principal;
    const totalReturn = totalCashDistributed + estimatedExitValue;
    const equityMultiple = totalReturn / principal;
    const netIRR = profile.targetIRR * 100;

    return {
      principal,
      years,
      strategyName: profile.name,
      annualCashYield,
      totalCashDistributed,
      estimatedExitValue,
      totalNetProfit,
      totalReturn,
      equityMultiple: equityMultiple.toFixed(2) + 'x',
      netIRR: netIRR.toFixed(1) + '%'
    };
  },

  formatCurrency(num) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(num);
  },

  init() {
    const amountSlider = document.getElementById('calc-amount-slider');
    const yearsSlider = document.getElementById('calc-years-slider');
    const strategySelect = document.getElementById('calc-strategy-select');

    if (!amountSlider || !yearsSlider || !strategySelect) return;

    const updateDisplay = () => {
      const principal = parseFloat(amountSlider.value);
      const years = parseInt(yearsSlider.value, 10);
      const strategyKey = strategySelect.value;

      document.getElementById('calc-amount-display').textContent = this.formatCurrency(principal);
      document.getElementById('calc-years-display').textContent = `${years} Years`;

      const results = this.calculate(principal, years, strategyKey);

      document.getElementById('calc-res-irr').textContent = results.netIRR;
      document.getElementById('calc-res-multiple').textContent = results.equityMultiple;
      document.getElementById('calc-res-total-return').textContent = this.formatCurrency(results.totalReturn);
      document.getElementById('calc-res-cash-flow').textContent = this.formatCurrency(results.annualCashYield) + ' / yr';
      document.getElementById('calc-res-distributions').textContent = this.formatCurrency(results.totalCashDistributed);
      document.getElementById('calc-res-exit-val').textContent = this.formatCurrency(results.estimatedExitValue);
      document.getElementById('calc-res-net-profit').textContent = '+' + this.formatCurrency(results.totalNetProfit);
    };

    amountSlider.addEventListener('input', updateDisplay);
    yearsSlider.addEventListener('input', updateDisplay);
    strategySelect.addEventListener('change', updateDisplay);

    updateDisplay();
  }
};
