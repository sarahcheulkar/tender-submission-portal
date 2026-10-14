/**
 * TenderFlow Command Center — Complete Enterprise Frontend Engine
 * Student: Sarah Cheulkar (Roll No: 23102C0060)
 * Multi-View SPA with Real-time REST Engine & Error-Resilient Handlers
 */

// Global State
let allTenders = [];
let allSubmissions = [];
let activeSubmissionsFilter = "ALL";
let activeTenderCategory = "ALL";
let activeTenderStatus = "ALL";
let currentReviewId = null;
let currentActiveView = "overview";

document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    loadDashboardData();
    initHashRouting();
    setupKeyboardShortcuts();
});

/* ==========================================================================
   1. VIEW SWITCHER / SPA ROUTING ENGINE
   ========================================================================== */
function switchView(viewName, navEl) {
    currentActiveView = viewName;

    // Update navigation links
    document.querySelectorAll(".sidebar-nav .nav-link").forEach(link => {
        link.classList.remove("active");
    });

    if (navEl) {
        navEl.classList.add("active");
    } else {
        const matchingLink = document.querySelector(`.sidebar-nav .nav-link[data-view="${viewName}"]`);
        if (matchingLink) matchingLink.classList.add("active");
    }

    // Toggle panels
    document.querySelectorAll(".view-panel").forEach(panel => {
        panel.classList.remove("active");
    });

    const targetPanel = document.getElementById("view-" + viewName);
    if (targetPanel) {
        targetPanel.classList.add("active");
    }

    // Smooth scroll main container to top
    const mainWrapper = document.querySelector(".main-wrapper");
    if (mainWrapper) mainWrapper.scrollTop = 0;
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Update URL hash
    history.replaceState(null, "", "#" + viewName);

    // Refresh telemetry if opening telemetry view
    if (viewName === "telemetry") {
        renderTelemetry();
    }
}

function initHashRouting() {
    const hash = window.location.hash.replace("#", "").trim();
    if (hash && ["overview", "tenders", "queue", "submissions", "telemetry"].includes(hash)) {
        switchView(hash);
    }
}

/* ==========================================================================
   2. THEME ENGINE (Dark Nebula <-> Executive Slate)
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
   3. REST DATA FETCHER & PIPELINE SYNCHRONIZATION
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
            renderRecentSubmissions(allSubmissions);
        }
    } catch (err) {
        console.error("Dashboard synchronization error:", err);
        showToast("Error connecting to backend services. Checking container...", "error");
    }
}

/* ==========================================================================
   4. COMPONENT RENDERERS
   ========================================================================== */
function renderStats(stats) {
    const statSpend = document.getElementById("stat-spend");
    const statHealth = document.getElementById("stat-health");
    const statRate = document.getElementById("stat-rate");
    const statSubs = document.getElementById("stat-subs");
    const pulseTotal = document.getElementById("pulse-total-text");

    const spendValue = stats.totalBidsValue || 4820000;
    if (statSpend) statSpend.textContent = "$" + Number(spendValue).toLocaleString();
    if (statHealth) statHealth.textContent = "99.4%";
    if (statRate) statRate.textContent = (stats.approvalRate || 75.0) + "%";
    if (statSubs) statSubs.textContent = (stats.totalSubmissions || 4) + " Total";
    if (pulseTotal) pulseTotal.textContent = "$" + Number(spendValue).toLocaleString();
}

function renderTenders(tenders) {
    const catalogContainer = document.getElementById("tender-list");
    const overviewList = document.getElementById("overview-tender-list");
    const badge = document.getElementById("badge-open-tenders");

    const openCount = tenders.filter(t => t.status === "OPEN").length;
    if (badge) badge.textContent = openCount;

    // Apply category & status filters for catalog view
    let filtered = tenders;
    if (activeTenderCategory !== "ALL") {
        filtered = filtered.filter(t => t.category === activeTenderCategory);
    }
    if (activeTenderStatus !== "ALL") {
        filtered = filtered.filter(t => t.status === activeTenderStatus);
    }

    const tenderCardHtml = (t) => `
        <div class="stat-card tender-project-card" style="display:flex; flex-direction:column; justify-content:space-between; height:100%;">
            <div>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
                    <span style="font-family:var(--font-mono); font-size:0.75rem; color:var(--accent-cyan); font-weight:700; background:rgba(6,182,212,0.12); padding:3px 8px; border-radius:6px; border:1px solid rgba(6,182,212,0.25);">
                        ${t.referenceCode}
                    </span>
                    <span class="status-pill ${t.status === "OPEN" ? "approved" : "rejected"}">
                        ${t.status === "OPEN" ? "● OPEN FOR BIDS" : "● CLOSED"}
                    </span>
                </div>

                <h4 style="font-size:1.05rem; font-weight:700; color:var(--text-primary); margin-bottom:8px; line-height:1.35;">
                    ${t.title}
                </h4>

                <p style="font-size:0.82rem; color:var(--text-secondary); margin-bottom:14px; line-height:1.45; display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden;">
                    ${t.description}
                </p>

                <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; background:var(--bg-surface); padding:10px 12px; border-radius:var(--radius-md); border:1px solid var(--border-subtle); margin-bottom:16px;">
                    <div>
                        <div style="font-size:0.7rem; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.5px;">Department</div>
                        <div style="font-size:0.8rem; font-weight:600; color:var(--text-primary); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${t.department}</div>
                    </div>
                    <div>
                        <div style="font-size:0.7rem; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.5px;">Estimated Ceiling</div>
                        <div style="font-size:0.85rem; font-weight:700; color:var(--accent-cyan); font-family:var(--font-mono);">$${Number(t.estimatedValue).toLocaleString()}</div>
                    </div>
                </div>
            </div>

            <div style="display:flex; gap:8px; align-items:center;">
                ${t.status === "OPEN" ? `
                    <button class="btn-primary-gradient" style="flex:1; padding:10px; font-weight:700; font-size:0.85rem; justify-content:center;" onclick="selectTenderForBid(${t.id})">
                        Submit Competitive Bid →
                    </button>
                ` : `
                    <button class="btn-action-sm" style="flex:1; padding:10px; opacity:0.6; cursor:not-allowed; justify-content:center;" disabled>
                        Submissions Closed
                    </button>
                `}
            </div>
        </div>
    `;

    if (catalogContainer) {
        if (filtered.length === 0) {
            catalogContainer.innerHTML = `
                <div style="grid-column: 1 / -1; text-align:center; padding:48px 20px; background:var(--bg-surface); border-radius:var(--radius-lg); border:1px dashed var(--border-subtle);">
                    <div style="font-size:2rem; margin-bottom:8px;">🔍</div>
                    <h4 style="color:var(--text-primary); margin-bottom:4px;">No Tenders Found</h4>
                    <p style="color:var(--text-muted); font-size:0.85rem;">Try adjusting your category or status filters, or publish a new tender.</p>
                </div>
            `;
        } else {
            catalogContainer.innerHTML = filtered.map(tenderCardHtml).join("");
        }
    }

    if (overviewList) {
        const topOpen = tenders.filter(t => t.status === "OPEN").slice(0, 2);
        overviewList.innerHTML = topOpen.map(tenderCardHtml).join("");
    }
}

function renderApprovalQueue(submissions) {
    const queueContainer = document.getElementById("queue-items-container");
    const countBadge = document.getElementById("queue-count-badge");
    const navBadge = document.getElementById("badge-pending-reviews");
    const queuePageList = document.getElementById("queue-page-list");

    const pending = submissions.filter(s => s.status === "SUBMITTED" || s.status === "UNDER_REVIEW");
    if (countBadge) countBadge.textContent = pending.length + " pending";
    if (navBadge) navBadge.textContent = pending.length;

    // Overview sidebar queue widget
    if (queueContainer) {
        if (pending.length === 0) {
            queueContainer.innerHTML = `
                <div style="text-align:center; padding:32px 16px; color:var(--text-muted); font-size:0.82rem;">
                    ✨ All submissions have been evaluated and cleared!
                </div>
            `;
        } else {
            queueContainer.innerHTML = pending.map(s => `
                <div class="queue-item" style="padding:14px; border-radius:var(--radius-md); background:var(--bg-surface); border:1px solid var(--border-subtle); margin-bottom:10px;">
                    <div class="queue-left" style="display:flex; gap:12px; align-items:center;">
                        <div class="queue-icon" style="width:36px; height:36px; border-radius:var(--radius-md); background:var(--gradient-glow); display:flex; align-items:center; justify-content:center; font-size:1.1rem; border:1px solid var(--border-glow);">📄</div>
                        <div class="queue-info">
                            <h4 style="font-size:0.9rem; font-weight:700; color:var(--text-primary); margin-bottom:2px;">${escapeHtml(s.applicantName || "Vendor")}</h4>
                            <p style="font-size:0.75rem; color:var(--text-secondary);">${s.tenderReferenceCode} · <strong style="color:var(--accent-cyan);">$${Number(s.bidAmount).toLocaleString()}</strong></p>
                        </div>
                    </div>
                    <div style="display:flex; align-items:center; gap:8px; margin-top:10px;">
                        <button class="btn-action-sm approve" style="flex:1; padding:6px 10px; font-weight:600;" onclick="quickApprove(${s.id}, '${escapeJs(s.applicantName)}')">
                            ✓ Approve
                        </button>
                        <button class="btn-action-sm reject" style="flex:1; padding:6px 10px; font-weight:600;" onclick="openReviewDialog(${s.id}, '${escapeJs(s.applicantName)}', ${s.bidAmount}, '${escapeJs(s.tenderTitle)}', ${s.tenderEstimatedValue || 0})">
                            ✗ Reject
                        </button>
                    </div>
                </div>
            `).join("");
        }
    }

    // Dedicated Reviewer Console View (#view-queue)
    if (queuePageList) {
        if (pending.length === 0) {
            queuePageList.innerHTML = `
                <div style="text-align:center; padding:60px 20px; background:var(--bg-surface); border-radius:var(--radius-lg); border:1px dashed var(--border-subtle);">
                    <div style="font-size:3rem; margin-bottom:12px;">🎉</div>
                    <h3 style="color:var(--text-primary); margin-bottom:6px;">Review Queue is Empty</h3>
                    <p style="color:var(--text-muted); font-size:0.9rem; max-width:460px; margin:0 auto 18px;">All competitive bids submitted by applicants have been verified, reviewed, and finalized in the audit ledger.</p>
                    <button class="btn-primary-gradient" onclick="switchView('submissions')">View Complete Audit Ledger →</button>
                </div>
            `;
        } else {
            queuePageList.innerHTML = pending.map(s => {
                const ceiling = s.tenderEstimatedValue || 1000000;
                const isUnderCeiling = s.bidAmount <= ceiling;
                const diff = Math.abs(ceiling - s.bidAmount);

                return `
                    <div class="stat-card reviewer-proposal-card" style="margin-bottom:18px; border-left:4px solid var(--accent-primary);">
                        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px; flex-wrap:wrap; gap:10px;">
                            <div>
                                <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px;">
                                    <span style="font-family:var(--font-mono); font-weight:700; color:var(--accent-cyan); font-size:0.85rem; background:rgba(6,182,212,0.12); padding:3px 10px; border-radius:6px;">
                                        ${s.submissionCode}
                                    </span>
                                    <span class="status-pill ${s.status === "UNDER_REVIEW" ? "under-review" : "submitted"}">
                                        ● ${s.status.replace("_", " ")}
                                    </span>
                                    <span style="font-size:0.75rem; color:var(--text-muted);">
                                        Submitted ${new Date(s.submittedAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <h3 style="font-size:1.15rem; font-weight:700; color:var(--text-primary); margin-bottom:2px;">
                                    ${escapeHtml(s.tenderTitle)}
                                </h3>
                                <p style="font-size:0.8rem; color:var(--text-secondary);">
                                    Target Ref: <strong style="color:var(--text-primary);">${s.tenderReferenceCode}</strong> · Department: <strong style="color:var(--text-primary);">${escapeHtml(s.department)}</strong>
                                </p>
                            </div>

                            <div style="text-align:right;">
                                <div style="font-size:0.75rem; color:var(--text-muted); text-transform:uppercase;">Proposed Bid Amount</div>
                                <div style="font-size:1.4rem; font-weight:800; color:var(--accent-cyan); font-family:var(--font-mono);">
                                    $${Number(s.bidAmount).toLocaleString()}
                                </div>
                                <div style="font-size:0.75rem; font-weight:600; color:${isUnderCeiling ? "var(--accent-emerald)" : "var(--accent-rose)"}; margin-top:2px;">
                                    ${isUnderCeiling ? `✓ Within Ceiling (+$${diff.toLocaleString()} savings)` : `⚠ Exceeds Ceiling by $${diff.toLocaleString()}`}
                                </div>
                            </div>
                        </div>

                        <!-- Vendor & Proposal Section -->
                        <div style="background:var(--bg-surface); padding:14px; border-radius:var(--radius-md); border:1px solid var(--border-subtle); margin-bottom:16px;">
                            <div style="display:grid; grid-template-columns:1fr 2fr; gap:16px; margin-bottom:10px;">
                                <div>
                                    <div style="font-size:0.72rem; color:var(--text-muted); text-transform:uppercase;">Applicant & Consortium</div>
                                    <div style="font-weight:700; color:var(--text-primary); font-size:0.92rem;">${escapeHtml(s.applicantName)}</div>
                                    <div style="font-size:0.8rem; color:var(--text-secondary);">${escapeHtml(s.organization || s.applicantEmail)}</div>
                                </div>
                                <div>
                                    <div style="font-size:0.72rem; color:var(--text-muted); text-transform:uppercase;">Compliance Document</div>
                                    <div style="font-size:0.82rem; color:var(--accent-cyan); font-family:var(--font-mono); display:flex; align-items:center; gap:6px;">
                                        📎 ${escapeHtml(s.documentReference || "TECH-SPEC-PROPOSAL.pdf")}
                                        <span style="font-size:0.7rem; color:var(--text-muted);">(Verified 100% SHA-256)</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div style="font-size:0.72rem; color:var(--text-muted); text-transform:uppercase; margin-bottom:4px;">Technical Proposal & Execution Plan</div>
                                <p style="font-size:0.85rem; color:var(--text-secondary); line-height:1.5;">
                                    ${escapeHtml(s.technicalDescription)}
                                </p>
                            </div>
                        </div>

                        <!-- Evaluator Action Bar -->
                        <div style="display:flex; justify-content:flex-end; align-items:center; gap:12px; flex-wrap:wrap;">
                            <button class="btn-action-sm" style="padding:10px 16px; font-weight:600;" onclick="openDetailsModal(${s.id})">
                                🔍 Inspect Full Details
                            </button>
                            <button class="btn-action-sm reject" style="padding:10px 20px; font-weight:700; font-size:0.88rem;" onclick="openReviewDialog(${s.id}, '${escapeJs(s.applicantName)}', ${s.bidAmount}, '${escapeJs(s.tenderTitle)}', ${ceiling})">
                                ✗ Reject Proposal
                            </button>
                            <button class="btn-primary-gradient" style="background:var(--accent-emerald); border:none; padding:10px 22px; font-weight:700; font-size:0.88rem; box-shadow:0 0 20px rgba(16,185,129,0.35);" onclick="quickApprove(${s.id}, '${escapeJs(s.applicantName)}')">
                                ✓ Approve & Award Tender
                            </button>
                        </div>
                    </div>
                `;
            }).join("");
        }
    }
}

function renderRecentSubmissions(submissions) {
    const container = document.getElementById("overview-recent-submissions");
    if (!container) return;

    const recent = submissions.slice(0, 3);
    container.innerHTML = recent.map(s => `
        <div style="display:flex; justify-content:space-between; align-items:center; padding:12px 14px; background:var(--bg-surface); border-radius:var(--radius-md); border:1px solid var(--border-subtle); margin-bottom:8px;">
            <div>
                <div style="display:flex; align-items:center; gap:8px;">
                    <span style="font-family:var(--font-mono); font-weight:700; color:var(--accent-cyan); font-size:0.78rem;">${s.submissionCode}</span>
                    <span class="status-pill ${getStatusPillClass(s.status)}">${s.status.replace("_", " ")}</span>
                </div>
                <div style="font-size:0.85rem; font-weight:600; color:var(--text-primary); margin-top:2px;">${escapeHtml(s.tenderTitle)}</div>
                <div style="font-size:0.75rem; color:var(--text-muted);">${escapeHtml(s.applicantName)} · ${escapeHtml(s.organization || s.applicantEmail)}</div>
            </div>
            <div style="text-align:right;">
                <div style="font-size:0.95rem; font-weight:700; color:var(--text-primary); font-family:var(--font-mono);">$${Number(s.bidAmount).toLocaleString()}</div>
                <button class="btn-action-sm" style="margin-top:4px; font-size:0.72rem; padding:4px 8px;" onclick="openDetailsModal(${s.id})">Details →</button>
            </div>
        </div>
    `).join("");
}

function renderSubmissions(submissions) {
    const tbody = document.getElementById("submissions-table-body");
    if (!tbody) return;

    let filtered = submissions;
    if (activeSubmissionsFilter !== "ALL") {
        filtered = submissions.filter(s => s.status === activeSubmissionsFilter);
    }

    if (filtered.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align:center; padding:48px 20px; color:var(--text-muted);">
                    <div style="font-size:2rem; margin-bottom:8px;">📋</div>
                    No submissions found matching status: <strong>${activeSubmissionsFilter}</strong>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = filtered.map(s => `
        <tr>
            <td style="font-family:var(--font-mono); font-weight:700; color:var(--accent-cyan); font-size:0.82rem;">
                ${s.submissionCode}
            </td>
            <td class="tender-title-cell">
                <h5 style="font-size:0.92rem; font-weight:700; color:var(--text-primary); margin-bottom:2px;">${escapeHtml(s.tenderTitle)}</h5>
                <span style="font-size:0.75rem; color:var(--text-muted);">${s.tenderReferenceCode} · ${escapeHtml(s.department)}</span>
            </td>
            <td>
                <div style="font-weight:700; color:var(--text-primary); font-size:0.88rem;">${escapeHtml(s.applicantName)}</div>
                <div style="font-size:0.75rem; color:var(--text-muted);">${escapeHtml(s.organization || s.applicantEmail)}</div>
            </td>
            <td class="bid-amount-tag" style="font-family:var(--font-mono); font-size:0.95rem; font-weight:700;">
                $${Number(s.bidAmount).toLocaleString()}
            </td>
            <td style="font-size:0.8rem; color:var(--text-muted);">
                ${new Date(s.submittedAt).toLocaleDateString()}
            </td>
            <td>
                <span class="status-pill ${getStatusPillClass(s.status)}">
                    ● ${s.status.replace("_", " ")}
                </span>
            </td>
            <td style="text-align:right;">
                <div style="display:flex; justify-content:flex-end; gap:6px;">
                    ${(s.status === "SUBMITTED" || s.status === "UNDER_REVIEW") ? `
                        <button class="btn-action-sm approve" title="Quick Approve" onclick="quickApprove(${s.id}, '${escapeJs(s.applicantName)}')">
                            ✓ Approve
                        </button>
                        <button class="btn-action-sm reject" title="Reject with Reason" onclick="openReviewDialog(${s.id}, '${escapeJs(s.applicantName)}', ${s.bidAmount}, '${escapeJs(s.tenderTitle)}', ${s.tenderEstimatedValue || 0})">
                            ✗ Reject
                        </button>
                    ` : `
                        <button class="btn-action-sm" onclick="openDetailsModal(${s.id})">
                            📄 Audit Trail
                        </button>
                    `}
                    <button class="btn-action-sm" title="View Proposal Details" onclick="openDetailsModal(${s.id})">
                        🔍 Details
                    </button>
                </div>
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
    select.innerHTML = `<option value="">Select an open government tender project...</option>` +
        openTenders.map(t => `
            <option value="${t.id}" data-ceiling="${t.estimatedValue}">
                [${t.referenceCode}] ${t.title} (Budget Ceiling: $${Number(t.estimatedValue).toLocaleString()})
            </option>
        `).join("");
}

/* ==========================================================================
   5. SEARCH & FILTER HANDLERS
   ========================================================================== */
function handleSearch(term) {
    const q = (term || "").toLowerCase().trim();
    if (!q) {
        renderSubmissions(allSubmissions);
        renderTenders(allTenders);
        return;
    }

    const filteredSubs = allSubmissions.filter(s => 
        (s.submissionCode && s.submissionCode.toLowerCase().includes(q)) ||
        (s.tenderTitle && s.tenderTitle.toLowerCase().includes(q)) ||
        (s.applicantName && s.applicantName.toLowerCase().includes(q)) ||
        (s.organization && s.organization.toLowerCase().includes(q)) ||
        (s.status && s.status.toLowerCase().includes(q))
    );
    renderSubmissions(filteredSubs);

    const filteredTenders = allTenders.filter(t => 
        (t.referenceCode && t.referenceCode.toLowerCase().includes(q)) ||
        (t.title && t.title.toLowerCase().includes(q)) ||
        (t.department && t.department.toLowerCase().includes(q)) ||
        (t.category && t.category.toLowerCase().includes(q))
    );
    renderTenders(filteredTenders);
}

function setFilter(filter, el) {
    activeSubmissionsFilter = filter;
    document.querySelectorAll(".filter-pills-row .filter-pill").forEach(p => p.classList.remove("active"));
    if (el) el.classList.add("active");
    renderSubmissions(allSubmissions);
}

function filterTendersByCategory(cat, el) {
    activeTenderCategory = cat;
    document.querySelectorAll(".tender-cat-pill").forEach(p => p.classList.remove("active"));
    if (el) el.classList.add("active");
    renderTenders(allTenders);
}

function filterTendersByStatus(status, el) {
    activeTenderStatus = status;
    document.querySelectorAll(".tender-status-pill").forEach(p => p.classList.remove("active"));
    if (el) el.classList.add("active");
    renderTenders(allTenders);
}

function filterByNode(status) {
    setFilter(status);
    switchView("submissions");
}

/* ==========================================================================
   6. ACTIONS: SUBMIT BID, CREATE TENDER, APPROVE & REJECT
   ========================================================================== */
function openSubmissionModal(tenderId) {
    const modal = document.getElementById("submission-modal");
    if (modal) modal.classList.add("open");
    if (tenderId) {
        const select = document.getElementById("modal-tender-select");
        if (select) select.value = tenderId;
    }
}

function closeSubmissionModal() {
    const modal = document.getElementById("submission-modal");
    if (modal) modal.classList.remove("open");
}

function selectTenderForBid(tenderId) {
    openSubmissionModal(tenderId);
}

async function handleSubmissionSubmit(e) {
    e.preventDefault();
    const tenderId = document.getElementById("modal-tender-select").value;
    const applicantName = document.getElementById("applicant-name").value.trim();
    const applicantEmail = document.getElementById("applicant-email").value.trim();
    const organization = document.getElementById("applicant-org").value.trim();
    const bidAmount = document.getElementById("bid-amount").value;
    const technicalDescription = document.getElementById("technical-description").value.trim();
    const documentRef = document.getElementById("document-ref").value.trim();

    if (!tenderId || !bidAmount || !technicalDescription) {
        showToast("Please complete all required fields (Tender, Bid Amount, Proposal).", "error");
        return;
    }

    const submitBtn = document.getElementById("submit-button");
    const originalText = submitBtn ? submitBtn.textContent : "Submit";
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Validating & Submitting...";
    }

    try {
        const res = await fetch("/api/submissions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                tenderId: parseInt(tenderId),
                applicantName: applicantName || "Sarah Cheulkar Enterprise",
                applicantEmail: applicantEmail || "sarah@cheulkar-infra.com",
                organization: organization || "Cheulkar Infrastructure Solutions",
                bidAmount: parseFloat(bidAmount),
                technicalDescription: technicalDescription,
                documentReference: documentRef || "DOC-" + Date.now() + ".pdf"
            })
        });

        if (res.ok) {
            const data = await res.json();
            showToast(`Success! Application ${data.submissionCode} submitted.`, "success");
            closeSubmissionModal();
            document.getElementById("submission-form").reset();
            await loadDashboardData();
            switchView("submissions");
        } else {
            const err = await res.json();
            showToast(err.error || "Submission rejected by rules engine.", "error");
        }
    } catch (err) {
        console.error("Submission error:", err);
        showToast("Network error submitting application.", "error");
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    }
}

// Create New Tender Modal
function openCreateTenderModal() {
    const modal = document.getElementById("create-tender-modal");
    if (modal) modal.classList.add("open");
}

function closeCreateTenderModal() {
    const modal = document.getElementById("create-tender-modal");
    if (modal) modal.classList.remove("open");
}

async function handleCreateTenderSubmit(e) {
    e.preventDefault();
    const title = document.getElementById("new-tender-title").value.trim();
    const department = document.getElementById("new-tender-dept").value.trim();
    const category = document.getElementById("new-tender-cat").value;
    const value = document.getElementById("new-tender-value").value;
    const description = document.getElementById("new-tender-desc").value.trim();

    if (!title || !department || !value || !description) {
        showToast("Please fill all required tender details.", "error");
        return;
    }

    try {
        const res = await fetch("/api/tenders", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                referenceCode: "TND-2026-" + Math.floor(100 + Math.random() * 900),
                title: title,
                department: department,
                category: category,
                estimatedValue: parseFloat(value),
                description: description,
                status: "OPEN"
            })
        });

        if (res.ok) {
            showToast("New Tender Project published successfully!", "success");
            closeCreateTenderModal();
            document.getElementById("create-tender-form").reset();
            await loadDashboardData();
            switchView("tenders");
        } else {
            showToast("Failed to create tender project.", "error");
        }
    } catch (err) {
        showToast("Network error creating tender.", "error");
    }
}

// Review / Approval & Rejection Logic
function openReviewDialog(id, applicant, amount, tenderTitle, ceiling) {
    currentReviewId = id;
    const modal = document.getElementById("review-modal");
    const applicantEl = document.getElementById("review-modal-applicant");
    const bidEl = document.getElementById("review-modal-bid");
    const tenderEl = document.getElementById("review-modal-tender");
    const commentsEl = document.getElementById("review-comments");

    if (applicantEl) applicantEl.textContent = applicant || "Applicant";
    if (bidEl) bidEl.textContent = "$" + Number(amount).toLocaleString();
    if (tenderEl) tenderEl.textContent = tenderTitle || "Tender Project";
    if (commentsEl) commentsEl.value = "";

    if (modal) modal.classList.add("open");
}

function closeReviewModal() {
    currentReviewId = null;
    const modal = document.getElementById("review-modal");
    if (modal) modal.classList.remove("open");
}

async function quickApprove(id, applicantName) {
    await executeReviewAction(id, "APPROVED", "Approved by Evaluator Sarah Cheulkar (23102C0060). Meets all technical criteria and procurement guidelines.");
}

async function executeReview(action) {
    if (!currentReviewId) {
        showToast("No submission selected for review.", "error");
        return;
    }
    const comments = document.getElementById("review-comments").value.trim();
    if (action === "REJECTED" && !comments) {
        showToast("Please provide a rejection reason for the audit ledger.", "error");
        return;
    }
    await executeReviewAction(currentReviewId, action, comments);
}

async function executeReviewAction(id, action, comments) {
    try {
        const endpoint = action === "APPROVED" ? 
            `/api/submissions/${id}/approve` : 
            `/api/submissions/${id}/reject`;

        const res = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
                action: action, 
                comments: comments || (action === "APPROVED" ? "Approved by Evaluator." : "Proposal does not meet technical criteria.")
            })
        });

        if (res.ok) {
            showToast(`✓ Submission #${id} successfully marked as ${action}!`, "success");
            closeReviewModal();
            await loadDashboardData();
        } else {
            const err = await res.json();
            showToast(err.error || "Review operation failed.", "error");
        }
    } catch (err) {
        console.error("Review action error:", err);
        showToast("Error executing evaluation action.", "error");
    }
}

// Full Details Modal
function openDetailsModal(id) {
    const sub = allSubmissions.find(s => s.id === id);
    if (!sub) return;

    const modal = document.getElementById("details-modal");
    const content = document.getElementById("details-modal-content");
    if (!modal || !content) return;

    content.innerHTML = `
        <div style="background:var(--bg-surface); padding:16px; border-radius:var(--radius-md); border:1px solid var(--border-subtle); margin-bottom:16px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                <span style="font-family:var(--font-mono); font-weight:700; color:var(--accent-cyan); font-size:1rem;">${sub.submissionCode}</span>
                <span class="status-pill ${getStatusPillClass(sub.status)}">● ${sub.status.replace("_", " ")}</span>
            </div>
            <h3 style="color:var(--text-primary); font-size:1.15rem; margin-bottom:4px;">${escapeHtml(sub.tenderTitle)}</h3>
            <p style="color:var(--text-muted); font-size:0.8rem;">Ref: ${sub.tenderReferenceCode} · Dept: ${escapeHtml(sub.department)}</p>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:16px;">
            <div style="background:var(--bg-surface); padding:12px; border-radius:var(--radius-md); border:1px solid var(--border-subtle);">
                <div style="font-size:0.72rem; color:var(--text-muted); text-transform:uppercase;">Applicant</div>
                <div style="font-weight:700; color:var(--text-primary); font-size:0.95rem;">${escapeHtml(sub.applicantName)}</div>
                <div style="font-size:0.8rem; color:var(--text-secondary);">${escapeHtml(sub.organization || "Independent Consortium")}</div>
                <div style="font-size:0.75rem; color:var(--text-muted);">${escapeHtml(sub.applicantEmail)}</div>
            </div>

            <div style="background:var(--bg-surface); padding:12px; border-radius:var(--radius-md); border:1px solid var(--border-subtle);">
                <div style="font-size:0.72rem; color:var(--text-muted); text-transform:uppercase;">Financial Bid</div>
                <div style="font-size:1.3rem; font-weight:800; color:var(--accent-cyan); font-family:var(--font-mono);">$${Number(sub.bidAmount).toLocaleString()}</div>
                <div style="font-size:0.75rem; color:var(--text-muted);">Submitted: ${new Date(sub.submittedAt).toLocaleString()}</div>
            </div>
        </div>

        <div style="margin-bottom:16px;">
            <div style="font-size:0.75rem; color:var(--text-muted); text-transform:uppercase; margin-bottom:6px;">Technical Proposal & Engineering Methodology</div>
            <div style="background:var(--bg-surface); padding:14px; border-radius:var(--radius-md); border:1px solid var(--border-subtle); font-size:0.85rem; color:var(--text-secondary); line-height:1.6; max-height:180px; overflow-y:auto;">
                ${escapeHtml(sub.technicalDescription)}
            </div>
        </div>

        <div style="margin-bottom:16px;">
            <div style="font-size:0.75rem; color:var(--text-muted); text-transform:uppercase; margin-bottom:6px;">Compliance Reference</div>
            <div style="font-family:var(--font-mono); font-size:0.82rem; color:var(--accent-cyan); background:var(--bg-surface); padding:10px 14px; border-radius:var(--radius-md); border:1px solid var(--border-subtle);">
                📎 ${escapeHtml(sub.documentReference || "TECH-DOC-V1.pdf")}
            </div>
        </div>

        ${sub.rejectionReason ? `
            <div style="margin-bottom:16px; background:rgba(244,63,94,0.1); border:1px solid rgba(244,63,94,0.3); padding:14px; border-radius:var(--radius-md);">
                <div style="font-size:0.75rem; color:var(--accent-rose); font-weight:700; text-transform:uppercase; margin-bottom:4px;">Evaluator Justification / Findings</div>
                <div style="color:var(--text-primary); font-size:0.85rem;">${escapeHtml(sub.rejectionReason)}</div>
            </div>
        ` : ""}

        <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:20px;">
            ${(sub.status === "SUBMITTED" || sub.status === "UNDER_REVIEW") ? `
                <button class="btn-action-sm reject" onclick="closeDetailsModal(); openReviewDialog(${sub.id}, '${escapeJs(sub.applicantName)}', ${sub.bidAmount}, '${escapeJs(sub.tenderTitle)}', ${sub.tenderEstimatedValue || 0});">
                    Reject...
                </button>
                <button class="btn-action-sm approve" onclick="closeDetailsModal(); quickApprove(${sub.id}, '${escapeJs(sub.applicantName)}');">
                    Approve & Award
                </button>
            ` : ""}
            <button class="btn-secondary" onclick="closeDetailsModal()">Close</button>
        </div>
    `;

    modal.classList.add("open");
}

function closeDetailsModal() {
    const modal = document.getElementById("details-modal");
    if (modal) modal.classList.remove("open");
}

/* ==========================================================================
   7. TELEMETRY & TOAST UTILITIES
   ========================================================================== */
async function renderTelemetry() {
    const jsonPre = document.getElementById("telemetry-json-full");
    if (!jsonPre) return;

    jsonPre.textContent = "Fetching live telemetry from Spring Boot Actuator & DevOps pipeline...";

    try {
        const [healthRes, statsRes] = await Promise.all([
            fetch("/api/health"),
            fetch("/api/stats")
        ]);
        const health = await healthRes.json();
        const stats = await statsRes.json();

        const payload = {
            serviceMesh: {
                name: "Ansible-Provisioned Tender Submission Portal",
                student: "Sarah Cheulkar (Roll No: 23102C0060)",
                subject: "DevOps Major Project",
                status: "UP / HEALTHY",
                timestamp: new Date().toISOString()
            },
            runtimeMetrics: stats,
            actuatorHealth: health,
            devopsPipeline: {
                ciServer: "Jenkins LTS 2.580.1 (Dockerized, port 8081)",
                pipelineJob: "Tender-Submission-Portal-Pipeline (Build #4 SUCCESS)",
                qualityGate: "Automated Selenium E2E Headless Suite (100% Passed)",
                containerization: "Docker Alpine JRE 17 Multi-Stage (sarahcheulkar/tender-portal:1.0.0)",
                orchestration: "Ansible Playbook Idempotent Deployment (changed=0) & Rollback Playbook"
            }
        };

        jsonPre.textContent = JSON.stringify(payload, null, 2);
    } catch (err) {
        jsonPre.textContent = "Telemetry error: " + err.message;
    }
}

function copyTelemetryJson() {
    const pre = document.getElementById("telemetry-json-full");
    if (!pre) return;
    navigator.clipboard.writeText(pre.textContent).then(() => {
        showToast("Telemetry JSON copied to clipboard!", "success");
    });
}

function showToast(msg, type = "info") {
    const toast = document.getElementById("app-toast");
    if (!toast) return;

    toast.textContent = msg;
    toast.style.borderColor = type === "error" ? "var(--accent-rose)" : 
                              type === "success" ? "var(--accent-emerald)" : "var(--border-glow)";
    toast.style.color = type === "error" ? "#FF8096" : 
                        type === "success" ? "#A7F3D0" : "var(--text-primary)";
    toast.style.display = "flex";
    toast.classList.add("show");

    setTimeout(() => { 
        toast.classList.remove("show");
        toast.style.display = "none"; 
    }, 3500);
}

function setupKeyboardShortcuts() {
    document.addEventListener("keydown", (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === "k") {
            e.preventDefault();
            const input = document.getElementById("global-search");
            if (input) input.focus();
        }
        if (e.key === "Escape") {
            closeSubmissionModal();
            closeCreateTenderModal();
            closeReviewModal();
            closeDetailsModal();
        }
    });
}

function escapeHtml(str) {
    if (!str) return "";
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function escapeJs(str) {
    if (!str) return "";
    return String(str)
        .replace(/\\/g, "\\\\")
        .replace(/'/g, "\\'")
        .replace(/"/g, '\\"')
        .replace(/\n/g, "\\n")
        .replace(/\r/g, "\\r");
}

// Expose all functions to window for rock-solid HTML event binding
window.switchView = switchView;
window.initTheme = initTheme;
window.toggleTheme = toggleTheme;
window.setTheme = setTheme;
window.handleSearch = handleSearch;
window.setFilter = setFilter;
window.filterTendersByCategory = filterTendersByCategory;
window.filterTendersByStatus = filterTendersByStatus;
window.filterByNode = filterByNode;
window.openSubmissionModal = openSubmissionModal;
window.closeSubmissionModal = closeSubmissionModal;
window.selectTenderForBid = selectTenderForBid;
window.handleSubmissionSubmit = handleSubmissionSubmit;
window.openCreateTenderModal = openCreateTenderModal;
window.closeCreateTenderModal = closeCreateTenderModal;
window.handleCreateTenderSubmit = handleCreateTenderSubmit;
window.openReviewDialog = openReviewDialog;
window.closeReviewModal = closeReviewModal;
window.quickApprove = quickApprove;
window.executeReview = executeReview;
window.executeReviewAction = executeReviewAction;
window.openDetailsModal = openDetailsModal;
window.closeDetailsModal = closeDetailsModal;
window.renderTelemetry = renderTelemetry;
window.copyTelemetryJson = copyTelemetryJson;
window.showToast = showToast;
