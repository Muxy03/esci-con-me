<script lang="ts">
  import { onMount } from "svelte";
  import { notifyTelegram } from "./shared";

  let showContent = $state(false);
  let yesHovered = $state(false);
  let noHovered = $state(false);
  let answered: boolean | "yes" | "no" = $state(false);

  import { fly, fade } from "svelte/transition";

  let city = $state("");

  let imgs = [
    { name: "Firenze", img: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.jonesaroundtheworld.com%2Fwp-content%2Fuploads%2F2021%2F02%2Fpiazza-della-signoria.jpg&f=1&nofb=1&ipt=45904f8ba047f5530500aa64bc49ea09b3c8a6a543d24e0ae76015110b930291" },
    { name: "Pisa", img: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.italia.it%2Fcontent%2Fdam%2Ftdh%2Fit%2Finterests%2Ftoscana%2Fpisa%2Fpisa-e-piazza-dei-miracoli%2Fmedia%2F20210310174409-shutterstock-353262566.jpg.transform%2Fw_1600%2Fh_1000%2Fimage.jpeg&f=1&nofb=1&ipt=4b06f7c2441c8f1e0eee2d7d3f60250eddec98a0a2d42ee6de18ad0379fa43a1" },
    { name: "Siena", img: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.pinimg.com%2Foriginals%2F7d%2Fa9%2F47%2F7da947d79c024fed4433cfb1b024c1a5.jpg&f=1&nofb=1&ipt=11122b9cb9d979e2ceb2b76c238671450c84d63a61212f6472801dc63bfe7edf" },
  ];

  onMount(() => {
    setTimeout(() => (showContent = true), 300);
  });

  function handleResponse(answer: "yes" | "no") {
    answered = answer;
    if (answer === "yes") {
      notifyTelegram("La risposta è stata: \n<b>Sì</b>! 🎉").catch((error) => {
        console.error("Errore durante la notifica a Telegram:", error);
      });
    } else {
      notifyTelegram("La risposta è stata: \n<b>No</b>. 😢").catch((error) => {
        console.error("Errore durante la notifica a Telegram:", error);
      });
    }
  }
</script>

<main class:show={showContent}>
  <div class="background">
    <div class="rose-petals">
      {#each Array(20) as _, i}
        <div
          class="petal"
          style="--delay: {i * 0.3}s; --x: {Math.random() * 100}%;"
        ></div>
      {/each}
    </div>
  </div>

  {#if answered === false}
    <div class="content">
      <div class="question-box">
        <p class="question">Ho una semplice domanda da farti:</p>
        <h2 class="big-question">Ti andrebbe di uscire con me?</h2>
      </div>

      <div class="buttons">
        <button
          class="btn btn-yes"
          class:hovered={yesHovered}
          onmouseenter={() => (yesHovered = true)}
          onmouseleave={() => (yesHovered = false)}
          onclick={() => handleResponse("yes")}
        >
          <span class="btn-text">Sì! ✨</span>
        </button>

        <button
          class="btn btn-no"
          class:hovered={noHovered}
          onmouseenter={() => (noHovered = true)}
          onmouseleave={() => (noHovered = false)}
          onclick={() => handleResponse("no")}
        >
          <span class="btn-text">No</span>
        </button>
      </div>
    </div>
  {:else if answered === "yes"}
    {#if city === "confermata"}
      <div class="celebration">
        <h1 class="celebration-title">Non vedo l'ora!</h1>
        <p class="celebration-text">
          Sentiamoci su ig per definire giorno e orario 😉
        </p>
      </div>
    {:else}
      <div class="selector">
        <p>Dove ci incontriamo?</p>

        <div class="options-container">
          {#each imgs as { name, img }}
            <button
              type="button"
              tabindex="0"
              onmouseenter={() => (city = name)}
              onmouseleave={() => (city = "")}
              onclick={() => {
                city = "confermata";
                notifyTelegram(
                  `<b>${name}</b> è stata scelta come destinazione! 🌍`,
                );
              }}
              style="background: none; border: none; padding: 0;"
            >
              <img src={img} alt={name} />
            </button>
          {/each}
        </div>

        <div class="label-container">
          {#key city}
            {#if city && city !== "confermata"}
              <span
                class="selected-city"
                in:fly={{ y: 20, duration: 300 }}
                out:fade={{ duration: 200 }}
              >
                {city} ?
              </span>
            {/if}
          {/key}
        </div>
      </div>
    {/if}
  {:else if answered === "no"}
    <div class="celebration">
      <h1 class="celebration-title">Mi dispiace 😢</h1>
      <p class="celebration-text">
        Capisco, grazie comunque per aver risposto. Spero che possiamo rimanere amici!
      </p>
    </div>
  {/if}
</main>

<style>
  main {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    opacity: 0;
    transform: scale(0.95);
    transition: all 1.2s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  main.show {
    opacity: 1;
    transform: scale(1);
  }

  .background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    background: radial-gradient(
        circle at 20% 30%,
        rgba(255, 182, 193, 0.3) 0%,
        transparent 50%
      ),
      radial-gradient(
        circle at 80% 70%,
        rgba(255, 107, 157, 0.2) 0%,
        transparent 50%
      ),
      linear-gradient(135deg, #fff8f0 0%, #ffe5ec 100%);
  }

  .rose-petals {
    position: absolute;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .petal {
    position: absolute;
    top: -10%;
    width: 20px;
    height: 20px;
    background: radial-gradient(
      ellipse at center,
      var(--color-rose),
      var(--color-blush)
    );
    border-radius: 50% 0 50% 0;
    opacity: 0.4;
    animation: fall 15s linear infinite;
    animation-delay: var(--delay);
    left: var(--x);
  }

  @keyframes fall {
    to {
      top: 110%;
      transform: rotate(360deg) translateX(50px);
    }
  }

  .content {
    max-width: 700px;
    padding: 3rem 2rem;
    text-align: center;
    position: relative;
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .question-box {
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(10px);
    border: 2px solid var(--color-blush);
    border-radius: 20px;
    padding: 2.5rem 2rem;
    margin: 2rem 0;
    box-shadow: 0 10px 40px rgba(255, 107, 157, 0.2);
    animation: fadeIn 1s ease-out 1.2s both;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .question {
    font-size: 1.3rem;
    color: var(--color-midnight);
    margin-bottom: 1rem;
    font-weight: 600;
  }

  .big-question {
    font-family: var(--font-display);
    font-size: clamp(1.8rem, 4vw, 2.8rem);
    color: var(--color-deep-rose);
    font-weight: 900;
    letter-spacing: -0.5px;
  }

  .buttons {
    position: relative;
    height: 200px;
    margin-top: 2rem;
    animation: fadeIn 1s ease-out 1.5s both;
    display: flex;
    justify-content: center;
    gap: 2rem;
    align-items: flex-start;
  }

  .btn {
    font-family: var(--font-display);
    font-size: 1.5rem;
    font-weight: 700;
    padding: 1.2rem 3rem;
    border: none;
    border-radius: 50px;
    cursor: pointer;
    transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    position: relative;
    overflow: hidden;
  }

  .btn-text {
    position: relative;
    z-index: 2;
  }

  .btn-yes {
    background: linear-gradient(
      135deg,
      var(--color-rose),
      var(--color-deep-rose)
    );
    color: white;
    box-shadow: 0 10px 30px rgba(201, 24, 74, 0.3);
    position: relative;
  }

  .btn-yes::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, var(--color-deep-rose), #ff1744);
    opacity: 0;
    transition: opacity 0.4s;
  }

  .btn-yes:hover::before,
  .btn-yes.hovered::before {
    opacity: 1;
  }

  .btn-yes:hover,
  .btn-yes.hovered {
    transform: scale(1.15) rotate(-2deg);
    box-shadow: 0 15px 50px rgba(201, 24, 74, 0.5);
  }

  .btn-no {
    position: relative;
    background: rgba(200, 200, 200, 0.3);
    color: #666;
    border: 2px solid #ccc;
    transition: all 0.3s ease;
  }

  .btn-no:hover {
    background: rgba(200, 200, 200, 0.5);
  }
  .btn-no.hovered {
    transform: scale(1.15) rotate(+2deg);
    box-shadow: 0 15px 50px rgba(100, 92, 94, 0.365);
  }

  .celebration {
    text-align: center;
    animation: scaleIn 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  }

  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.3) rotate(-10deg);
    }
    to {
      opacity: 1;
      transform: scale(1) rotate(0deg);
    }
  }

  .celebration-title {
    font-family: var(--font-display);
    font-size: clamp(3rem, 8vw, 6rem);
    color: var(--color-deep-rose);
    font-weight: 900;
    margin-bottom: 1.5rem;
    text-shadow: 3px 3px 0 rgba(255, 107, 157, 0.2);
  }

  .celebration-text {
    font-size: 2rem;
    color: var(--color-midnight);
    font-style: italic;
    font-weight: 600;
  }

  .selector {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    gap: 4em;
    font-family:
      system-ui,
      -apple-system,
      sans-serif;
  }

  .selector p {
    font-size: 1.8rem;
    font-weight: 800;
    color: #333;
    letter-spacing: -0.5px;
  }

  .options-container {
    display: flex;
    flex-direction: row;
    gap: 20px;
  }

  .options-container img {
    width: 300px;
    height: 200px;
    object-fit: cover;
    border-radius: 16px;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
    opacity: 0.6;
    transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    filter: grayscale(40%);
  }

  .options-container img:hover {
    transform: translateY(-10px) scale(1.02);
    opacity: 1;
    filter: grayscale(0%);
    box-shadow: 0 20px 30px rgba(0, 0, 0, 0.15);
    cursor: pointer;
  }

  .label-container {
    display: grid;
    place-items: center;
    height: 2rem;
    width: 100%;
    overflow: hidden;
  }

  .label-container span {
    grid-area: 1 / 1;
  }

  .selected-city {
    font-size: 1.5rem;
    font-weight: 600;
    color: #222;
    text-transform: uppercase;
    letter-spacing: 2px;
    padding: 5px 15px;
    border-bottom: 2px solid coral;
  }

  @media (max-width: 768px) {
    .content {
      padding: 2rem 1.5rem;
    }

    .btn {
      font-size: 1.2rem;
      padding: 1rem 2rem;
    }
  }
</style>
