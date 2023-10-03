const main = async () => {
  const wordAnime = new WordAnime();
  const effect = new Effects();

  const form = document.querySelector("form");
  form.elements.input.value =
    JSON.parse(sessionStorage.getItem("input")) ?? "auto";

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    sessionStorage.setItem("input", JSON.stringify(form.elements.input.value));

    // clear();
    window.location.reload();
  });

  async function triggerAnimations() {
    const val = form.elements["input"].value;

    // set pixels from input
    wordAnime.writeText(val);
    // get pixel value from canvas
    const pxData = await wordAnime.getPixels({ borderFiltered: true });

    // limit the lines to the amount of gathered pixels
    effect.linesAmount = pxData.length;
    // display effect
    effect.lettersCircle(pxData);
  }

  triggerAnimations();
};

window.resetAnimation = () => {
  //sessionStorage.clear()
  window.location.reload();
};
ctx.invert();
main();
