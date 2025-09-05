const state = {
  cardBrands: ["mastercard", "visa"],
};

function changeBackground(newBackground) {
  document.body.style.background = newBackground;
}

function updateOutput(newOutput) {
  const outputSection = document.querySelector("pre");
  outputSection.innerText = outputSection.innerText + newOutput
}

async function startHosted() {
  const libJS = document.createElement("script");
  localStorage.setItem("c2p.enable_hosted_checkout_service", "true");
  libJS.src = "https://stage.src.mastercard.com/srci/integration/2/lib.js";
  await document.body.appendChild(libJS);
  libJS.addEventListener("load", async function () {
    const c2p = new window.Click2Pay({ debug: true });
    try {
      console.log("cardBrands", state.cardBrands);
      const emailAddress = document.querySelector("#email").value;
      const initResult = await c2p.init({
        srcDpaId: "b756a2b0-ef62-4c62-a6de-f72e75ce5f17",
        dpaData: {
          dpaName: "Greyjoy",
        },
        dpaLocale: "en_US",
        cardBrands: state.cardBrands,
        services: ["HOSTED_CHECKOUT"],
        ...(emailAddress && { consumer: { emailAddress } }),
      })
      updateOutput(initResult)
      changeBackground("rgb(36, 100, 50)")
      

      const checkoutResult = await c2p.checkout({
        experienceType: "ACTION_SHEET",
      });
      updateOutput(checkoutResult)
      changeBackground("rgb(0, 100, 0)")
      
    } catch (e) {
      const outputSection = document.querySelector("pre");
      console.error(e);
      changeBackground("rgb(46, 10, 15)")
      updateOutput(JSON.stringify(e))
    }
  });
}

function updateCardBrands(event) {
  state.cardBrands = event.target.value.split(",");
  document.querySelector("src-mark").cardBrands = state.cardBrands;
  document.querySelector("src-button").cardBrands = state.cardBrands;
}

(async function () {
  await customElements.whenDefined("src-mark");
  const mark = document.querySelector("src-mark");
  mark.cardBrands = state.cardBrands;

  cardBrandsInput = document.querySelector("#cardBrands");
  cardBrandsInput.value = state.cardBrands.join(",");
  cardBrandsInput.addEventListener("input", updateCardBrands);

  mark.addEventListener("click", startHosted);
})();
