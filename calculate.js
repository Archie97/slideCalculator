(function () {

    // Cache elements
    var rangeSlider = document.getElementById('range-slider');
    var rangeAmount = document.getElementById('range-amount');
    var paymentAmountEl = document.getElementById('payment-amount-output');
    var repaymentEls = document.querySelectorAll('input[type="radio"]');
  
    // Set currency format
    var moneyFormat = wNumb({
      prefix: '$',
      thousand: ',',
      mark: '.',
      decimals: 2 });
  
  
    var moneyFormatNoDecimals = wNumb({
      prefix: '$',
      thousand: ',',
      decimals: 0 });
  
  
    // Options to pass range slider
    var sliderOptions = {
      start: [24000],
      step: 1000,
      range: {
        min: [1000],
        max: [50000] },
  
      pips: {
        mode: 'range',
        density: 100,
        format: moneyFormatNoDecimals },
  
      format: moneyFormat,
      behaviour: 'snap',
      connect: [true, false] };
  
  
    // Interest rate
    var interestRate = .33;
  
    // Update slider amount on screen
    function setLoanAmount() {
      var loanAmount = getLoanAmount();
      rangeAmount.textContent = moneyFormatNoDecimals.to(loanAmount);
    }
  
    // Update payment amount on screen
    function setPaymentAmount() {
      var paymentAmount = getPaymentAmount(getLoanAmount(), getNumberOfYears(), getPaymentsPerYear());
      paymentAmountEl.textContent = moneyFormat.to(paymentAmount);
    }
  
    // Formula for loan calculation https://www.thebalance.com/loan-payment-calculations-315564
    function getPaymentAmount(loanAmount, numberOfYears, paymentsPerYear) {
      var n = numberOfYears * paymentsPerYear;
      var i = interestRate / paymentsPerYear;
      var A = loanAmount;
      var D = (Math.pow(1 + i, n) - 1) / (i * Math.pow(1 + i, n));
      return A / D;
    }
  
    // Get loan amount from range slider
    function getLoanAmount() {
      var loanAmount = Number(rangeSlider.noUiSlider.get().replace(/\$|,/g, ''));
      return isNaN(loanAmount) ? 0 : loanAmount;
    }
  
  
    // Get number of years by dividing number of months by 12
    function getNumberOfYears() {
      var repaymentTerm = Number(document.querySelector('input[name="number-of-years"]:checked').value);
      return isNaN(repaymentTerm) ? 0 : repaymentTerm / 12;
    }
  
    // Get payments per year. 12 if monthly, 52 if weekly
    function getPaymentsPerYear() {
      var repaymentFrequency = Number(document.querySelector('input[name="payments-per-year"]:checked').value);
      return isNaN(repaymentFrequency) ? 0 : repaymentFrequency;
    }
  
    // Initialize range slider
    noUiSlider.create(rangeSlider, sliderOptions);
  
    // Calculate loan amount on range update
    rangeSlider.noUiSlider.on('update', function () {
      setPaymentAmount();
      setLoanAmount();
    });
  
    // Calculate loan amount on radio change
    for (var i = 0; i < repaymentEls.length; i++) {
      repaymentEls[i].addEventListener('change', function () {
        setPaymentAmount();
      });
    }
  
  })();