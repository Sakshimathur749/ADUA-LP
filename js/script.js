(() => {
  const SLIDES = [
    {
      num: "01",
      label: "Airport Operations 87",
      img: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=700&q=80",
      alt: "Airport tarmac with small aircraft",
      title: "Airport Operations &<br>Terminal Management",
      desc: '"Learn how airports function behind the scenes — from terminal coordination to cargo and warehouse operations."',
      roles: [
        "Airport Terminal Operations Executive",
        "Airport Warehouse Coordinator",
        "Airport Cargo Operations Assistant",
      ],
    },
    {
      num: "02",
      label: "Aviation Safety 42",
      img: "https://images.unsplash.com/photo-1474302770737-173ee21bab63?w=700&q=80",
      alt: "Aviation safety check on runway",
      title: "Aviation Safety &<br>Regulatory Compliance",
      desc: '"Master the frameworks that keep aircraft and passengers safe — from international regulations to on-ground safety audits."',
      roles: [
        "Safety Management Systems Officer",
        "Aviation Compliance Auditor",
        "Ground Safety Supervisor",
      ],
    },
    {
      num: "03",
      label: "Customer Service 55",
      img: "https://images.unsplash.com/photo-1529074963764-98f45c47344b?w=700&q=80",
      alt: "Airline customer service counter",
      title: "Airline Customer<br>Service Excellence",
      desc: '"Develop world-class passenger handling skills — from check-in and boarding to disruption management and VIP services."',
      roles: [
        "Passenger Services Agent",
        "Check-in Counter Supervisor",
        "Airline Lounge Coordinator",
      ],
    },
    {
      num: "04",
      label: "Flight Dispatch 19",
      img: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=700&q=80",
      alt: "Flight dispatch operations centre",
      title: "Flight Dispatch &<br>Operations Control",
      desc: '"Learn to coordinate real-time flight operations, fuel planning, and crew logistics from an airline operations control centre."',
      roles: [
        "Licensed Aircraft Dispatcher",
        "Operations Control Specialist",
        "Airline Crew Scheduler",
      ],
    },
  ];

  /* ─────────────────────────────────────
       DOM refs
    ───────────────────────────────────── */
  const imgCol = document.getElementById("imgCol");
  const contentCol = document.getElementById("contentCol");
  const contentInner = document.getElementById("contentInner");
  const cardImg = document.getElementById("cardImg");
  const badgeNum = document.getElementById("badgeNum");
  const imgLabel = document.getElementById("imgLabel");
  const contentTitle = document.getElementById("contentTitle");
  const contentDesc = document.getElementById("contentDesc");
  const contentRoles = document.getElementById("contentRoles");
  const dotsEl = document.getElementById("dotsEl");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const card = document.getElementById("programCard");

  let current = 0;
  let animating = false;

  /*
      Layout state:
        imageAtLeft = true  → imgCol at grid-col 1, contentCol at grid-col 2
        imageAtLeft = false → imgCol at grid-col 2, contentCol at grid-col 1
      First slide starts with image at left.
    */
  let imageAtLeft = true;

  /* ─────────────────────────────────────
       Build dots
    ───────────────────────────────────── */
  SLIDES.forEach((_, i) => {
    const d = document.createElement("button");
    d.className = "dot" + (i === 0 ? " active" : "");
    d.setAttribute("aria-label", `Slide ${i + 1}`);
    d.addEventListener("click", () => navigate(i));
    dotsEl.appendChild(d);
  });

  function updateDots(idx) {
    dotsEl
      .querySelectorAll(".dot")
      .forEach((d, i) => d.classList.toggle("active", i === idx));
  }

  /* ─────────────────────────────────────
       Fill content into DOM
    ───────────────────────────────────── */
  function fillSlide(s) {
    cardImg.src = s.img;
    cardImg.alt = s.alt;
    badgeNum.textContent = s.num;
    imgLabel.textContent = s.label;
    contentTitle.innerHTML = s.title;
    contentDesc.textContent = s.desc;
    contentRoles.innerHTML = s.roles.map((r) => `<li>${r}</li>`).join("");
  }

  /* ─────────────────────────────────────
       Apply grid positions (no animation)
    ───────────────────────────────────── */
  function applyLayout(imgLeft, animate) {
    /* Disable transition temporarily if we don't want animation */
    if (!animate) {
      imgCol.style.transition = "none";
      contentCol.style.transition = "none";
    }

    if (imgLeft) {
      imgCol.style.gridColumn = "1";
      contentCol.style.gridColumn = "2";
      imgCol.classList.replace("at-col2", "at-col1");
      contentCol.classList.replace("at-col1", "at-col2");
    } else {
      imgCol.style.gridColumn = "2";
      contentCol.style.gridColumn = "1";
      imgCol.classList.replace("at-col1", "at-col2");
      contentCol.classList.replace("at-col2", "at-col1");
    }

    /* Restore transitions after a frame */
    if (!animate) {
      requestAnimationFrame(() => {
        imgCol.style.transition = "";
        contentCol.style.transition = "";
      });
    }
  }

  /* ─────────────────────────────────────
       Navigate
    ───────────────────────────────────── */
  function navigate(toIdx) {
    if (animating) return;
    toIdx = ((toIdx % SLIDES.length) + SLIDES.length) % SLIDES.length;
    if (toIdx === current) return;

    animating = true;
    prevBtn.disabled = true;
    nextBtn.disabled = true;

    const nextImageAtLeft = !imageAtLeft; // alternate on every navigate
    const cardW = card.offsetWidth;
    const colW = imgCol.offsetWidth;

    /*
        We animate using translateX on each column simultaneously:
          - Each column slides to where the other was
          - Meanwhile content text fades out → new content loaded → fades in

        Slide distances:
          imageAtLeft=true  (img at col1, content at col2):
            img    moves RIGHT by (cardW - colW)  px  → lands at col2
            content moves LEFT  by colW            px  → lands at col1

          imageAtLeft=false (img at col2, content at col1):
            img    moves LEFT  by (cardW - colW)  px  → lands at col1
            content moves RIGHT by colW            px  → lands at col2
      */
    const dist = cardW - colW; // px content column occupies
    let imgDelta, contentDelta;

    if (imageAtLeft) {
      // img was at left → moves right
      imgDelta = dist;
      contentDelta = -colW;
    } else {
      // img was at right → moves left
      imgDelta = -dist;
      contentDelta = colW;
    }

    // PHASE 1: fade out inner content & start column slide
    contentInner.classList.replace("visible", "fading");

    requestAnimationFrame(() => {
      imgCol.style.transform = `translateX(${imgDelta}px)`;
      contentCol.style.transform = `translateX(${contentDelta}px)`;
    });

    const COL_DUR_MS = 560;
    setTimeout(() => {
      fillSlide(SLIDES[toIdx]);
      current = toIdx;
      imageAtLeft = nextImageAtLeft;
      updateDots(current);
    }, COL_DUR_MS * 0.45);

    setTimeout(() => {
      imgCol.style.transition = "none";
      contentCol.style.transition = "none";
      imgCol.style.transform = "";
      contentCol.style.transform = "";
      applyLayout(imageAtLeft, false);

      requestAnimationFrame(() => {
        imgCol.style.transition = "";
        contentCol.style.transition = "";
        contentInner.classList.replace("fading", "visible");

        setTimeout(() => {
          animating = false;
          prevBtn.disabled = false;
          nextBtn.disabled = false;
        }, 400);
      });
    }, COL_DUR_MS + 20);
  }

  prevBtn.addEventListener("click", () => navigate(current - 1));
  nextBtn.addEventListener("click", () => navigate(current + 1));

  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") navigate(current - 1);
    if (e.key === "ArrowRight") navigate(current + 1);
  });

  let swipeStartX = 0;
  card.addEventListener(
    "touchstart",
    (e) => {
      swipeStartX = e.touches[0].clientX;
    },
    { passive: true },
  );
  card.addEventListener("touchend", (e) => {
    const diff = swipeStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50)
      diff > 0 ? navigate(current + 1) : navigate(current - 1);
  });
  fillSlide(SLIDES[0]);
  applyLayout(true, false);
})();
