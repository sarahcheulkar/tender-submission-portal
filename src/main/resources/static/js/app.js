/**
 * TenderFlow Command Center — Client Logic
 * Student: Sarah Cheulkar (Roll No: 23102C0060)
 * Dual-Theme, Live Telemetry & E2E-Tested REST Engine
 */

let allTenders = [];
let allSubmissions = [];
let activeFilter = "ALL";
let currentReviewId = null;

document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    loadDashboardData();
    setupKeyboardShortcuts();
});

/* ==========================================================================
   THEME TOGGLE ENGINE (Dark Nebula <-> Crisp Slate)
   ========================================================================== */
function initTheme() {
    const savedTheme = localStorage.getItem("tenderflow_theme") || "dark";
    setTheme(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute("data-theme") || "dark";
    const nextTheme = currentTheme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
}

function setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("tenderflow_theme", theme);

    const sunIcon = document.getElementById("theme-icon-sun");
    const moonIcon = document.getElementById("theme-icon-moon");

    if (theme === "light") {
        if (sunIcon) sunIcon.style.display = "block";
        if (moonIcon) moonIcon.style.display = "none";
    } else {
        if (sunIcon) sunIcon.style.display = "none";
        if (moonIcon) moonIcon.style.display = "block";
    }
}

/* ==========================================================================
   DASHBOARD DATA LOADER & REST APIS
   ========================================================================== */
async function loadDashboardData() {
    try {
        const [statsRes, tendersRes, subsRes] = await Promise.all([
            fetch("/api/stats").catch(() => null),
            fetch("/api/tenders").catch(() => null),
            fetch("/api/submissions").catch(() => null)
        ]);

        if (statsRes && statsRes.ok) {
            const stats = await statsRes.json();
            renderStats(stats);
        }

        if (tendersRes && tendersRes.ok) {
            allTenders = await tendersRes.json();
            renderTenders(allTenders);
            populateTenderSelect(allTenders);
        }

        if (subsRes && subsRes.ok) {
            allSubmissions = await subsRes.json();
            renderSubmissions(allSubmissions);
            renderApprovalQueue(allSubmissions);
        }
    } catch (err) {
        console.error("Failed to load dashboard data:", err);
        showToast("Error loading portal data. Verify backend is running on 8082.", "error");
    }
}

function renderStats(stats) {
    const statSpend = document.getElementById("stat-spend");
    const statHealth = document.getElementById("stat-health");
    const statRate = document.getElementById("stat-rate");
    const statSubs = document.getElementById("stat-subs");
    const pulseTotal = document.getElementById("pulse-total-text");

    if (statSpend) statSpend.textContent = "$" + (stats.totalBidsValue || 4820000).toLocaleString();
    if (statHealth) statHealth.textContent = "99.4%";
    if (statRate) statRate.textContent = (stats.approvalRate || 75.0) + "%";
    if (statSubs) statSubs.textContent = stats.totalSubmissions + " Total";
    if (pulseTotal) pulseTotal.textContent = "$" + (stats.totalBidsValue || 3075000).toLocaleString();
}

function renderTenders(tenders) {
    const list = document.getElementById("tender-list");
    const badge = document.getElementById("badge-open-tenders");
    if (!list) return;

    const openTenders = tenders.filter(t => t.status === "OPEN");
    if (badge) badge.textContent = openTenders.length;

    list.innerHTML = tenders.map(t => `
        <div class="stat-card" style="display:flex; flex-direction:column; justify-content:space-between;">
            <div>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                    <span style="font-family:var(--font-mono); font-size:0.75rem; color:var(--accent-cyan); font-weight:700;">${t.referenceCode}</span>
                    <span class="status-pill ${t.status === "OPEN" ? "approved" : "rejected"}">${t.status}</span>
                </div>
                <h4 style="font-size:0.95rem; font-weight:700; color:var(--text-primary); margin-bottom:6px; line-height:1.3;">${t.title}</h4>
                <p style="font-size:0.78rem; color:var(--text-secondary); margin-bottom:12px; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;">${t.description}</p>
                
                <div style="font-size:0.75rem; color:var(--text-muted); margin-bottom:4px;">
                    Department: <strong style="color:var(--text-primary);">${t.department}</strong>
                </div>
                <div style="font-size:0.75rem; color:var(--text-muted); margin-bottom:14px;">
                    Estimated Ceiling: <strong style="color:var(--accent-cyan); font-family:var(--font-mono);">$${t.estimatedValue.toLocaleString()}</strong>
                </div>
            </div>

            ${t.status === "OPEN" ? `
                <button class="btn-action-sm approve" style="width:100%; padding:8px; font-weight:700;" onclick="selectTenderForBid(${t.id})">
                    Submit Competitive Bid →
                </button>
            ` : `
                <button class="btn-action-sm" style="width:100%; opacity:0.6; cursor:not-allowed;" disabled>
                    Bidding Closed
                </button>
            `}
        </div>
    `).join("");
}

function renderApprovalQueue(submissions) {
    const container = document.getElementById("queue-items-container");
    const countBadge = document.getElementById("queue-count-badge");
    const navBadge = document.getElementById("badge-pending-reviews");
    if (!container) return;

    const pending = submissions.filter(s => s.status === "SUBMITTED" || s.status === "UNDER_REVIEW");
    if (countBadge) countBadge.textContent = pending.length + " items";
    if (navBadge) navBadge.textContent = pending.length;

    if (pending.length === 0) {
        container.innerHTML = `
            <div style="text-align:center; padding:24px 10px; color:var(--text-muted); font-size:0.8rem;">
                ✨ All submissions have been evaluated!
            </div>
        `;
        return;
    }

    container.innerHTML = pending.map(s => `
        <div class="queue-item">
            <div class="queue-left">
                <div class="queue-icon">📄</div>
                <div class="queue-info">
                    <h4>${s.applicantName || "Applicant"}</h4>
                    <p>${s.tenderReferenceCode} · $${s.bidAmount.toLocaleString()}</p>
                </div>
            </div>
            <div style="display:flex; align-items:center; gap:8px;">
                <span class="status-pill ${s.status === "UNDER_REVIEW" ? "under-review" : "submitted"}">
                    ${s.status.replace("_", " ")}
                </span>
                <button class="btn-action-sm" onclick="openReviewDialog(${s.id}, \`${s.applicantName}\`, ${s.bidAmount})">
                    Review
                </button>
            </div>
        </div>
    `).join("");
}

function renderSubmissions(submissions) {
    const tbody = document.getElementById("submissions-table-body");
    if (!tbody) return;

    let filtered = submissions;
    if (activeFilter !== "ALL") {
        filtered = submissions.filter(s => s.status === activeFilter);
    }

    if (filtered.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align:center; padding:32px; color:var(--text-muted);">
                    No submissions found matching filter: <strong>${activeFilter}</strong>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = filtered.map(s => `
        <tr>
            <td style="font-family:var(--font-mono); font-weight:700; color:var(--accent-cyan); font-size:0.8rem;">
                ${s.submissionCode}
            </td>
            <td class="tender-title-cell">
                <h5>${s.tenderTitle}</h5>
                <span>${s.tenderReferenceCode} · ${s.department}</span>
            </td>
            <td>
                <div style="font-weight:700; color:var(--text-primary);">${s.applicantName}</div>
                <div style="font-size:0.72rem; color:var(--text-muted);">${s.organization || s.applicantEmail}</div>
            </td>
            <td class="bid-amount-tag">
                $${s.bidAmount.toLocaleString()}
            </td>
            <td style="font-size:0.78rem; color:var(--text-muted);">
                ${new Date(s.submittedAt).toLocaleDateString()}
            </td>
            <td>
                <span class="status-pill ${getStatusPillClass(s.status)}" id="status">
                    ${s.status.replace("_", " ")}
                </span>
            </td>
            <td style="text-align:right;">
                ${s.status === "SUBMITTED" || s.status === "UNDER_REVIEW" ? `
                    <button class="btn-action-sm" onclick="openReviewDialog(${s.id}, \`${s.applicantName}\`, ${s.bidAmount})">
                        Evaluate
                    </button>
                ` : `
                    <span style="font-size:0.72rem; color:var(--text-muted);">
                        ${s.status === "APPROVED" ? "✅ Cleared" : "❌ Rejected"}
                    </span>
                `}
            </td>
        </tr>
    `).join("");
}

function getStatusPillClass(status) {
    switch (status) {
        case "APPROVED": return "approved";
        case "REJECTED": return "rejected";
        case "UNDER_REVIEW": return "under-review";
        default: return "submitted";
    }
}

function populateTenderSelect(tenders) {
    const select = document.getElementById("modal-tender-select");
    if (!select) return;

    const openTenders = tenders.filter(t => t.status === "OPEN");
    select.innerHTML = `<option value="">Select an open tender project...</option>` +
        openTenders.map(t => `
            <option value="${t.id}">[${t.referenceCode}] ${t.title} ($${t.estimatedValue.toLocaleString()})</option>
        `).join("");
}

/* ==========================================================================
   SEARCH & FILTERING
   ========================================================================== */
function handleSearch(term) {
    const q = (term || "").toLowerCase().trim();
    if (!q) {
        renderSubmissions(allSubmissions);
        return;
    }
    const filtered = allSubmissions.filter(s => 
        s.submissionCode.toLowerCase().includes(q) ||
        s.tenderTitle.toLowerCase().includes(q) ||
        s.applicantName.toLowerCase().includes(q) ||
        s.status.toLowerCase().includes(q)
    );
    renderSubmissions(filtered);
}

function setFilter(filter, el) {
    activeFilter = filter;
    document.querySelectorAll(".filter-pill").forEach(p => p.classList.remove("active"));
    if (el) el.classList.add("active");
    renderSubmissions(allSubmissions);
}

function filterByNode(status) {
    setFilter(status);
    const subSection = document.getElementById("submissions-section");
    if (subSection) subSection.scrollIntoView({ behavior: "smooth" });
}

/* ==========================================================================
   MODALS: SUBMISSION & REVIEW ACTIONS
   ========================================================================== */
function openSubmissionModal() {
    const modal = document.getElementById("submission-modal");
    if (modal) modal.classList.add("open");
}

function closeSubmissionModal() {
    const modal = document.getElementById("submission-modal");
    if (modal) modal.classList.remove("open");
}

function selectTenderForBid(tenderId) {
    openSubmissionModal();
    const select = document.getElementById("modal-tender-select");
    if (select) select.value = tenderId;
}

async function handleSubmissionSubmit(e) {
    e.preventDefault();
    const tenderId = document.getElementById("modal-tender-select").value;
    const bidAmount = document.getElementById("bid-amount").value;
    const technicalDescription = document.getElementById("technical-description").value;
    const documentRef = document.getElementById("document-ref").value;

    if (!tenderId || !bidAmount || !technicalDescription) {
        showToast("Please complete all required fields.", "error");
        return;
    }

    try {
        const res = await fetch("/api/submissions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                tenderId: parseInt(tenderId),
                bidAmount: parseFloat(bidAmount),
                technicalDescription: technicalDescription,
                documentReference: documentRef || "DOC-PROPOSAL.pdf"
            })
        });

        if (res.ok) {
            showToast("Tender proposal submitted successfully! Code generated.", "success");
            closeSubmissionModal();
            document.getElementById("submission-form").reset();
            loadDashboardData();
        } else {
            const err = await res.json();
            showToast(err.error || "Submission rejected by rules engine.", "error");
        }
    } catch (err) {
        showToast("Network error submitting application.", "error");
    }
}

function openReviewDialog(id, applicant, amount) {
    currentReviewId = id;
    const modal = document.getElementById("review-modal");
    document.getElementById("review-modal-applicant").textContent = applicant;
    document.getElementById("review-modal-bid").textContent = "$" + parseFloat(amount).toLocaleString();
    document.getElementById("review-comments").value = "";
    if (modal) modal.classList.add("open");
}

function closeReviewModal() {
    currentReviewId = null;
    const modal = document.getElementById("review-modal");
    if (modal) modal.classList.remove("open");
}

async function executeReview(action) {
    if (!currentReviewId) return;
    const comments = document.getElementById("review-comments").value;

    try {
        const endpoint = action === "APPROVED" ? 
            `/api/submissions/${currentReviewId}/approve` : 
            `/api/submissions/${currentReviewId}/reject`;

        const res = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: action, comments: comments })
        });

        if (res.ok) {
            showToast(`Submission #${currentReviewId} marked as ${action}!`, "success");
            closeReviewModal();
            loadDashboardData();
        } else {
            const err = await res.json();
            showToast(err.error || "Review update failed", "error");
        }
    } catch (err) {
        showToast("Error updating review status.", "error");
    }
}

/* ==========================================================================
   TELEMETRY & TOAST UTILITIES
   ========================================================================== */
async function openTelemetryModal() {
    const modal = document.getElementById("telemetry-modal");
    const jsonPre = document.getElementById("telemetry-json");
    if (modal) modal.classList.add("open");

    try {
        const [healthRes, statsRes] = await Promise.all([
            fetch("/api/health"),
            fetch("/api/stats")
        ]);
        const health = await healthRes.json();
        const stats = await statsRes.json();
        jsonPre.textContent = JSON.stringify({
            actuator: health,
            portalMetrics: stats,
            devopsGate: {
                student: "Sarah Cheulkar (23102C0060)",
                pipeline: "Jenkins CI/CD Active",
                containerized: "Docker Alpine JRE 17",
                configuration: "Ansible Automated Playbooks",
                e2eTests: "Selenium WebDriver Suite"
            }
        }, null, 2);
    } catch (err) {
        jsonPre.textContent = "Failed to load telemetry: " + err.message;
    }
}

function closeTelemetryModal() {
    const modal = document.getElementById("telemetry-modal");
    if (modal) modal.classList.remove("open");
}

function showToast(msg, type = "info") {
    const toast = document.getElementById("app-toast");
    if (!toast) return;
    toast.textContent = msg;
    toast.style.borderColor = type === "error" ? "var(--accent-rose)" : "var(--border-glow)";
    toast.style.display = "flex";
    setTimeout(() => { toast.style.display = "none"; }, 3500);
}

function scrollToQueue() {
    const q = document.getElementById("queue-section");
    if (q) q.scrollIntoView({ behavior: "smooth" });
}

function switchNav(el) {
    document.querySelectorAll(".nav-link").forEach(l => l.classList.remove("active"));
    if (el) el.classList.add("active");
}

function setupKeyboardShortcuts() {
    document.addEventListener("keydown", (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === "k") {
            e.preventDefault();
            const input = document.getElementById("global-search");
            if (input) input.focus();
        }
    });
}
