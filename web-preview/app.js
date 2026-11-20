const form = document.querySelector("#brief-form");
const defaults = Object.fromEntries(new FormData(form));
const voices = {
  "Direct & practical": {
    opener: "Let’s make this practical",
    friday: "Before you close your laptop Friday, write these three lines.",
  },
  "Warm & conversational": {
    opener: "Let’s talk about something you might find helpful",
    friday:
      "Before you head into the weekend, let’s give Monday a little breathing room.",
  },
  "Bold & energetic": {
    opener: "Ready to put this into action? Here’s the starting point",
    friday: "Close the week with a plan. Three lines, then you’re done.",
  },
  Inspirational: {
    opener: "A small beginning can give you a direction. Start here",
    friday:
      "Give your next Monday a little direction with three lines this Friday.",
  },
  Empowering: {
    opener: "You get to choose your next step. Let’s explore",
    friday:
      "You can decide how you start Monday. Take five minutes to choose your first move.",
  },
  "Educational & clear": {
    opener: "Let’s break this down, one step at a time",
    friday:
      "A Friday review has three parts. Here’s what to write for each one.",
  },
  "Expert & confident": {
    opener: "Start with a clear process for",
    friday:
      "Give your weekly review a clear structure. Capture delivery, blockers, and next actions.",
  },
  "Playful & witty": {
    opener: "Let’s give this idea a little less head-scratching",
    friday: "Leave Monday a note. Future you has enough tabs open already.",
  },
  "Empathetic & reassuring": {
    opener: "If this feels like a lot, start with one manageable step",
    friday:
      "If this week felt scattered, take a breath. Start your review with three simple lines.",
  },
  "Calm & reflective": {
    opener: "Take a moment to consider",
    friday:
      "Before the week ends, pause. What did you finish, and what will you carry forward?",
  },
  "Thought-provoking": {
    opener: "What would you reconsider about",
    friday:
      "What if your Monday plan began with the things you leave unfinished on Friday?",
  },
  "Personal & storytelling": {
    opener: "Picture a familiar moment. It brings us to",
    friday:
      "Picture Friday afternoon. Your laptop is still open, and Monday is already on your mind.",
  },
};
const sampleBeats = [
  {
    name: "The hook",
    line: "Before you close your laptop Friday, write these three lines.",
    shot: "Close-up of a pen drawing three lines.",
    overlay: "Before you close your laptop Friday.",
  },
  {
    name: "The first check",
    line: "First, what did you finish? Name one thing a client can actually use.",
    shot: "Write “proposal sent” on line one.",
    overlay: "What did you deliver?",
  },
  {
    name: "The second check",
    line: "Second, what’s blocked? Write down who you’re waiting on and what you need.",
    shot: "Point to “budget approval” on line two.",
    overlay: "What’s still blocked?",
  },
  {
    name: "The next move",
    line: "Third, what’s your first move Monday? Put it on the calendar before you sign off. Save this for Friday.",
    shot: "Block a calendar slot using fictional project details.",
    overlay: "Make your first move.",
  },
];
let brief = { ...defaults };
let beats = sampleBeats.map((beat) => ({ ...beat }));
let hooks = [
  "Before you close your laptop Friday, write these three lines.",
  "Start Monday with one decision already made.",
  "Your Monday list starts with what you stop doing Friday.",
];
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
  const activeBeat = Math.min(
    Math.floor((elapsed / duration) * beats.length),
    beats.length - 1,
  );
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
    time.textContent = `${Math.round((index * duration) / 4)}–${Math.round(((index + 1) * duration) / 4)} sec`;
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
    brief.topic === defaults.topic && brief.audience === defaults.audience;
  if (isExample) {
    beats = sampleBeats.map((beat) => ({ ...beat }));
    beats[3].line = `Third, what’s your first move Monday? Put it on the calendar before you sign off. ${brief.cta}`;
    hooks = [
      sampleBeats[0].line,
      "Start Monday with one decision already made.",
      "Your Monday list starts with what you stop doing Friday.",
    ];
  } else {
    hooks = [
      `Let’s make this practical: ${brief.topic}`,
      `One useful question for ${brief.audience}: where would you start?`,
      `Here’s a simple way to think about ${brief.topic.replace(/[.!?]+$/, "")}.`,
    ];
    beats = [
      {
        name: "The hook",
        line: hooks[0],
        shot: "Show the situation using a staged example.",
        overlay: brief.topic,
      },
      {
        name: "Make it specific",
        line: `If you’re part of this audience — ${brief.audience} — start with one real situation you recognize.`,
        shot: "Replace this placeholder with one audience-specific example.",
        overlay: "Start with a real situation.",
      },
      {
        name: "Give them a next step",
        line: "Explain one action the viewer can take. Add your supported advice here, then show it in practice.",
        shot: "Demonstrate the actual step. Check every claim.",
        overlay: "Show one useful step.",
      },
      {
        name: "The invitation",
        line: brief.cta,
        shot: "End with the same action written clearly on screen.",
        overlay: brief.cta,
      },
    ];
  }
  const voice = voices[brief.voice];
  if (brief.voice !== defaults.voice) {
    hooks[0] = isExample ? voice.friday : `${voice.opener}: ${brief.topic}`;
    hooks[1] = `${voice.opener}: ${isExample ? "your first move on Monday" : brief.topic}`;
    hooks[2] = isExample
      ? `${voice.friday} ${brief.cta}`
      : `${voice.opener}. What does this look like for ${brief.audience}?`;
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
  hooks = [
    sampleBeats[0].line,
    "Start Monday with one decision already made.",
    "Your Monday list starts with what you stop doing Friday.",
  ];
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
