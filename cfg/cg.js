const data = require("./data.json");
const { defaultPaymentOptions, setting } = data;

//call this fuction to display payment option by setting
const checkSettingsForDisplayOptions = () => {
  const { card_option, bank_option, transfer_option } = setting;
  const displayOption = [];
  if (card_option) displayOption.push("CARD");
  if (bank_option) displayOption.push("BANK");
  if (transfer_option) displayOption.push("TRANSFER");
  return displayOption;
};

//call this fuction to display payment option
const displayPaymentOption = () => {
  if (defaultPaymentOptions !== undefined) {
    let paymentDisplayOptions = [];
    for (const paymentOption of defaultPaymentOptions) {
      if (paymentOption.allow_option && paymentOption.status == "ACTIVE") {
        paymentDisplayOptions.push(paymentOption.code);
      }
    }
    return paymentDisplayOptions;
  } else {
    checkSettingsForDisplayOptions();
  }
};

//call this fuctiion to calcuate payment fee
const handlePayment = (selectedOption = "CARD") => {
  const { display_fee, charge_option } = setting;

  let selectedPaymentOptionData = defaultPaymentOptions.filter(
    option => option.code == selectedOption
  );

  const {
    paymentOptionFeeMode,
    paymentOptionFee,
    paymentOptionCapStatus
  } = selectedPaymentOptionData[0];

  let totalFee;
  const actualAmount = Number(paymentOptionCapStatus.cappedAmount);
  if (paymentOptionFeeMode == "PERCENTAGE") {
    totalFee = (actualAmount * paymentOptionFee) / 100 + actualAmount;
  } else {
    totalFee = actualAmount + Number(paymentOptionFee);
  }

  if (display_fee && charge_option == "CUSTOMER") {
    return totalFee;
  } else {
    return actualAmount;
  }
};
