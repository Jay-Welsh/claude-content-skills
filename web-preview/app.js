const form = document.querySelector("#brief-form");
const defaults = Object.fromEntries(new FormData(form));
const voices = {
  "Direct & practical": {
    opener: "Let’s make this practical",
    friday:
      "Monday morning. Ten tabs open, and you still don’t know where to start.",
  },
  "Warm & conversational": {
    opener: "Let’s talk about something you might find helpful",
    friday: "Ever open your laptop Monday and feel pulled in every direction?",
  },
  "Bold & energetic": {
    opener: "Ready to put this into action? Here’s the starting point",
    friday:
      "Monday. A full inbox. A growing list. Still stuck choosing your first move?",
  },
  Inspirational: {
    opener: "A small beginning can give you a direction. Start here",
    friday:
      "You have ideas worth working on. Does Monday get swallowed by deciding where to begin?",
  },
  Empowering: {
    opener: "You get to choose your next step. Let’s explore",
    friday:
      "Does a crowded Monday leave you reacting to everyone else’s priorities?",
  },
  "Educational & clear": {
    opener: "Let’s break this down, one step at a time",
    friday:
      "A full task list can leave your next action unclear. Does that describe your Monday?",
  },
  "Expert & confident": {
    opener: "Start with a clear process for",
    friday:
      "Your Monday task list is full, but the next action is still undefined.",
  },
  "Playful & witty": {
    opener: "Let’s give this idea a little less head-scratching",
    friday:
      "Ten tabs open on Monday, and somehow none of them knows what you should do first.",
  },
  "Empathetic & reassuring": {
    opener: "If this feels like a lot, start with one manageable step",
    friday:
      "If Monday feels overwhelming before you’ve begun, choosing a first step can feel like another task.",
  },
  "Calm & reflective": {
    opener: "Take a moment to consider",
    friday:
      "Notice how Monday begins. Is there space to focus, or a list pulling you in every direction?",
  },
  "Thought-provoking": {
    opener: "What would you reconsider about",
    friday: "How much of your Monday goes into deciding what Monday is for?",
  },
  "Personal & storytelling": {
    opener: "Picture a familiar moment. It brings us to",
    friday:
      "Picture Monday morning. Your inbox is full, and you’ve opened the same unfinished list again.",
  },
};
const beatEnds = [0.2, 0.47, 1];
const sampleBeats = [
  {
    name: "The problem",
    line: "Monday morning. Ten tabs open, and you still don’t know where to start.",
    shot: "Show a staged inbox and an unfinished task list. Keep client details fictional.",
    overlay: "Monday. Where do you even start?",
  },
  {
    name: "Make it bigger",
    line: "You reread messages, rebuild your list, and spend the morning deciding what needs attention. The work is still waiting.",
    shot: "Cut between the same tabs, a growing list, and a clock moving forward.",
    overlay: "More time deciding. Work still waiting.",
  },
  {
    name: "The solution",
    line: "Try a five-minute Friday review. Write what’s delivered, what’s blocked, and your next action. Put that action on Monday’s calendar. Save this for Friday.",
    shot: "Close the extra tabs. Write the three checks and place one action in a fictional calendar.",
    overlay: "Choose Monday’s first move on Friday.",
  },
];
const sampleHooks = [
  sampleBeats[0].line,
  "Does Monday start with a full inbox and no clear first move?",
  "Your laptop is open. Your task list is growing. Where do you start?",
];
let brief = { ...defaults };
let beats = sampleBeats.map((beat) => ({ ...beat }));
let hooks = [...sampleHooks];
let selectedHook = 0;
let elapsed = 0;
let timer;
let toastTimer;
let isExample = true;

function notify(message) {
  const status = document.querySelector("#status");
  status.textContent = message;
  status.classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => status.classList.remove("visible"), 3200);
}

function stopPlayback() {
  clearInterval(timer);
  timer = undefined;
  document.querySelector("#play").textContent = "▶";
  document
    .querySelector("#play")
    .setAttribute("aria-label", "Play storyboard preview");
}

function updatePlayback() {
  const duration = Number(brief.duration);
  const nextBeat = beatEnds.findIndex((end) => elapsed < end * duration);
  const activeBeat = nextBeat === -1 ? beats.length - 1 : nextBeat;
  document.querySelector("#reel-text").textContent = beats[activeBeat].overlay;
  const minutes = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const seconds = String(Math.floor(elapsed % 60)).padStart(2, "0");
  document.querySelector("#reel-time").textContent =
    `${minutes}:${seconds} / ${duration === 60 ? "01:00" : `00:${duration}`}`;
  document.querySelector("#progress").style.width =
    `${(elapsed / duration) * 100}%`;
  document
    .querySelectorAll(".beat")
    .forEach((element, index) =>
      element.classList.toggle("active", index === activeBeat),
    );
}

function captionText() {
  if (isExample)
    return `Before you sign off Friday, write down what you delivered, what’s blocked, and the first thing you’ll do Monday.\n\n${brief.cta}`;
  return `${brief.topic}\n\nA sample outline for ${brief.audience}. Replace the example steps with your own supported advice before publishing.\n\n${brief.cta}`;
}

function render() {
  stopPlayback();
  elapsed = 0;
  document.querySelector("#draft-heading").textContent = isExample
    ? "The Friday reset"
    : brief.topic;
  document.querySelector("#draft-meta").textContent =
    `${brief.business} · Instagram Reel · ${brief.duration} sec · ${brief.voice}`;
  document.querySelector("#reel-brand").textContent =
    brief.business.toUpperCase();
  document.querySelector("#caption").textContent = captionText();
  document.querySelector(".paper-caption").textContent = isExample
    ? "THE FRIDAY RESET"
    : "YOUR STORY OUTLINE";
  const paperLabels = isExample
    ? ["Delivered", "Blocked", "First move"]
    : ["The idea", "One action", "Next step"];
  document.querySelectorAll(".paper-line").forEach((line, index) => {
    const number = document.createElement("span");
    number.textContent = String(index + 1).padStart(2, "0");
    const mark = document.createElement("i");
    mark.textContent = ["✓", "○", "↗"][index];
    line.replaceChildren(
      number,
      document.createTextNode(paperLabels[index]),
      mark,
    );
  });
  const beatContainer = document.querySelector("#beats");
  beatContainer.replaceChildren();
  beats.forEach((beat, index) => {
    const card = document.createElement("article");
    card.className = "beat";
    const header = document.createElement("div");
    header.className = "beat-header";
    const title = document.createElement("span");
    title.className = "beat-name";
    title.textContent = beat.name;
    const time = document.createElement("span");
    const duration = Number(brief.duration);
    const start = index === 0 ? 0 : beatEnds[index - 1];
    time.textContent = `${Math.round(start * duration)}–${Math.round(beatEnds[index] * duration)} sec`;
    header.append(title, time);
    const spoken = document.createElement("p");
    spoken.textContent = `“${beat.line}”`;
    const shot = document.createElement("div");
    shot.className = "shot";
    const shotIcon = document.createElement("span");
    shotIcon.textContent = "▣";
    shotIcon.setAttribute("aria-hidden", "true");
    const shotText = document.createElement("span");
    shotText.textContent = beat.shot;
    shot.append(shotIcon, shotText);
    card.append(header, spoken, shot);
    beatContainer.append(card);
  });
  const hookContainer = document.querySelector("#hooks");
  hookContainer.replaceChildren();
  hooks.forEach((hook, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `hook-option${index === selectedHook ? " selected" : ""}`;
    button.setAttribute("aria-pressed", String(index === selectedHook));
    const label = document.createElement("span");
    label.textContent =
      index === selectedHook ? "Selected opening" : "Alternative opening";
    const text = document.createElement("div");
    text.textContent = hook;
    button.append(label, text);
    button.addEventListener("click", () => {
      selectedHook = index;
      beats[0].line = hook;
      beats[0].overlay = hook;
      render();
      notify("Opening updated in your storyboard.");
    });
    hookContainer.append(button);
  });
  updatePlayback();
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const nextBrief = Object.fromEntries(new FormData(form));
  Object.keys(nextBrief).forEach((key) => {
    nextBrief[key] = nextBrief[key].trim();
  });
  if (Object.values(nextBrief).some((value) => !value)) {
    notify("Add a value to each field to build the sample.");
    return;
  }
  brief = nextBrief;
  selectedHook = 0;
  isExample =
    brief.topic === defaults.topic &&
    brief.audience === defaults.audience &&
    brief.pain === defaults.pain;
  if (isExample) {
    beats = sampleBeats.map((beat) => ({ ...beat }));
    beats[2].line = `Try a five-minute Friday review. Write what’s delivered, what’s blocked, and your next action. Put that action on Monday’s calendar. ${brief.cta}`;
    hooks = [...sampleHooks];
  } else {
    hooks = [
      brief.pain,
      `Does this feel familiar? ${brief.pain}`,
      `For ${brief.audience}, here’s a problem worth addressing. ${brief.pain}`,
    ];
    beats = [
      {
        name: "The problem",
        line: hooks[0],
        shot: "Show the audience’s problem in one recognizable, staged moment.",
        overlay: brief.pain,
      },
      {
        name: "Make it bigger",
        line: "[Add one real consequence of this problem, then show how it affects the viewer’s day. Use details you can support.]",
        shot: "Show the consequence. Use a second concrete example to build the stakes without invented numbers or fear claims.",
        overlay: "[The real consequence]",
      },
      {
        name: "The solution",
        line: `[Explain how the approach in this topic addresses that problem: ${brief.topic}] [Demonstrate one practical first step.] ${brief.cta}`,
        shot: "Show the solution in action, the first step, and the approved call to action.",
        overlay: brief.cta,
      },
    ];
  }
  const voice = voices[brief.voice];
  if (brief.voice !== defaults.voice) {
    hooks[0] = isExample ? voice.friday : `${brief.pain} ${voice.opener}.`;
    hooks[1] = isExample
      ? sampleHooks[1]
      : `Does this feel familiar? ${brief.pain}`;
    hooks[2] = isExample
      ? sampleHooks[2]
      : `${brief.pain} What does this cost you in your day?`;
    beats[0].line = hooks[0];
    beats[0].overlay = hooks[0];
  }
  render();
  notify("Sample draft updated. Review the template before filming.");
});

document.querySelector("#reset").addEventListener("click", () => {
  stopPlayback();
  form.reset();
  brief = { ...defaults };
  beats = sampleBeats.map((beat) => ({ ...beat }));
  hooks = [...sampleHooks];
  isExample = true;
  selectedHook = 0;
  selectTab("story");
  render();
  notify("Example restored.");
});

function selectTab(name) {
  document.querySelectorAll('[role="tab"]').forEach((tab) => {
    const selected = tab.dataset.tab === name;
    tab.setAttribute("aria-selected", String(selected));
    tab.tabIndex = selected ? 0 : -1;
    document.querySelector(`#panel-${tab.dataset.tab}`).hidden = !selected;
  });
}

const tabs = [...document.querySelectorAll('[role="tab"]')];
tabs.forEach((tab, index) => {
  tab.addEventListener("click", () => selectTab(tab.dataset.tab));
  tab.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    let next =
      event.key === "ArrowRight"
        ? (index + 1) % tabs.length
        : (index + tabs.length - 1) % tabs.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = tabs.length - 1;
    selectTab(tabs[next].dataset.tab);
    tabs[next].focus();
  });
});

document.querySelector("#play").addEventListener("click", () => {
  if (timer) {
    stopPlayback();
    return;
  }
  if (elapsed >= Number(brief.duration)) elapsed = 0;
  document.querySelector("#play").textContent = "Ⅱ";
  document
    .querySelector("#play")
    .setAttribute("aria-label", "Pause storyboard preview");
  timer = setInterval(() => {
    elapsed = Math.min(elapsed + 0.25, Number(brief.duration));
    updatePlayback();
    if (elapsed >= Number(brief.duration)) stopPlayback();
  }, 250);
});

document.querySelector("#copy-caption").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(captionText());
    notify("Caption copied.");
  } catch {
    notify("Select the caption text and copy it manually.");
  }
});

document.querySelector("#download").addEventListener("click", () => {
  const draft = [
    `# ${brief.business} — sample reel`,
    `Topic: ${brief.topic}`,
    `Audience: ${brief.audience}`,
    `Problem: ${brief.pain}`,
    "Structure: Problem → Make it bigger → Solution",
    `Voice: ${brief.voice}`,
    `Target duration: ${brief.duration} seconds`,
    "## Storyboard",
    ...beats.map(
      (beat) => `### ${beat.name}\n${beat.line}\nShot: ${beat.shot}`,
    ),
    "## Caption",
    captionText(),
    "## Review",
    "This is a local template preview. Review facts, timing, footage, and wording before filming.",
  ].join("\n\n");
  const url = URL.createObjectURL(
    new Blob([draft], { type: "text/markdown;charset=utf-8" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = "content-studio-draft.md";
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  notify("Draft downloaded.");
});

document.addEventListener("visibilitychange", () => {
  if (document.hidden) stopPlayback();
});
render();
