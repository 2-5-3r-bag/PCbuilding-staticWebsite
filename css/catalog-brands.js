
document.addEventListener("DOMContentLoaded", () => {

  // Зөвхөн сонгосон 4 каталогт ажиллана
  const page = location.pathname.split("/").pop().toLowerCase();

  const type = {
    "parts-gpu.html": "gpu",
    "parts-cpu.html": "cpu",
    "parts-ram.html": "ram",
    "parts-motherboard.html": "motherboard"
  }[page];

  if (!type) return;

  const config = {
    gpu: {
      heading: "GPU брэнд",
      label: "График карт",
      about: "GPU нь тоглоом, 3D дүрслэл, график тооцооллыг боловсруулдаг. VRAM, цахилгаан хэрэглээ, картын урт болон кейст багтах эсэхийг шалгаарай.",
      tip: "VRAM, хэрэглээ (Вт), урт (см) болон PSU-ийн шаардлагыг харьцуул.",
      brands: [
        ["nvidia", "NVIDIA", /\b(nvidia|geforce|rtx|gtx)\b/i],
        ["amd", "AMD Radeon", /\b(amd|radeon)\b|\brx\s*\d/i],
        ["intel", "Intel Arc", /\b(intel|arc)\b/i]
      ]
    },

    cpu: {
      heading: "CPU брэнд",
      label: "Процессор",
      about: "CPU нь компьютерийн үндсэн тооцооллыг гүйцэтгэдэг. Цөм, урсгал, давтамж, сокет болон хөргөлтийн шаардлагыг шалгаарай.",
      tip: "Сокет, цөм, урсгал, давтамж болон TDP-ийг харьцуул.",
      brands: [
        ["intel", "Intel", /\b(intel|core\s*(?:i[3579]|ultra)|pentium|celeron)\b/i],
        ["amd", "AMD", /\b(amd|ryzen|threadripper|athlon)\b/i]
      ]
    },

    ram: {
      heading: "RAM брэнд",
      label: "Санах ой",
      about: "RAM нь ажиллаж буй програмын түр өгөгдлийг хадгална. DDR4/DDR5 төрөл, багтаамж, хурд болон latency-г харьцуул.",
      tip: "DDR төрөл, GB, давтамж, latency болон RAM слотыг шалга.",
      brands: [
        ["corsair", "Corsair", /\bcorsair\b/i],
        ["kingston", "Kingston / FURY", /\b(kingston|fury)\b/i],
        ["gskill", "G.Skill", /\bg\.?\s?skill\b/i],
        ["crucial", "Crucial", /\bcrucial\b/i],
        ["teamgroup", "TeamGroup", /\b(teamgroup|t-force)\b/i],
        ["adata", "ADATA / XPG", /\b(adata|xpg)\b/i],
        ["patriot", "Patriot", /\bpatriot\b/i],
        ["samsung", "Samsung", /\bsamsung\b/i],
        ["lexar", "Lexar", /\blexar\b/i]
      ]
    },

    motherboard: {
      heading: "Motherboard брэнд",
      label: "Эх хавтан",
      about: "Эх хавтан нь CPU, RAM, GPU болон SSD-г холбодог. CPU сокет, чипсет, DDR төрөл, хэмжээ болон M.2 слотуудыг шалгаарай.",
      tip: "Сокет, чипсет, DDR слот, PCIe, M.2 болон кейсийн хэмжээг шалга.",
      brands: [
        ["asus", "ASUS", /\b(asus|rog|tuf|prime)\b/i],
        ["msi", "MSI", /\b(msi|mag|mpg|meg)\b/i],
        ["gigabyte", "Gigabyte", /\b(gigabyte|aorus)\b/i],
        ["asrock", "ASRock", /\b(asrock|steel\s*legend)\b/i],
        ["biostar", "Biostar", /\bbiostar\b/i]
      ]
    }
  }[type];

  const grid = document.querySelector(".tool .store-grid");

  if (!grid || document.querySelector(".part-brand-layout")) {
    return;
  }

  const cards = [...grid.querySelectorAll(".store-card")];

  document.documentElement.classList.add("part-brand-enabled");

  // Бүтээгдэхүүний нэрээр брэнд тодорхойлох
  function getBrand(name) {
    const found = config.brands.find(
      ([id, label, pattern]) => pattern.test(name)
    );

    return found ? found[0] : "other";
  }

  cards.forEach(card => {
    const name = card.querySelector("h4")?.textContent.trim() || "";
    card.dataset.partBrand = getBrand(name);

    // Карт бүрд мэдээлэл дэлгэдэг товч нэмэх
    if (!card.querySelector(".part-card-details")) {
      const details = document.createElement("details");
      details.className = "part-card-details";

      const summary = document.createElement("summary");
      summary.textContent = "Үзүүлэлт, мэдээлэл";
      details.append(summary);

      const model = document.createElement("p");
      model.textContent = `Загвар: ${name}`;
      details.append(model);

      const spec = card.querySelector(".spec")?.textContent.trim();

      if (spec) {
        const list = document.createElement("ul");

        spec.split("·").forEach(value => {
          if (!value.trim()) return;

          const item = document.createElement("li");
          item.textContent = value.trim();
          list.append(item);
        });

        details.append(list);
      } else {
        const missing = document.createElement("p");
        missing.textContent =
          "Нарийвчилсан үзүүлэлт одоогийн файлд байхгүй байна.";
        details.append(missing);
      }

      const tip = document.createElement("p");
      tip.textContent = "Сонгохдоо: " + config.tip;
      details.append(tip);

      card.append(details);
    }
  });

  // Зүүн талд зөвхөн брэндийн sidebar үүсгэх
  const layout = document.createElement("div");
  layout.className = "part-brand-layout";
  grid.before(layout);

  const sidebar = document.createElement("aside");
  sidebar.className = "part-brand-sidebar";

  const heading = document.createElement("h3");
  heading.textContent = config.heading;
  sidebar.append(heading);

  const buttonList = document.createElement("div");
  buttonList.className = "part-brand-buttons";
  sidebar.append(buttonList);

  // Баруун талын мэдээлэл
  const results = document.createElement("div");
  results.className = "part-brand-results";

  const info = document.createElement("section");
  info.className = "part-brand-info";
  info.setAttribute("aria-live", "polite");

  const title = document.createElement("h3");
  const description = document.createElement("p");
  const count = document.createElement("p");
  count.className = "part-brand-count";

  info.append(title, description, count);

  const empty = document.createElement("p");
  empty.className = "part-brand-empty";
  empty.textContent = "Тохирох бүтээгдэхүүн алга.";
  empty.hidden = true;

  results.append(info, empty, grid);
  layout.append(sidebar, results);

  // Зөвхөн бүтээгдэхүүнтэй брэндүүдийг харуулах
  const options = [
    ["all", "Бүх брэнд"],
    ...config.brands.map(([id, label]) => [id, label]),
    ["other", "Бусад"]
  ].filter(([id]) =>
    id === "all" ||
    cards.some(card => card.dataset.partBrand === id)
  );

  let selectedBrand = "all";

  const buttons = options.map(([id, label]) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "part-brand-button";
    button.dataset.brand = id;

    const total = id === "all"
      ? cards.length
      : cards.filter(card => card.dataset.partBrand === id).length;

    button.textContent = `${label} (${total})`;

    button.addEventListener("click", () => {
      selectedBrand = id;
      filterProducts();
    });

    buttonList.append(button);
    return button;
  });

  function filterProducts() {
    let visibleCount = 0;

    cards.forEach(card => {
      const visible =
        selectedBrand === "all" ||
        card.dataset.partBrand === selectedBrand;

      card.hidden = !visible;
      if (visible) visibleCount++;
    });

    buttons.forEach(button => {
      const active = button.dataset.brand === selectedBrand;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });

    const brand = options.find(
      ([id]) => id === selectedBrand
    )?.[1] || "Бүх брэнд";

    title.textContent = selectedBrand === "all"
      ? `${config.label} — мэдээлэл`
      : `${brand} — ${config.label}`;

    description.textContent = selectedBrand === "all"
      ? config.about
      : `${brand} брэндийн бүтээгдэхүүнүүд. ${config.about}`;

    count.textContent =
      `${visibleCount} / ${cards.length} бүтээгдэхүүн`;

    empty.hidden = visibleCount !== 0;
  }

  filterProducts();
});

/* RAM filter + эд ангийн мэдээллийн шинэчлэл */
document.addEventListener("DOMContentLoaded", () => {
  const page = location.pathname.split("/").pop();
  const type = {
    "parts-gpu.html": "gpu",
    "parts-cpu.html": "cpu",
    "parts-ram.html": "ram",
    "parts-motherboard.html": "motherboard"
  }[page];

  if (!type) return;

  const info = {
    gpu: [
      ["GPU гэж юу вэ?", "GPU нь 3D дүрслэл, тоглоомын график болон дүрсний тооцооллыг боловсруулдаг. Олон тооцоог зэрэг гүйцэтгэдэг."],
      ["VRAM ба хүчин чадал", "VRAM нь texture, 3D өгөгдөл болон дүрсний мэдээллийг түр хадгалдаг. 6GB, 8GB, 12GB, 16GB нь багтаамжийг илэрхийлнэ. Их VRAM-тай байх нь GPU заавал хурдан гэсэн үг биш."],
      ["Сонгохдоо", "Чипийн гүйцэтгэл, VRAM, GPU-ийн урт, цахилгаан хэрэглээ, хөргөлт болон тоглох нягтралыг харьцуул."]
    ],
    cpu: [
      ["CPU гэж юу вэ?", "CPU нь програмын зааврыг боловсруулж, компьютерийн үндсэн тооцооллыг хийдэг төв процессор."],
      ["Яаж ажилладаг вэ?", "CPU нь зааврыг уншиж, тооцоолж, үр дүнг дамжуулдаг. Core нь боловсруулах цөм, thread нь ажлын урсгал. GHz нь давтамжийг илэрхийлдэг."],
      ["Сонгохдоо", "CPU socket нь эх хавтантай тохирох ёстой. Цөм, thread, архитектур, цахилгаан хэрэглээ болон хөргөлтийг шалга."]
    ],
    ram: [
      ["RAM гэж юу вэ?", "RAM нь ажиллаж буй програм, тоглоомын өгөгдлийг түр хадгалдаг хурдан санах ой. Компьютер унтрахад доторх түр мэдээлэл арилна."],
      ["DDR4 ба DDR5", "DDR4 ба DDR5 нь RAM-ийн өөр үеийн стандартууд. DDR5 нь ерөнхийдөө илүү өндөр өгөгдөл дамжуулах хурдыг дэмждэг. Хоёр төрөл өөр өөр слоттой."],
      ["Багтаамж ба хурд", "GB нь санах ойн багтаамж, MT/s нь өгөгдөл дамжуулах хурд. 8GB суурь хэрэглээнд, 16GB олон тоглоом болон өдөр тутмын ажилд, 32GB олон програм зэрэг ажиллуулахад хэрэгтэй байж болно."]
    ],
    motherboard: [
      ["Motherboard гэж юу вэ?", "Эх хавтан нь CPU, RAM, GPU, SSD зэрэг бүх үндсэн эд ангийг хооронд нь холбодог плат."],
      ["Яаж ажилладаг вэ?", "CPU socket, RAM slot, PCIe болон M.2 холболтоор эд ангиуд мэдээлэл солилцоно. Chipset нь нэмэлт холболт, төхөөрөмжүүдийн ажиллагааг дэмждэг."],
      ["Сонгохдоо", "CPU socket, chipset, DDR4/DDR5 дэмжлэг, ATX/mATX хэмжээ, M.2, PCIe болон USB холболтуудыг шалга."]
    ]
  };

  const panel = document.querySelector(".part-brand-info");
  if (!panel) return;

  const oldDescription = panel.querySelector("p:not(.part-brand-count)");
  if (oldDescription) oldDescription.hidden = true;

  const guide = document.createElement("div");
  guide.className = "part-guide";

  info[type].forEach(([heading, description]) => {
    const section = document.createElement("section");
    section.className = "part-guide-item";
    const h4 = document.createElement("h4");
    h4.textContent = heading;
    const p = document.createElement("p");
    p.textContent = description;
    section.append(h4, p);
    guide.append(section);
  });

  panel.querySelector(".part-brand-count").before(guide);

  if (type !== "ram") return;

  const sidebar = document.querySelector(".part-brand-sidebar");
  const cards = [...document.querySelectorAll(
    ".part-brand-results .store-card"
  )];
  const count = panel.querySelector(".part-brand-count");
  const title = panel.querySelector("h3");
  const empty = document.querySelector(".part-brand-empty");

  sidebar.innerHTML = "<h3>RAM төрөл</h3>";

  const typeBox = document.createElement("div");
  typeBox.className = "part-brand-buttons";
  sidebar.append(typeBox);

  const capacitySection = document.createElement("div");
  capacitySection.className = "part-filter-section";
  capacitySection.innerHTML = "<h4>Багтаамж</h4>";
  const capacityBox = document.createElement("div");
  capacityBox.className = "part-brand-buttons";
  capacitySection.append(capacityBox);
  sidebar.append(capacitySection);

  let selectedDDR = "all";
  let selectedGB = "all";

  cards.forEach(card => {
    const spec = card.querySelector(".spec")?.textContent || "";
    card.dataset.ddr = spec.match(/DDR[45]/i)?.[0].toUpperCase() || "";
    card.dataset.gb = spec.match(/\b(8|16|32|64)GB\b/i)?.[1] || "";
  });

  function button(box, label, onClick) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "part-brand-button";
    b.textContent = label;
    b.addEventListener("click", onClick);
    box.append(b);
    return b;
  }

  const ddrButtons = ["all", "DDR4", "DDR5"].map(value =>
    button(typeBox, value === "all" ? "Бүх төрөл" : value, () => {
      selectedDDR = value;
      selectedGB = "all";
      update();
    })
  );

  const sizes = ["all", "8", "16", "32", "64"];
  const sizeButtons = sizes.map(value =>
    button(capacityBox, value === "all" ? "Бүх багтаамж" : value + "GB", () => {
      selectedGB = value;
      update();
    })
  );

  function update() {
    let visible = 0;

    cards.forEach(card => {
      const match =
        (selectedDDR === "all" || card.dataset.ddr === selectedDDR) &&
        (selectedGB === "all" || card.dataset.gb === selectedGB);

      card.hidden = !match;
      if (match) visible++;
    });

    capacitySection.hidden = selectedDDR === "all";

    ddrButtons.forEach((b, i) => {
      const value = ["all", "DDR4", "DDR5"][i];
      const total = cards.filter(c =>
        value === "all" || c.dataset.ddr === value
      ).length;

      b.textContent = `${value === "all" ? "Бүх төрөл" : value} (${total})`;
      b.classList.toggle("active", selectedDDR === value);
    });

    sizeButtons.forEach((b, i) => {
      const size = sizes[i];
      const total = cards.filter(c =>
        c.dataset.ddr === selectedDDR &&
        (size === "all" || c.dataset.gb === size)
      ).length;

      b.textContent =
        `${size === "all" ? "Бүх багтаамж" : size + "GB"} (${total})`;
      b.classList.toggle("active", selectedGB === size);
    });

    title.textContent = selectedDDR === "all"
      ? "RAM — мэдээлэл"
      : `RAM — ${selectedDDR}${selectedGB === "all" ? "" : " · " + selectedGB + "GB"}`;

    count.textContent = `${visible} / ${cards.length} бүтээгдэхүүн`;
    empty.hidden = visible !== 0;
  }

  update();
});
