# CS Bachelor's Journey V2 — Independent (Prototype)

Standalone mobile-first PWA project. This is **not** built on, nor does it fetch data from, the original repository. The original repository remains unchanged.

## Current working features

- Arabic, responsive, light-purple/blue study interface inspired by the **user-approved design #2** (approximation, not pixel-perfect).
- Courses and lesson management.
- **CS101 — مدخل علوم الحاسب والبرمجة** marked **completed** from the initial state, on user's self-report, with no generated lectures. `completedAt: 2026-11-23`, `completionSource: self_report`. It counts in progress even without content.
- An explicitly **demo** Calculus course and example lesson for testing. It may be deleted.
- Independent AI generation of reading, interactions, lab definition, and quiz; one **Generate all** control generates sequentially and saves each successful result independently.
- Reading in a clean reader view; additional explanation (`مش فاهم؟`) stored under the lesson; notes, concepts list, quiz grading; working draggable slider-based quadratic-function graph.
- Local persistence in `localStorage`, JSON export/import, optional **manual** GitHub repository-file sync, distinct from original `progress.json`.
- Installable PWA: manifest, icons, service worker and mobile responsive layout.
- Separate session-only API key and GitHub PAT storage (not included in backups). The API key is still sent directly from the user's browser to Google. This is for a personal prototype, **not** a secure multi-user production architecture.

## Known limitations (must be addressed before final approval)

- The app is an independently implemented **prototype**, not the finished complete degree curriculum. The course library is not populated with all curriculum courses and lessons yet.
- Visual appearance follows the approved design direction, **not** pixel-perfect or fully tested against the image.
- Gemini integration was tested through mocked responses, not with a real API key. API quota/429 is an external dependency. Model identifier may need updating. Generated sections depend on successful schema-compliant responses.
- Simulator engine currently supports only a quadratic-function graph with variable coefficient. For unrelated lesson topics it can correctly report `unsupported`. A vetted simulation component library must be built before claiming all labs work.
- Generated activities currently support multiple-choice and sliders, not every type of Brilliant-style activity.
- GitHub sync is **manual overwrite on push/pull**, not a conflict-resolving auto-sync. Take a backup before each transfer. The GitHub PAT has repository-content access; prefer a **private separate data repository** so personal progress data is not published in the public app repository.
- PWA runtime and installation need real deployment on HTTPS / GitHub Pages and a real Android test. Offline use caches static app files, not remote API responses.
- If the API key is exposed to untrusted page scripts (e.g. extensions), sessionStorage does not provide complete protection. Use a backend relay before sharing the app with others.

## Deploy without a ChatGPT GitHub connector

1. Create a **new** repository, e.g. `CS-Bachelors-Journey-V2-Independent`.
2. Upload the files and folders from this package **to the repository root** (`index.html`, `app.js`, `style.css`, `manifest.webmanifest`, `sw.js`, `icons/`, `.github/`). Do not upload this folder as a nested directory.
3. Go to GitHub **Settings → Pages → Build and deployment → Source: GitHub Actions**. The provided Pages workflow will deploy the site.
4. Visit `https://YOUR-USERNAME.github.io/CS-Bachelors-Journey-V2-Independent/` (if using the suggested repository name).
5. On Android Chrome, use **Install app** / **Add to Home screen** where supported.
6. In Settings, add your own Gemini key and a model that your project can access; do not paste it into GitHub source code.

## Test checklist

- Open Home → Progress: see CS101 `completed`, despite having no generated lessons.
- Courses → select demo lesson → Reading → Generate Reading.
- Lesson → Generate All: each section saves separately; refresh and verify persistence.
- Lab: change coefficient `a` by slider and verify graph changes; Quiz: submit answers and see explanations.
- Save a note → refresh → verify note persists.
- Download backup, then import it on a different device to test portable state. A separate private repository may be configured for manual GitHub sync.
- Verify Android touch support, scrolling, PWA installation, and static-file offline navigation after deployment.

## Data safety

Never publish Gemini API keys or GitHub PATs. Do not grant the token access to the original project; keep V2 syncing to its own private data repository. `localStorage` alone is not a cross-device sync mechanism. A full backend is recommended for safe automatic sync.


## تحديث V2.1
- ما اتغيرش مفتاح localStorage أو version=2 عشان الدروس السابقة وحالة CS101 يفضلوا موجودين.
- التفاعل بيدعم اختيار متعدد، اكتشاف خطأ، ترتيب خطوات، وSlider ويحفظ الإجابات.
- المختبر بيدعم منحنى دالة تربيعية ومماس وقاطع وقيم عددية متغيرة؛ الأنواع الأخرى بتظهر رسالة واضحة بدل تشغيل كود غير موثوق.
- نموذج البيانات القديمة في الدروس باقٍ صالحًا للعرض. لإظهار نوع مختبر المشتقة الجديد في درس متولد من قبل، أعد توليد المختبر فقط (بعد تصدير نسخة احتياطية).
- توليد Gemini حي يحتاج مفتاح صالح وحصة فعلية، ولم يتم اختباره عبر API المستخدم في بيئة التطوير.
- تجنب التحديث من نافذة بها بيانات غير محفوظة، وصدّر نسخة احتياطية قبل استبدال ملفات النشر.
