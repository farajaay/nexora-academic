# Public project evidence

Checked 2026-10-23 against the owner’s GitHub repositories, READMEs and package
manifests. This is a curated snapshot, not a GitHub API integration in visitors’
browsers. Edit `src/config/projects.ts` after checking evidence when a project’s
status changes. Metadata, fallback HTML and assistant guides must agree.

“Recent” means a public, nonempty, nonarchived original repository with code
updates since July 2026. Forks, empty repositories and private projects were
excluded. The Nexora site itself is not counted as a portfolio entry. Repository
ownership does not by itself prove a client commission or corporate endorsement.
No commercial results or customer metrics are asserted.

| Project                      | Evidence at inspected commit                                                                                                                   | Last code commit | Presentation                                                                                                                          |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| ATEMA Studio                 | [README](https://github.com/farajaay/atema-studio/blob/518bde8d3ecb7c83619d7f8705f935add80ceda7/README.md), package.json                       | 2026-10-23       | Published beta; booking/admin implementation and integrations documented. No claim that payment or messaging was tested here.         |
| MRO Optix                    | [README](https://github.com/farajaay/mro-optix/blob/aa5afdb7b2c6d60c89b240f587ee1ecb1849a289/README.md), index.html                            | 2026-09-14       | Excel workflow; v2.1 candidate, sales closed, native Windows Excel acceptance/protection/delivery pending. No live ERP integration.   |
| Employee OS                  | [README](https://github.com/farajaay/employee-os/blob/0d109b848d9c770706555ba59171a987607bd895/README.md), package.json                        | 2026-08-26       | Compiling skeleton, router/shell/state and tested contracts. Remaining product behavior, PWA and store releases are planned.          |
| Majlis                       | [README](https://github.com/farajaay/Majlis/blob/682e89532d40db08f729a03b71deaa82a365a19f/README.md), webapp/package.json                      | 2026-07-28       | Self-hosted FastAPI/CLI hub and Next.js implementation. Configured access required.                                                   |
| Saudi Industry Forum planner | [README](https://github.com/farajaay/saudi-industry-forum-event-planner/blob/41bd9fcf8a59f4180115f21993049d033a2bdedc/README.md), package.json | 2026-07-24       | Workbook-driven application; edits are a local overlay with JSON import/export, not writes to hosted workbooks.                       |
| HADEED dashboard             | [README](https://github.com/farajaay/HADEED-TA-Command-center/blob/1fad997e6571188610643d3457a12e6bd609be06/README.md)                         | 2026-07-11       | Static working aid with director/manager views and shared scoring; the controlled workbook and data-quality log remain authoritative. |

Dates use the current default-branch commit, rather than `pushed_at`, which may
reflect activity on a different branch. Status descriptions and technology
lists are deliberately limited to the inspected documentation/manifests.
Design-intent words are editorial descriptions of the interfaces, not results
of user research or owner-supplied historical project briefs.

## Published links and captures

GET checks returned HTTP 200 for https://atemastudio.xyz/,
https://farajaay.github.io/mro-optix/,
https://farajaay.github.io/saudi-industry-forum-event-planner/ and
https://farajaay.github.io/HADEED-TA-Command-center/.
The Majlis repository’s listed `https://majlis-webapp.vercel.app/` returned
404, so it is omitted from the website. Employee OS has no verified public
deployment in the inspected metadata.

`public/projects/atema-studio.jpg` and `mro-optix.jpg` are actual 1280 × 800
landing-page captures taken on this date, not generated screens. Chromium
requests were routed through a Node HTTP client using the environment’s trusted
proxy CA, preserving request headers and verifying TLS. Non-GET/HEAD requests
were blocked. The final captures had no failed GET resources. ATEMA visibly
labels itself beta. MRO’s marketing illustration is labelled as such on the
source website and in the portfolio caption; it is not a workbook screenshot.

The remaining covers are explicitly labelled project overviews. They state
project names and types without imitating an interface, displaying private
records or republishing operational budgets and performance values.

## Verification

Build and lint passed. Seven unit checks and seven static SEO/fallback checks
passed. Browser checks cover six project source links, status limits, keyboard
filtering, language switching, next-project anchors, homepage deep links and
image-error fallback. Accessibility scans passed for the portfolio in both
languages and both modes on desktop and mobile; the existing homepage contrast
and navigation checks also passed. Home and portfolio were checked at 360,
768 and 1280px in both languages and modes (24 combinations), with no horizontal
overflow or browser exceptions.
