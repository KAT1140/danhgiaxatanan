const defaultHamlets = [
  "Huyền Hội",
  "Lưu Tư",
  "Bình Thới",
  "Trà Ôn",
  "Giồng Bèn",
  "Giồng Mới",
  "Sóc",
  "Đại An",
  "Tân An Chợ",
  "Trà Ốp",
  "Long Hội",
  "Cầu Xây",
  "Nhà Thờ",
];

const defaultCriterionTemplates = [
  {
    id: "1",
    category: "Công tác Hội và phong trào thanh niên",
    title: "100% Chi đoàn, chi Hội hoàn thành kiểm tra việc nghiên cứu, học tập, quán triệt Nghị quyết trọng tâm của Đảng, Mặt trận Tổ quốc Việt Nam, của Đoàn – Hội LHTN Việt Nam trên ứng dụng Thanh niên Việt Nam.",
    requirements: "Báo cáo kết quả thực hiện; hình ảnh, tài liệu hoặc đường link minh chứng.",
    points: 10,
    score: 0,
    summary: "",
    evidence: "",
  },
  {
    id: "2",
    category: "Công tác Hội và phong trào thanh niên",
    title: "100% Chi đoàn, chi Hội tham gia học tập các Nghị quyết trọng tâm của Đảng, Mặt trận Tổ quốc Việt Nam, của Đoàn – Hội LHTN Việt Nam khi có thông báo triệu tập.",
    requirements: "Báo cáo kết quả thực hiện; hình ảnh, tài liệu hoặc đường link minh chứng.",
    points: 10,
    score: 0,
    summary: "",
    evidence: "",
  },
  {
    id: "3",
    category: "Công tác Hội và phong trào thanh niên",
    title: "Chi đoàn, chi Hội tổ chức ít nhất 01 hoạt động thăm hỏi, tặng quà cho gia đình chính sách, gia đình khó khăn trên địa bàn của ấp.",
    requirements: "Báo cáo kết quả thực hiện; hình ảnh, tài liệu hoặc đường link minh chứng.",
    points: 10,
    score: 0,
    summary: "",
    evidence: "",
  },
  {
    id: "4",
    category: "Công tác Hội và phong trào thanh niên",
    title: "100% Chi đoàn, chi Hội tham gia triển khai ít nhất 01 hoạt động trong Phong trào “Bình dân học vụ số” hỗ trợ người dân (tập huấn, ra quân cao điểm hỗ trợ người dân...).",
    requirements: "Báo cáo kết quả thực hiện; hình ảnh, tài liệu hoặc đường link minh chứng.",
    points: 10,
    score: 0,
    summary: "",
    evidence: "",
  },
  {
    id: "5",
    category: "Công tác Hội và phong trào thanh niên",
    title: "100% Chi đoàn, chi Hội có ít nhất 01 hoạt động tham gia xây dựng nông thôn mới.",
    requirements: "Báo cáo kết quả thực hiện; hình ảnh, tài liệu hoặc đường link minh chứng.",
    points: 10,
    score: 0,
    summary: "",
    evidence: "",
  },
  {
    id: "6",
    category: "Công tác Hội và phong trào thanh niên",
    title: "100% Chi đoàn, chi Hội đồng loạt tổ chức Ngày Chủ nhật xanh vào các ngày 22/3; 24/5; 26/7; 20/9.",
    requirements: "Báo cáo kết quả thực hiện; hình ảnh, tài liệu hoặc đường link minh chứng.",
    points: 10,
    score: 0,
    summary: "",
    evidence: "",
  },
  {
    id: "7",
    category: "Công tác Hội và phong trào thanh niên",
    title: "100% Chi đoàn, chi Hội xóa ít nhất 01 điểm đen về ô nhiễm môi trường.",
    requirements: "Báo cáo kết quả thực hiện; hình ảnh, tài liệu hoặc đường link minh chứng.",
    points: 10,
    score: 0,
    summary: "",
    evidence: "",
  },
  {
    id: "8",
    category: "Công tác Hội và phong trào thanh niên",
    title: "100% Chi đoàn, chi Hội triển khai các hoạt động cao điểm của Hội như: Chương trình Xuân tình nguyện, Hành trình “Tôi yêu Tổ quốc tôi”.",
    requirements: "Báo cáo kết quả thực hiện; hình ảnh, tài liệu hoặc đường link minh chứng.",
    points: 10,
    score: 0,
    summary: "",
    evidence: "",
  },
  {
    id: "9",
    category: "Công tác Hội và phong trào thanh niên",
    title: "100% Chi đoàn, chi Hội tham gia đầy đủ các hoạt động: Họp mặt kỷ niệm Ngày thành lập Đoàn, Ngày truyền thống Hội LHTN Việt Nam, Tháng Thanh niên, Chiến dịch Thanh niên tình nguyện hè...",
    requirements: "Báo cáo kết quả thực hiện; hình ảnh, tài liệu hoặc đường link minh chứng.",
    points: 10,
    score: 0,
    summary: "",
    evidence: "",
  },
  {
    id: "10",
    category: "Công tác Hội và phong trào thanh niên",
    title: "Tham gia đầy đủ các hoạt động trong năm do Đoàn – Hội xã phát động.",
    requirements: "Báo cáo kết quả thực hiện; hình ảnh, tài liệu hoặc đường link minh chứng.",
    points: 10,
    score: 0,
    summary: "",
    evidence: "",
  },
];

const API_URL = "backend/api.php";
const pageType = document.body.dataset.page;
let toastTimeout;
let assessmentResetCheckRunning = false;
let hamlets = [...defaultHamlets];
let criterionTemplates = defaultCriterionTemplates.map((criterion) => ({ ...criterion }));
let hamletIds = Object.fromEntries(hamlets.map((hamlet, index) => [hamlet, index + 1]));
let activeHamlet = hamlets[0];
let currentUser = null;
let csrfToken = "";
let users = [];
let assessmentHistory = [];
let assessmentHistoryItems = [];
let hamletData = Object.fromEntries(hamlets.map((hamlet) => [
  hamlet,
  { criteria: createBlankCriteria(), updatedAt: "", approval: null, pendingAssessment: null },
]));
let criteria = createBlankCriteria();
let isDirty = false;

function createBlankCriteria() {
  return criterionTemplates.map((criterion) => ({ ...criterion }));
}

function readCurrentCriteria() {
  hamletData[activeHamlet].criteria = criteria.map((criterion) => ({ ...criterion }));
}

function formatSavedAt(value) {
  if (!value) return "";
  const date = new Date(value.includes(" ") ? value.replace(" ", "T") : value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat("vi-VN", { dateStyle: "short", timeStyle: "short" }).format(date);
}

async function requestApi(method = "GET", body = undefined) {
  const headers = body ? { "Content-Type": "application/json" } : {};
  if (method !== "GET" && body?.action !== "login" && csrfToken) {
    headers["X-CSRF-Token"] = csrfToken;
  }
  const response = await fetch(API_URL, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
    credentials: "same-origin",
  });
  const result = await response.json();
  if (response.status === 401 && pageType !== "login") {
    currentUser = null;
    window.location.href = "dang-nhap.html?expired=1";
  }
  if (!response.ok) {
    throw new Error(result.error || `Máy chủ trả về lỗi ${response.status}.`);
  }
  return result;
}

async function loadSavedValues(savedResult = null) {
  const result = savedResult || await requestApi();
  if (
    !Array.isArray(result.hamlets) ||
    !Array.isArray(result.criteria) ||
    !Array.isArray(result.assessments) ||
    !Array.isArray(result.approvals) ||
    !Array.isArray(result.assessment_history) ||
    !Array.isArray(result.assessment_history_items) ||
    !Array.isArray(result.pending_assessments) ||
    !Array.isArray(result.pending_assessment_items)
  ) {
    throw new Error("Dữ liệu API trả về không đúng định dạng.");
  }

  currentUser = result.user;
  if (pageType === "admin" && currentUser.role !== "admin") {
    window.location.replace("tong-quan.html");
    return;
  }
  if (pageType === "approval" && currentUser.role !== "admin") {
    window.location.replace("tong-quan.html");
    return;
  }
  if (pageType === "accounts" && currentUser.role !== "admin") {
    window.location.replace("tong-quan.html");
    return;
  }
  if (
    pageType !== "admin" &&
    pageType !== "approval" &&
    pageType !== "accounts" &&
    currentUser.role === "admin"
  ) {
    window.location.replace("quan-tri.html");
    return;
  }
  csrfToken = result.csrf_token;
  users = Array.isArray(result.users) ? result.users : [];
  assessmentHistory = result.assessment_history;
  assessmentHistoryItems = result.assessment_history_items;
  hamlets = result.hamlets.map((hamlet) => hamlet.name);
  hamletIds = Object.fromEntries(result.hamlets.map((hamlet) => [hamlet.name, Number(hamlet.id)]));
  criterionTemplates = result.criteria.map((criterion) => ({
    id: String(criterion.id),
    category: "Công tác Hội và phong trào thanh niên",
    title: criterion.title,
    requirements: criterion.evidence_requirements,
    points: Number(criterion.max_points),
    score: 0,
    summary: "",
    evidence: "",
  }));

  hamletData = Object.fromEntries(hamlets.map((hamlet) => [hamlet, {
    criteria: createBlankCriteria(),
    updatedAt: "",
    approval: null,
    pendingAssessment: null,
  }]));
  const criteriaByHamlet = new Map();
  result.assessments.forEach((assessment) => {
    const hamletName = result.hamlets.find((hamlet) => Number(hamlet.id) === Number(assessment.hamlet_id))?.name;
    if (!hamletName || !hamletData[hamletName]) return;
    const criterion = hamletData[hamletName].criteria.find(
      (item) => Number(item.id) === Number(assessment.criterion_id)
    );
    if (!criterion) return;
    criterion.score = Number(assessment.score);
    criterion.summary = assessment.self_evidence || "";
    criterion.evidence = assessment.evidence_links || "";
    if (!criteriaByHamlet.has(hamletName)) criteriaByHamlet.set(hamletName, []);
    if (assessment.updated_at) criteriaByHamlet.get(hamletName).push(assessment.updated_at);
  });
  hamlets.forEach((hamlet) => {
    const dates = criteriaByHamlet.get(hamlet) || [];
    hamletData[hamlet].updatedAt = dates.sort().at(-1) || "";
  });
  result.approvals.forEach((approval) => {
    const hamletName = result.hamlets.find(
      (hamlet) => Number(hamlet.id) === Number(approval.hamlet_id)
    )?.name;
    if (hamletName && hamletData[hamletName]) {
      hamletData[hamletName].approval = approval;
    }
  });
  result.pending_assessments.forEach((pending) => {
    const hamletName = result.hamlets.find(
      (hamlet) => Number(hamlet.id) === Number(pending.hamlet_id)
    )?.name;
    if (!hamletName || !hamletData[hamletName]) return;
    const items = result.pending_assessment_items.filter(
      (item) => Number(item.history_id) === Number(pending.id)
    );
    const pendingCriteria = criterionTemplates.map((template) => {
      const item = items.find(
        (entry) => Number(entry.criterion_id) === Number(template.id)
      );
      return {
        ...template,
        title: item?.criterion_title || template.title,
        points: Number(item?.max_points ?? template.points),
        score: Number(item?.score ?? 0),
        communeScore: item?.commune_score === null || item?.commune_score === undefined
          ? Number(item?.score ?? 0)
          : Number(item.commune_score),
        summary: item?.self_evidence || "",
        evidence: item?.evidence_links || "",
      };
    });
    hamletData[hamletName].pendingAssessment = {
      id: Number(pending.id),
      submittedAt: pending.submitted_at,
      submittedBy: pending.submitted_by,
      totalScore: Number(pending.total_score),
      confirmedAt: pending.confirmed_at,
      confirmedBy: pending.confirmed_by_name,
      criteria: pendingCriteria,
    };
    if (
      hamletData[hamletName].updatedAt &&
      matchesPendingSnapshot(hamletData[hamletName].criteria, pendingCriteria)
    ) {
      hamletData[hamletName].criteria = createBlankCriteria();
      hamletData[hamletName].updatedAt = "";
    }
  });

  if (currentUser.role === "hamlet") {
    const assignedHamlet = result.hamlets.find(
      (hamlet) => Number(hamlet.id) === Number(currentUser.hamlet_id)
    );
    if (!assignedHamlet) {
      throw new Error("Không tìm thấy ấp được phân quyền cho tài khoản này.");
    }
    activeHamlet = assignedHamlet.name;
  } else if (pageType === "assessment" || pageType === "approval") {
    const selectedHamletId = Number(new URLSearchParams(window.location.search).get("hamlet_id"));
    const selectedHamlet = result.hamlets.find((hamlet) => Number(hamlet.id) === selectedHamletId);
    if (!selectedHamlet && pageType === "approval") {
      window.location.replace("quan-tri.html");
      return;
    }
    if (selectedHamlet) activeHamlet = selectedHamlet.name;
  } else if (!hamlets.includes(activeHamlet)) {
    activeHamlet = hamlets[0];
  }
  criteria = hamletData[activeHamlet].criteria.map((criterion) => ({ ...criterion }));
  isDirty = false;
  document.querySelector("#account-chip").textContent = currentUser.role === "admin"
    ? `${currentUser.username} · Quản trị viên`
    : `${currentUser.username} · Ấp ${currentUser.hamlet_name}`;
  if (pageType === "dashboard" && currentUser.role === "hamlet") {
    document.querySelector(".page-content").classList.add("hamlet-dashboard");
    document.querySelector(".page-heading h1").textContent = `Tổng quan ấp ${activeHamlet}`;
    document.querySelector(".page-heading p").textContent =
      `Theo dõi kết quả tự đánh giá của ấp ${activeHamlet}.`;
    document.querySelector(".recent-heading h2").textContent = `Thông tin ấp ${activeHamlet}`;
    document.querySelector(".recent-heading p").textContent =
      "Kết quả và tiến độ tự đánh giá của ấp được phân quyền cho tài khoản này.";
  }
  const approvalStatus = document.querySelector("#approval-status");
  if (approvalStatus) approvalStatus.hidden = currentUser.role !== "hamlet";
  const hamletsScoredCard = document.querySelector("#hamlets-scored-card");
  if (hamletsScoredCard) hamletsScoredCard.hidden = currentUser.role !== "admin";
  const completedCountCard = document.querySelector("#completed-count-card");
  if (completedCountCard) completedCountCard.hidden = currentUser.role !== "admin";
  const progressPanel = document.querySelector("#progress-panel");
  if (progressPanel) progressPanel.hidden = currentUser.role !== "admin";
  const unitPanel = document.querySelector("#unit-panel");
  if (unitPanel) unitPanel.hidden = currentUser.role !== "admin";
  if (pageType === "accounts") renderAccountList();
  if (pageType === "assessment") {
    renderHamletSelect();
    document.querySelector("#assessment-hamlet-name").textContent = `Ấp ${activeHamlet}`;
    document.querySelector("#save-message").textContent = hamletData[activeHamlet].pendingAssessment
      ? `Lần đánh giá gần nhất đã lưu vào lịch sử lúc ${formatSavedAt(hamletData[activeHamlet].pendingAssessment.submittedAt)}. Phiếu hiện tại đã được làm trống.`
      : hamletData[activeHamlet].approval
        ? "Điểm đã được xã xác nhận; phiếu điểm đã được làm mới."
        : hamletData[activeHamlet].updatedAt
          ? "Điểm đã lưu, đang chờ xã xác nhận."
          : "Đã tải dữ liệu từ cơ sở dữ liệu.";
    updateAssessmentApprovalStatus();
    renderCriteria(document.querySelector("#criteria-search").value);
  }
  if (pageType === "approval") renderApprovalPage();
  if (pageType === "history") renderAssessmentHistory();
  setApiStatus("Đã kết nối cơ sở dữ liệu", true);
  updateSummary();
}

function setApiStatus(message, connected) {
  const status = document.querySelector("#api-status-text");
  if (!status) return;
  status.textContent = message;
  document.querySelector(".sidebar-note .online-dot").classList.toggle("offline", !connected);
}

function updateAssessmentApprovalStatus() {
  const status = document.querySelector("#assessment-approval-status");
  if (!status) return;
  const { approval, updatedAt } = hamletData[activeHamlet];
  const pendingAssessment = hamletData[activeHamlet].pendingAssessment;
  status.classList.toggle("approved", Boolean(approval));
  status.textContent = approval
    ? `Lần trước được xã xác nhận lúc ${formatSavedAt(approval.confirmed_at)}. Phiếu hiện tại đã được reset về 0.`
    : pendingAssessment
      ? `Đã lưu vào lịch sử lúc ${formatSavedAt(pendingAssessment.submittedAt)} và đang chờ xã xác nhận. Phiếu hiện tại đã được làm trống.`
    : updatedAt
      ? "Điểm đã lưu, đang chờ xã xác nhận. Phiếu cũ sẽ được giữ lại trong lịch sử."
      : "Chưa có điểm lưu; nhập kết quả rồi bấm Lưu dữ liệu để gửi xã xác nhận.";
}

function hasApprovedResetAssessment(result, hamletId) {
  if (
    !Array.isArray(result.approvals) ||
    !Array.isArray(result.assessments) ||
    !Array.isArray(result.criteria)
  ) {
    throw new Error("Dữ liệu trạng thái xác nhận trả về không đúng định dạng.");
  }
  const approvalExists = result.approvals.some(
    (approval) => Number(approval.hamlet_id) === hamletId
  );
  const assessments = result.assessments.filter(
    (assessment) => Number(assessment.hamlet_id) === hamletId
  );
  return approvalExists &&
    result.criteria.length > 0 &&
    assessments.length === result.criteria.length &&
    assessments.every((assessment) =>
      Number(assessment.score) === 0 &&
      !assessment.self_evidence &&
      !assessment.evidence_links &&
      !assessment.updated_at
    );
}

function matchesPendingSnapshot(currentCriteria, pendingCriteria) {
  const snapshotById = new Map(pendingCriteria.map((criterion) => [criterion.id, criterion]));
  return currentCriteria.length === pendingCriteria.length &&
    currentCriteria.every((criterion) => {
      const saved = snapshotById.get(criterion.id);
      return saved &&
        Number(criterion.score) === Number(saved.score) &&
        criterion.summary === saved.summary &&
        criterion.evidence === saved.evidence;
    });
}

function renderHamletSelect() {
  const select = document.querySelector("#hamlet-select");
  select.innerHTML = hamlets.map((hamlet) =>
    `<option value="${escapeHtml(hamlet)}">${escapeHtml(hamlet)}</option>`
  ).join("");
  select.value = activeHamlet;
  document.querySelector(".hamlet-select-wrap").hidden = currentUser?.role !== "admin";
}

function renderAccountList() {
  const isAdmin = currentUser?.role === "admin";
  const hamletSelect = document.querySelector("#user-hamlet-select");
  if (hamletSelect) hamletSelect.innerHTML = hamlets.map((hamlet) =>
    `<option value="${hamletIds[hamlet]}">${escapeHtml(hamlet)}</option>`
  ).join("");
  document.querySelector("#account-list").innerHTML = isAdmin
    ? users.map((user) => `
      <tr>
        <td>${escapeHtml(user.username)}</td>
        <td>${user.role === "admin" ? "Quản trị viên" : "Thường"}</td>
        <td>${user.hamlet_name ? `Ấp ${escapeHtml(user.hamlet_name)}` : "Toàn xã"}</td>
      </tr>`).join("")
    : "";
}

function categoryGroups() {
  return criteria.reduce((groups, criterion) => {
    if (!groups[criterion.category]) groups[criterion.category] = [];
    groups[criterion.category].push(criterion);
    return groups;
  }, {});
}

function getHamletSummary(hamlet) {
  const pending = hamletData[hamlet].pendingAssessment;
  const entries = pending?.criteria || (hamlet === activeHamlet ? criteria : hamletData[hamlet].criteria);
  const score = entries.reduce((sum, criterion) => sum + (Number(criterion.score) || 0), 0);
  const completed = entries.filter((criterion) => criterion.summary.trim()).length;
  return {
    score,
    completed,
    updatedAt: pending?.submittedAt || hamletData[hamlet].updatedAt,
    approval: hamletData[hamlet].approval,
  };
}

function renderHamletCards() {
  const container = document.querySelector("#hamlet-grid");
  if (!container) return;
  container.innerHTML = hamlets.map((hamlet) => {
    const summary = getHamletSummary(hamlet);
    const isAdminPage = pageType === "admin";
    const approvalLabel = summary.approval
      ? `Đã xác nhận${summary.approval.confirmed_at ? ` · ${formatSavedAt(summary.approval.confirmed_at)}` : ""}`
      : summary.updatedAt ? "Chờ xác nhận" : "Chưa lưu điểm";
    const cardContent = `
      <span class="hamlet-card-icon" aria-hidden="true">⌂</span>
      <span class="hamlet-card-copy">
        <strong>Ấp ${escapeHtml(hamlet)}</strong>
        <small>${summary.completed}/${criterionTemplates.length} nội dung có minh chứng</small>
      </span>
      <span class="hamlet-card-score">${summary.score}<small>/100</small></span>`;
    return `
      <article class="hamlet-card">
        ${isAdminPage
          ? `<div class="hamlet-card-main">${cardContent}</div>`
          : `<button class="hamlet-card-main" type="button" data-select-hamlet="${escapeHtml(hamlet)}">${cardContent}</button>`}
        <div class="hamlet-card-footer">
          <span>${summary.updatedAt ? `Lưu: ${escapeHtml(summary.updatedAt)}` : "Chưa cập nhật"}</span>
          ${isAdminPage
            ? `<div class="hamlet-approval">
                <span class="approval-badge ${summary.approval ? "approved" : ""}">${escapeHtml(approvalLabel)}</span>
                <a class="hamlet-approval-button" href="xac-nhan-diem.html?hamlet_id=${hamletIds[hamlet]}">Xem chi tiết</a>
              </div>`
            : `<span class="approval-badge ${summary.approval ? "approved" : ""}">${escapeHtml(approvalLabel)}</span>
              <button class="hamlet-score-button" type="button" data-select-hamlet="${escapeHtml(hamlet)}">Chấm điểm <span aria-hidden="true">→</span></button>`}
        </div>
      </article>`;
  }).join("");
  if (pageType !== "admin") {
    container.querySelectorAll("[data-select-hamlet]").forEach((button) => {
      button.addEventListener("click", () => {
        window.location.href = `tu-danh-gia.html?hamlet_id=${hamletIds[button.dataset.selectHamlet]}`;
      });
    });
  }
}

function renderApprovalPage() {
  const summary = getHamletSummary(activeHamlet);
  const reviewCriteria = hamletData[activeHamlet].pendingAssessment?.criteria || hamletData[activeHamlet].criteria;
  const isConfirmed = Boolean(summary.approval);
  const communeScoresComplete = hasValidCommuneScores(reviewCriteria);
  const communeTotal = communeScoresComplete
    ? reviewCriteria.reduce((sum, criterion) => sum + Number(criterion.communeScore), 0)
    : null;
  document.querySelector("#approval-hamlet-name").textContent = `Ấp ${activeHamlet}`;
  document.querySelector("#approval-heading-copy").textContent =
    `Kiểm tra điểm ấp tự đánh giá, chấm điểm xã theo từng tiêu chí và xác nhận kết quả của ấp ${activeHamlet}.`;
  document.querySelector("#approval-total-score").textContent = summary.score;
  document.querySelector("#approval-commune-total-score").textContent = communeTotal ?? "—";
  document.querySelector("#approval-completed-count").textContent =
    `${summary.completed}/${criterionTemplates.length} nội dung có minh chứng`;
  document.querySelector("#approval-saved-at").textContent =
    summary.updatedAt ? `Lưu gần nhất: ${formatSavedAt(summary.updatedAt)}` : "Ấp chưa lưu điểm.";
  document.querySelector("#approval-review-list").innerHTML = `
    <div class="approval-table">
      <div class="approval-table-head" aria-hidden="true">
        <span>Nội dung đánh giá</span><span>TT</span><span>Điểm ấp</span>
        <span>Điểm xã</span><span>Tự minh chứng</span><span>Minh chứng</span>
      </div>
      ${reviewCriteria.map((criterion) => `
        <article class="approval-table-row">
          <div class="approval-criterion-description">
            <strong>${escapeHtml(criterion.title)}</strong>
            <small><b>Yêu cầu minh chứng:</b> ${escapeHtml(criterion.requirements)}</small>
          </div>
          <div class="approval-table-number">${escapeHtml(criterion.id)}</div>
          <div class="approval-table-score"><strong>${criterion.score}</strong><span>/ ${criterion.points}</span></div>
          <div class="approval-table-score">
            <label class="approval-commune-score-input">
              <input type="number" min="0" max="${criterion.points}" step="1" value="${criterion.communeScore ?? ""}" data-commune-score="${escapeHtml(criterion.id)}" aria-label="Điểm xã đánh giá tiêu chí ${escapeHtml(criterion.id)}" ${isConfirmed ? "disabled" : ""} />
              <small>/ ${criterion.points}</small>
            </label>
          </div>
          <div class="approval-table-evidence">${escapeHtml(criterion.summary || "Chưa nhập minh chứng.")}</div>
          <div class="approval-table-evidence">${escapeHtml(criterion.evidence || "Chưa có liên kết hoặc tài liệu.")}</div>
        </article>`).join("")}
    </div>`;

  const status = document.querySelector("#approval-page-status");
  const button = document.querySelector("#approval-action");
  if (summary.approval) {
    status.textContent =
      `Đã xác nhận bởi ${summary.approval.confirmed_by} lúc ${formatSavedAt(summary.approval.confirmed_at)}.`;
    status.classList.add("approved");
    button.textContent = "Gỡ xác nhận";
    button.dataset.approved = "false";
  } else {
    status.textContent = hamletData[activeHamlet].pendingAssessment?.confirmedAt
      ? "Lần đánh giá đã được chấm điểm và xác nhận trước đó; có thể xác nhận lại sau khi bổ sung điểm xã."
      : hamletData[activeHamlet].pendingAssessment
      ? `Ấp đang chờ xác nhận bản đánh giá đã lưu lúc ${formatSavedAt(hamletData[activeHamlet].pendingAssessment.submittedAt)}.`
      : summary.updatedAt
        ? "Ấp đang chờ quản trị viên xác nhận điểm."
      : "Ấp chưa lưu điểm, chưa thể xác nhận.";
    status.classList.remove("approved");
    button.textContent = "Xác nhận điểm của ấp";
    button.dataset.approved = "true";
  }
  button.dataset.hamletId = String(hamletIds[activeHamlet]);
  button.disabled = !summary.approval &&
    !hamletData[activeHamlet].pendingAssessment &&
    !summary.updatedAt;
}

function hasValidCommuneScores(criteriaList) {
  return criteriaList.length === criterionTemplates.length &&
    criteriaList.every((criterion) =>
      criterion.communeScore !== null &&
      criterion.communeScore !== undefined &&
      criterion.communeScore !== "" &&
      Number.isInteger(Number(criterion.communeScore)) &&
      Number(criterion.communeScore) >= 0 &&
      Number(criterion.communeScore) <= Number(criterion.points)
    );
}

function updateApprovalCommuneTotal() {
  const reviewCriteria = hamletData[activeHamlet].pendingAssessment?.criteria || hamletData[activeHamlet].criteria;
  const complete = hasValidCommuneScores(reviewCriteria);
  const score = document.querySelector("#approval-commune-total-score");
  const button = document.querySelector("#approval-action");
  score.textContent = complete
    ? reviewCriteria.reduce((sum, criterion) => sum + Number(criterion.communeScore), 0)
    : "—";
  button.disabled = button.dataset.approved === "true" &&
    !hamletData[activeHamlet].pendingAssessment &&
    !hamletData[activeHamlet].updatedAt;
}

function renderAssessmentHistory() {
  const itemsByHistory = new Map();
  assessmentHistoryItems.forEach((item) => {
    const historyId = String(item.history_id);
    if (!itemsByHistory.has(historyId)) itemsByHistory.set(historyId, []);
    itemsByHistory.get(historyId).push(item);
  });

  const container = document.querySelector("#assessment-history-list");
  if (assessmentHistory.length === 0) {
    container.innerHTML = '<p class="empty-state history-empty">Chưa có lần đánh giá nào được lưu.</p>';
    return;
  }

  container.innerHTML = assessmentHistory.map((entry) => {
    const historyItems = itemsByHistory.get(String(entry.id)) || [];
    const maximumScore = historyItems.reduce((sum, item) => sum + Number(item.max_points), 0);
    const communeScoreComplete = historyItems.length > 0 &&
      historyItems.every((item) => item.commune_score !== null && item.commune_score !== undefined);
    const totalCommuneScore = communeScoreComplete
      ? historyItems.reduce((sum, item) => sum + Number(item.commune_score), 0)
      : null;
    return `
      <details class="history-entry">
        <summary class="history-entry-summary">
          <div>
            <span class="eyebrow">${entry.confirmed_at ? "ĐÃ ĐƯỢC XÃ XÁC NHẬN" : "CHỜ XÃ XÁC NHẬN"}</span>
            <h2>Lần đánh giá · ${escapeHtml(formatSavedAt(entry.submitted_at))}</h2>
            <p>${entry.confirmed_at
              ? `Xác nhận bởi ${escapeHtml(entry.confirmed_by)} lúc ${escapeHtml(formatSavedAt(entry.confirmed_at))}`
              : `Đã lưu bởi ${escapeHtml(entry.submitted_by)} · Chờ xã xác nhận`}</p>
          </div>
          <div class="history-total-scores">
            <span><small>Ấp tự chấm</small><strong>${escapeHtml(entry.total_score)}<small> / ${maximumScore}</small></strong></span>
            <span><small>Xã đánh giá</small><strong>${totalCommuneScore === null ? "Chưa chấm" : `${totalCommuneScore} / ${maximumScore}`}</strong></span>
          </div>
        </summary>
        <div class="history-entry-actions">
          <a class="button button-outline history-edit-button" href="tu-danh-gia.html" aria-label="Sửa điểm hiện tại, bản ghi lịch sử vẫn được giữ nguyên">Sửa điểm</a>
          <button class="button button-outline history-delete-button" type="button" data-history-action="delete" data-history-id="${escapeHtml(entry.id)}">Xóa</button>
          <button class="button button-outline history-collapse-button" type="button" data-history-action="collapse">Thu gọn</button>
        </div>
        <div class="history-items">
          ${historyItems.map((item) => `
            <article class="history-criterion">
              <div class="history-criterion-heading">
                <h3>${escapeHtml(item.criterion_title)}</h3>
                <div class="history-criterion-scores">
                  <strong><small>Ấp</small>${escapeHtml(item.score)}<small>/${escapeHtml(item.max_points)}</small></strong>
                  <strong><small>Xã</small>${item.commune_score === null || item.commune_score === undefined
                    ? "Chưa chấm"
                    : `${escapeHtml(item.commune_score)}/${escapeHtml(item.max_points)}`}</strong>
                </div>
              </div>
              <div class="approval-evidence-grid">
                <section><h4>Tự minh chứng</h4><p>${escapeHtml(item.self_evidence || "Chưa nhập minh chứng.")}</p></section>
                <section><h4>Liên kết minh chứng</h4><p>${escapeHtml(item.evidence_links || "Chưa có liên kết hoặc tài liệu.")}</p></section>
              </div>
            </article>`).join("")}
        </div>
      </details>`;
  }).join("");
}

async function deleteAssessmentHistory(historyId, button) {
  const entry = assessmentHistory.find((item) => Number(item.id) === historyId);
  if (!entry) {
    showToast("Không tìm thấy lần đánh giá cần xóa.");
    return;
  }

  const message = entry.confirmed_at
    ? "Xóa bản ghi lịch sử đã được xã xác nhận? Điểm hiện tại không bị thay đổi và thao tác này không thể hoàn tác."
    : "Xóa bản ghi lịch sử đang chờ xác nhận? Điểm hiện tại không bị thay đổi và thao tác này không thể hoàn tác.";
  if (!window.confirm(message)) return;

  button.disabled = true;
  try {
    await requestApi("POST", {
      action: "delete_assessment_history",
      history_id: historyId,
    });
    assessmentHistory = assessmentHistory.filter((item) => Number(item.id) !== historyId);
    assessmentHistoryItems = assessmentHistoryItems.filter((item) => Number(item.history_id) !== historyId);
    renderAssessmentHistory();
    showToast("Đã xóa bản ghi khỏi lịch sử. Điểm hiện tại không thay đổi.");
  } catch (error) {
    console.error(`Không thể xóa lịch sử đánh giá ${historyId}:`, error);
    showToast(`Xóa thất bại: ${error.message}`);
    button.disabled = false;
  }
}

async function setHamletApproval(button) {
  const hamletId = Number(button.dataset.hamletId);
  const hamlet = hamlets.find((name) => hamletIds[name] === hamletId);
  const approved = button.dataset.approved === "true";
  if (!hamlet) {
    showToast("Không tìm thấy ấp cần xác nhận.");
    return;
  }
  const reviewedAssessment = hamletData[hamlet].pendingAssessment;
  const reviewCriteria = reviewedAssessment?.criteria || hamletData[hamlet].criteria;
  if (approved && !hasValidCommuneScores(reviewCriteria)) {
    const invalidCriteria = reviewCriteria.filter((criterion) =>
      criterion.communeScore === null ||
      criterion.communeScore === undefined ||
      criterion.communeScore === "" ||
      !Number.isInteger(Number(criterion.communeScore)) ||
      Number(criterion.communeScore) < 0 ||
      Number(criterion.communeScore) > Number(criterion.points)
    );
    const firstInvalidInput = document.querySelector(
      `[data-commune-score="${CSS.escape(invalidCriteria[0]?.id ?? "")}"]`
    );
    firstInvalidInput?.focus();
    showToast(`Kiểm tra điểm xã của ${invalidCriteria.length} tiêu chí còn thiếu hoặc chưa hợp lệ.`);
    return;
  }
  const actionText = approved ? "xác nhận điểm" : "gỡ xác nhận điểm";
  if (!window.confirm(`Bạn có chắc muốn ${actionText} của ấp ${hamlet}?`)) return;

  button.disabled = true;
  try {
    const result = await requestApi("POST", {
      action: "set_score_approval",
      hamlet_id: hamletId,
      approved,
      history_id: approved ? reviewedAssessment?.id : undefined,
      commune_scores: approved
        ? reviewCriteria.map((criterion) => ({
            criterion_id: Number(criterion.id),
            score: Number(criterion.communeScore),
          }))
        : undefined,
    });
    if (approved && result.already_confirmed) {
      await loadSavedValues();
      showToast(`Điểm của ấp ${hamlet} đã được xác nhận ở phiên khác.`);
      return;
    }
    hamletData[hamlet].approval = result.approval;
    if (approved) {
      const assessedCriteria = reviewCriteria.map((criterion) => ({
        ...criterion,
        communeScore: Number(criterion.communeScore),
      }));
      if (reviewedAssessment) {
        reviewedAssessment.criteria = assessedCriteria;
        reviewedAssessment.confirmedAt = result.approval.confirmed_at;
        reviewedAssessment.confirmedBy = result.approval.confirmed_by;
      } else {
        hamletData[hamlet].pendingAssessment = {
          id: Number(result.history_id),
          submittedAt: result.submitted_at,
          submittedBy: "",
          totalScore: assessedCriteria.reduce((sum, criterion) => sum + Number(criterion.score), 0),
          confirmedAt: result.approval.confirmed_at,
          confirmedBy: result.approval.confirmed_by,
          criteria: assessedCriteria,
        };
      }
    }
    if (approved) {
      hamletData[hamlet].criteria = criterionTemplates.map((criterion) => ({
        ...criterion,
        score: 0,
        summary: "",
        evidence: "",
      }));
      hamletData[hamlet].updatedAt = "";
      if (hamlet === activeHamlet) {
        criteria = hamletData[hamlet].criteria.map((criterion) => ({ ...criterion }));
        isDirty = false;
      }
    }
    if (pageType === "approval") renderApprovalPage();
    else updateSummary();
    showToast(approved
      ? `Đã xác nhận điểm của ấp ${hamlet}.`
      : `Đã gỡ xác nhận điểm của ấp ${hamlet}.`);
  } catch (error) {
    console.error(`Không thể ${actionText} của ấp ${hamlet}:`, error);
    showToast(`${actionText[0].toLocaleUpperCase("vi")}${actionText.slice(1)} thất bại: ${error.message}`);
    button.disabled = false;
  }
}

function selectHamlet(hamlet) {
  if (!hamlets.includes(hamlet)) return;
  if (isDirty && !window.confirm(`Bạn chưa lưu điểm của ấp ${activeHamlet}. Chuyển ấp và giữ nội dung đang nhập tạm thời?`)) {
    document.querySelector("#hamlet-select").value = activeHamlet;
    return;
  }
  if (isDirty) readCurrentCriteria();
  activeHamlet = hamlet;
  criteria = hamletData[hamlet].criteria.map((criterion) => ({ ...criterion }));
  isDirty = false;
  document.querySelector("#hamlet-select").value = hamlet;
  document.querySelector("#assessment-hamlet-name").textContent = `Ấp ${hamlet}`;
  document.querySelector("#save-message").textContent = hamletData[hamlet].pendingAssessment
    ? `Đã lưu vào lịch sử lúc ${formatSavedAt(hamletData[hamlet].pendingAssessment.submittedAt)}. Phiếu hiện tại đã được làm trống.`
    : hamletData[hamlet].updatedAt
      ? `Đã lưu lúc ${formatSavedAt(hamletData[hamlet].updatedAt)}`
      : "Dữ liệu sẽ được lưu vào cơ sở dữ liệu.";
  updateAssessmentApprovalStatus();
  const lastUpdated = document.querySelector("#last-updated");
  if (lastUpdated) {
    lastUpdated.textContent = formatSavedAt(
      hamletData[hamlet].pendingAssessment?.submittedAt || hamletData[hamlet].updatedAt
    ) || "Chưa lưu";
  }
  renderCriteria(document.querySelector("#criteria-search").value);
  updateSummary();
}

function renderCriteria(query = "") {
  const container = document.querySelector("#criteria-list");
  const normalizedQuery = query.trim().toLocaleLowerCase("vi");
  const groups = categoryGroups();
  let visibleCount = 0;
  const tableHead = `
    <div class="criterion-table">
      <div class="criterion-table-head" aria-hidden="true">
        <span>Nội dung đánh giá</span><span>TT</span><span>Tổng<br />điểm</span>
        <span>Tự minh chứng</span><span>Minh chứng</span>
      </div>`;
  const categoryRows = Object.entries(groups).map(([category, items], groupIndex) => {
    const filtered = items.filter((criterion) =>
      `${criterion.id} ${criterion.title} ${criterion.requirements} ${category}`.toLocaleLowerCase("vi").includes(normalizedQuery)
    );
    if (!filtered.length) return "";
    visibleCount += filtered.length;
    return filtered.map((criterion) => `
          <div class="criterion-row" data-criterion="${escapeHtml(criterion.id)}">
            <div class="criterion-description">
              <strong>${escapeHtml(criterion.title)}</strong>
              <small><b>Yêu cầu minh chứng:</b> ${escapeHtml(criterion.requirements)}</small>
            </div>
            <div class="criterion-level">${escapeHtml(criterion.id)}</div>
            <div class="criterion-points">
              <div class="score-input">
                <input id="score-${criterion.id}" type="number" min="0" max="${criterion.points}" step="1" value="${criterion.score}" data-field="score" data-id="${criterion.id}" aria-label="Điểm tự đánh giá, tối đa ${criterion.points}" />
                <span>/ ${criterion.points}</span>
              </div>
            </div>
            <div class="criterion-entry">
              <label for="summary-${criterion.id}">Tự minh chứng</label>
              <textarea id="summary-${criterion.id}" data-field="summary" data-id="${criterion.id}" placeholder="Mô tả kết quả thực hiện...">${escapeHtml(criterion.summary)}</textarea>
            </div>
            <div class="criterion-entry">
              <label for="evidence-${criterion.id}">Liên kết minh chứng</label>
              <textarea id="evidence-${criterion.id}" data-field="evidence" data-id="${criterion.id}" placeholder="Dán liên kết hoặc ghi tên tài liệu...">${escapeHtml(criterion.evidence)}</textarea>
            </div>
          </div>`).join("");
  }).join("");
  container.innerHTML = visibleCount
    ? `${tableHead}${categoryRows}</div>`
    : '<div class="panel empty-state">Không tìm thấy tiêu chí phù hợp.</div>';
  container.querySelectorAll("[data-field]").forEach((field) => {
    field.addEventListener("input", onCriterionInput);
    field.addEventListener("change", onCriterionInput);
  });
}

function onCriterionInput(event) {
  const input = event.currentTarget;
  const criterion = criteria.find((item) => item.id === input.dataset.id);
  if (!criterion) return;
  if (input.dataset.field === "score") {
    const score = Number(input.value);
    if (!Number.isFinite(score)) return;
    criterion.score = Math.max(0, Math.min(criterion.points, Math.round(score)));
    input.value = criterion.score;
  } else {
    criterion[input.dataset.field] = input.value;
  }
  isDirty = true;
  readCurrentCriteria();
  document.querySelector("#save-message").textContent = "Có thay đổi chưa lưu.";
  updateSummary();
}

function updateSummary() {
  if (pageType === "login") return;
  const summaries = hamlets.map((hamlet) => getHamletSummary(hamlet));
  const isAdmin = currentUser?.role === "admin";
  const totalScore = summaries.reduce((sum, summary) => sum + summary.score, 0);
  const averageScore = isAdmin
    ? Math.round(totalScore / hamlets.length)
    : getHamletSummary(activeHamlet).score;
  const scoredHamlets = summaries.filter((summary) => summary.updatedAt).length;
  const completed = isAdmin
    ? summaries.reduce((sum, summary) => sum + summary.completed, 0)
    : getHamletSummary(activeHamlet).completed;
  const totalItems = (isAdmin ? hamlets.length : 1) * criterionTemplates.length;
  const remaining = totalItems - completed;
  const percent = totalItems ? Math.round(completed / totalItems * 100) : 0;
  const latestUpdate = (isAdmin ? hamlets : [activeHamlet])
    .map((hamlet) => hamletData[hamlet].pendingAssessment?.submittedAt || hamletData[hamlet].updatedAt)
    .filter(Boolean)
    .sort((left, right) => new Date(right).getTime() - new Date(left).getTime())[0];

  if (pageType === "assessment") {
    document.querySelector("#assessment-score").textContent = criteria.reduce(
      (sum, criterion) => sum + (Number(criterion.score) || 0), 0
    );
    return;
  }
  if (pageType !== "dashboard" && pageType !== "admin") return;
  document.querySelector("#dashboard-score").textContent = averageScore;
  document.querySelector("#score-progress").style.width = `${averageScore}%`;
  document.querySelector("#hamlets-scored").textContent = scoredHamlets;
  document.querySelector("#hamlets-total").textContent = hamlets.length;
  document.querySelector("#hamlets-pending").textContent = `${hamlets.length - scoredHamlets} ấp`;
  document.querySelector("#score-scope-label").textContent = isAdmin
    ? `ĐIỂM TRUNG BÌNH ${hamlets.length} ẤP`
    : `ĐIỂM ẤP ${activeHamlet.toLocaleUpperCase("vi")}`;
  document.querySelector("#completed-count").textContent = completed;
  document.querySelector("#completed-total").textContent = totalItems;
  document.querySelector("#hamlet-count-summary").textContent = hamlets.length;
  document.querySelector("#total-items-copy").textContent = totalItems;
  document.querySelector("#legend-total-items").textContent = remaining;
  document.querySelector(".hamlet-count").textContent = isAdmin ? `${hamlets.length} ấp` : `Ấp ${activeHamlet}`;
  document.querySelector("#completion-percent").textContent = `${percent}%`;
  document.querySelector("#completion-bar").style.width = `${percent}%`;
  document.querySelector("#legend-complete-count").textContent = completed;
  document.querySelector("#last-updated").textContent = formatSavedAt(latestUpdate) || "Chưa lưu";
  const approvalStatus = document.querySelector("#approval-status");
  if (approvalStatus && !isAdmin) {
    const approval = getHamletSummary(activeHamlet).approval;
    approvalStatus.textContent = approval
      ? `Đã được quản trị viên ${approval.confirmed_by} xác nhận điểm lúc ${formatSavedAt(approval.confirmed_at)}.`
      : hamletData[activeHamlet].pendingAssessment || hamletData[activeHamlet].updatedAt
        ? "Điểm đang chờ quản trị viên xác nhận."
        : "Ấp chưa lưu điểm để quản trị viên xác nhận.";
  }
  renderHamletCards();
}

async function saveData() {
  readCurrentCriteria();
  try {
    const serverState = await requestApi();
    const assignedHamletId = Number(currentUser.hamlet_id);
    if (
      !hamletData[activeHamlet].approval &&
      hasApprovedResetAssessment(serverState, assignedHamletId)
    ) {
      if (
        isDirty &&
        !window.confirm("Xã vừa xác nhận và reset phiếu về 0. Tải phiếu mới về và bỏ các thay đổi chưa lưu?")
      ) return;
      await loadSavedValues(serverState);
      document.querySelector("#save-message").textContent =
        "Xã đã xác nhận; phiếu mới đã được reset về 0.";
      showToast("Xã đã xác nhận. Phiếu điểm đã được reset về 0.");
      return;
    }
    const submittedCriteria = criteria.map((criterion) => ({ ...criterion }));
    const result = await requestApi("PUT", {
      hamlet_id: hamletIds[activeHamlet],
      assessments: criteria.map((criterion) => ({
        criterion_id: Number(criterion.id),
        score: Number(criterion.score) || 0,
        self_evidence: criterion.summary,
        evidence_links: criterion.evidence,
      })),
    });
    hamletData[activeHamlet].pendingAssessment = {
      id: Number(result.history_id),
      submittedAt: result.submitted_at,
      submittedBy: currentUser.username,
      totalScore: submittedCriteria.reduce((sum, criterion) => sum + (Number(criterion.score) || 0), 0),
      criteria: submittedCriteria,
    };
    hamletData[activeHamlet].criteria = createBlankCriteria();
    hamletData[activeHamlet].updatedAt = "";
    hamletData[activeHamlet].approval = null;
    criteria = createBlankCriteria();
    isDirty = false;
    renderCriteria(document.querySelector("#criteria-search").value);
    const lastUpdated = document.querySelector("#last-updated");
    if (lastUpdated) lastUpdated.textContent = formatSavedAt(result.submitted_at);
    document.querySelector("#save-message").textContent =
      `Đã lưu vào lịch sử lúc ${formatSavedAt(result.submitted_at)}. Phiếu hiện tại đã được làm trống.`;
    updateAssessmentApprovalStatus();
    updateSummary();
    showToast(`Đã lưu điểm của ấp ${activeHamlet} vào lịch sử; phiếu hiện tại đã được làm trống.`);
  } catch (error) {
    console.error("Không thể lưu dữ liệu qua API:", error);
    document.querySelector("#save-message").textContent = error.message;
    showToast(`Lưu thất bại: ${error.message}`);
  }
}

async function refreshData() {
  if (isDirty && !window.confirm("Bạn có thay đổi chưa lưu. Tải lại dữ liệu từ máy chủ và bỏ các thay đổi này?")) return;
  try {
    await loadSavedValues();
    const search = document.querySelector("#criteria-search");
    if (search) renderCriteria(search.value);
    showToast("Đã tải lại dữ liệu từ cơ sở dữ liệu.");
  } catch (error) {
    console.error("Không thể tải dữ liệu từ API:", error);
    setApiStatus("Không kết nối được cơ sở dữ liệu", false);
    showToast(`Tải dữ liệu thất bại: ${error.message}`);
  }
}

async function refreshAssessmentAfterApproval() {
  if (
    pageType !== "assessment" ||
    currentUser?.role !== "hamlet" ||
    isDirty ||
    assessmentResetCheckRunning ||
    document.visibilityState !== "visible"
  ) return;

  const hasCurrentScores = hamletData[activeHamlet].criteria.some(
    (criterion) => Number(criterion.score) !== 0 || criterion.summary !== "" || criterion.evidence !== ""
  );
  if (!hasCurrentScores) return;

  assessmentResetCheckRunning = true;
  try {
    const result = await requestApi();
    const assignedHamletId = Number(currentUser.hamlet_id);
    if (hasApprovedResetAssessment(result, assignedHamletId)) {
      await loadSavedValues(result);
      showToast("Xã đã xác nhận. Phiếu điểm đã được reset về 0.");
    }
  } catch (error) {
    console.error("Không thể kiểm tra trạng thái xác nhận điểm:", error);
    setApiStatus("Không thể kiểm tra trạng thái xác nhận", false);
  } finally {
    assessmentResetCheckRunning = false;
  }
}

async function handleLogin(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const submit = document.querySelector("#login-button");
  const formData = new FormData(form);
  submit.disabled = true;
  try {
    const result = await requestApi("POST", {
      action: "login",
      username: formData.get("username"),
      password: formData.get("password"),
    });
    csrfToken = result.csrf_token;
    form.reset();
    window.location.href = result.user?.role === "admin" ? "quan-tri.html" : "tong-quan.html";
  } catch (error) {
    console.error("Đăng nhập thất bại:", error);
    const loginError = document.querySelector("#login-error");
    loginError.textContent = error.message;
    loginError.hidden = false;
  } finally {
    submit.disabled = false;
  }
}

async function handleLogout() {
  try {
    await requestApi("POST", { action: "logout" });
    window.location.href = "dang-nhap.html";
  } catch (error) {
    console.error("Đăng xuất thất bại:", error);
    showToast(`Đăng xuất thất bại: ${error.message}`);
  }
}

async function createHamletAccount(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const submit = document.querySelector("#create-user-button");
  const message = document.querySelector("#account-message");
  const formData = new FormData(form);
  submit.disabled = true;
  message.textContent = "";
  try {
    const result = await requestApi("POST", {
      action: "create_user",
      username: formData.get("username"),
      password: formData.get("password"),
      hamlet_id: Number(formData.get("hamlet_id")),
    });
    users.unshift(result.user);
    renderAccountList();
    form.reset();
    message.textContent = `Đã tạo tài khoản ${result.user.username} cho ấp ${result.user.hamlet_name}. Hãy gửi mật khẩu tạm cho người dùng qua kênh an toàn.`;
  } catch (error) {
    console.error("Không thể tạo tài khoản ấp:", error);
    message.textContent = error.message;
  } finally {
    submit.disabled = false;
  }
}

function showToast(message) {
  const toast = document.querySelector("#toast");
  toast.textContent = message;
  toast.classList.add("visible");
  window.clearTimeout(toastTimeout);
  toastTimeout = window.setTimeout(() => toast.classList.remove("visible"), 2800);
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  })[character]);
}

const loginForm = document.querySelector("#login-form");
if (loginForm) {
  const expired = new URLSearchParams(window.location.search).has("expired");
  if (expired) {
    document.querySelector("#login-error").textContent = "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.";
    document.querySelector("#login-error").hidden = false;
  }
  loginForm.addEventListener("submit", handleLogin);
} else {
  document.querySelector("#logout-button").addEventListener("click", handleLogout);
  document.querySelector("#menu-toggle").addEventListener("click", () => {
    document.querySelector("#sidebar").classList.toggle("expanded");
  });
  document.querySelector("#refresh-button").addEventListener("click", refreshData);
  if (pageType === "dashboard") {
    document.querySelector("#start-assessment").addEventListener("click", (event) => {
      event.preventDefault();
      window.location.href = "tu-danh-gia.html";
    });
  }
  if (pageType === "accounts") {
    const createUserForm = document.querySelector("#create-user-form");
    if (createUserForm) createUserForm.addEventListener("submit", createHamletAccount);
  }
  if (pageType === "assessment") {
    document.querySelector("#hamlet-select").addEventListener("change", (event) => selectHamlet(event.target.value));
    document.querySelector("#save-button").addEventListener("click", saveData);
    document.querySelector("#criteria-search").addEventListener("input", (event) => renderCriteria(event.target.value));
    document.querySelector("#show-all").addEventListener("click", () => {
      document.querySelector("#criteria-search").value = "";
      renderCriteria();
    });
    window.setInterval(refreshAssessmentAfterApproval, 15000);
    window.addEventListener("focus", refreshAssessmentAfterApproval);
    document.addEventListener("visibilitychange", refreshAssessmentAfterApproval);
  }
  if (pageType === "approval") {
    document.querySelector("#approval-action").addEventListener("click", (event) => {
      setHamletApproval(event.currentTarget);
    });
    document.querySelector("#approval-review-list").addEventListener("input", (event) => {
      const input = event.target.closest("[data-commune-score]");
      if (!input) return;
      const reviewCriteria = hamletData[activeHamlet].pendingAssessment?.criteria || hamletData[activeHamlet].criteria;
      const criterion = reviewCriteria.find((item) => item.id === input.dataset.communeScore);
      if (!criterion) return;
      criterion.communeScore = input.value === "" ? null : Number(input.value);
      updateApprovalCommuneTotal();
    });
  }
  if (pageType === "history") {
    document.querySelector("#assessment-history-list").addEventListener("click", (event) => {
      const collapseButton = event.target.closest('[data-history-action="collapse"]');
      if (collapseButton) {
        collapseButton.closest(".history-entry").open = false;
        return;
      }
      const button = event.target.closest('[data-history-action="delete"]');
      if (button) deleteAssessmentHistory(Number(button.dataset.historyId), button);
    });
  }
  loadSavedValues().catch((error) => {
    console.error("Không thể tải dữ liệu từ API:", error);
    setApiStatus("Không kết nối được cơ sở dữ liệu", false);
    showToast(`Không thể tải dữ liệu: ${error.message}`);
  });
}
